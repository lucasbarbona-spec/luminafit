'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useArgentinaLocale } from '@/lib/hooks/useArgentinaLocale';
import { useClientRoutines, useClientProgress, useClientAchievements } from '@/lib/hooks/useFirestore';
import ClientNav from '@/components/navigation/ClientNav';
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Award, 
  Calendar, 
  Clock, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Heart, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  Bell, 
  Search, 
  Filter, 
  ChevronRight, 
  Star, 
  Users, 
  Flame,
  Trophy,
  Medal,
  Crown,
  Diamond,
  Plus,
  Settings,
  LogOut,
  ShoppingCart
} from 'lucide-react';

interface QuickStats {
  completedSessions: number;
  totalProgress: number;
  exercisesCompleted: number;
  achievementsUnlocked: number;
  weeklyStreak: number;
  totalCalories: number;
}

interface CurrentRoutine {
  id: string;
  name: string;
  description: string;
  duration: string;
  frequency: string;
  nextSession: string;
  progress: number;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight?: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface WeeklyProgress {
  day: string;
  completed: boolean;
  percentage: number;
  exercises: number;
  totalExercises: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  category: 'strength' | 'cardio' | 'consistency' | 'milestone';
}

interface UpcomingSession {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'recovery';
  trainer: string;
  location: string;
}

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  const { formatDate, formatTime, formatDateTime } = useArgentinaLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Usar hooks de Firestore para datos reales
  const { rutinas, loading: rutinasLoading } = useClientRoutines(user?.uid);
  const { progreso, loading: progresoLoading } = useClientProgress(user?.uid);
  const { logros, loading: logrosLoading } = useClientAchievements(user?.uid);

  const [quickStats, setQuickStats] = useState<QuickStats>({
    completedSessions: 0,
    totalProgress: 0,
    exercisesCompleted: 0,
    achievementsUnlocked: 0,
    weeklyStreak: 0,
    totalCalories: 0
  });

  const [currentRoutine, setCurrentRoutine] = useState<CurrentRoutine | null>(null);
  const [hasRoutines, setHasRoutines] = useState(false);

  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([
    { day: 'Lun', completed: false, percentage: 0, exercises: 0, totalExercises: 0 },
    { day: 'Mar', completed: false, percentage: 0, exercises: 0, totalExercises: 0 },
    { day: 'Mié', completed: false, percentage: 0, exercises: 0, totalExercises: 0 },
    { day: 'Jue', completed: false, percentage: 0, exercises: 0, totalExercises: 0 },
    { day: 'Vie', completed: false, percentage: 0, exercises: 0, totalExercises: 0 },
    { day: 'Sáb', completed: false, percentage: 0, exercises: 0, totalExercises: 0 },
    { day: 'Dom', completed: false, percentage: 0, exercises: 0, totalExercises: 0 }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);

  // Calcular estadísticas basadas en datos reales
  useEffect(() => {
    if (!rutinasLoading && !progresoLoading && !logrosLoading) {
      // Calcular estadísticas
      const completedSessions = progreso.length;
      const exercisesCompleted = progreso.reduce((acc, p) => acc + (typeof p.ejerciciosCompletados === 'number' ? p.ejerciciosCompletados : 0), 0);
      const achievementsUnlocked = logros.filter(l => l.unlocked).length;
      
      setQuickStats({
        completedSessions,
        totalProgress: rutinas.length > 0 ? Math.round((completedSessions / (rutinas.length * 8)) * 100) : 0,
        exercisesCompleted,
        achievementsUnlocked,
        weeklyStreak: 0, // Calcular basado en fechas de progreso
        totalCalories: progreso.reduce((acc, p) => acc + (typeof p.calorias === 'number' ? p.calorias : 0), 0)
      });

      // Establecer rutina actual (la primera activa)
      if (rutinas.length > 0) {
        const rutinaActiva = rutinas[0];
        setCurrentRoutine({
          id: rutinaActiva.id,
          name: rutinaActiva.nombre,
          description: rutinaActiva.descripcion || '',
          duration: `${rutinaActiva.semanas || 8} semanas`,
          frequency: '4 días por semana',
          nextSession: 'Próxima sesión',
          progress: 0,
          exercises: (rutinaActiva.bloques?.flatMap((b: { ejercicios?: unknown[] }) => b.ejercicios || []) || []).map((e: unknown) => {
            const exercise = e as { id: string; nombre: string; series?: number; repeticiones?: string; peso?: number; intensidad?: string };
            return {
              id: exercise.id,
              name: exercise.nombre,
              sets: String(exercise.series || 3),
              reps: exercise.repeticiones || '10',
              weight: exercise.peso ? String(exercise.peso) : undefined,
              completed: false,
              difficulty: exercise.intensidad === 'Alta' ? 'hard' : exercise.intensidad === 'Media' ? 'medium' : 'easy'
            };
          }) || []
        });
        setHasRoutines(true);
      } else {
        setCurrentRoutine(null);
        setHasRoutines(false);
      }

      // Convertir logros de Firestore al formato del dashboard
      setAchievements(logros.map(l => ({
        id: l.id,
        title: (l.titulo as string) || (l.nombre as string) || 'Logro',
        description: (l.descripcion as string) || '',
        icon: <Trophy className="w-6 h-6" />,
        unlocked: (l.unlocked as boolean) || false,
        unlockedDate: l.unlockedAt ? formatDate(l.unlockedAt) : undefined,
        progress: (l.progreso as number) || 0,
        maxProgress: (l.progresoMaximo as number) || 100,
        category: (l.categoria as 'strength' | 'cardio' | 'consistency' | 'milestone') || 'milestone'
      })));
    }
  }, [rutinas, progreso, logros, rutinasLoading, progresoLoading, logrosLoading, formatDate]);

  const handleStartSession = (routineId: string) => {
    router.push(`/client/routines/${routineId}/session`);
  };

  const handleViewProgress = () => {
    router.push('/client/progress');
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== 'client') {
      router.push('/trainer/dashboard');
    }
  }, [user, loading, router]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage > 0) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return Zap;
      case 'cardio': return Heart;
      case 'consistency': return Flame;
      case 'milestone': return Trophy;
      default: return Award;
    }
  };

  const handleViewRoutine = () => {
    router.push('/client/routines');
  };

  const handleViewMarketplace = () => {
    router.push('/client/marketplace');
  };

  const handleSearch = () => {
    // Implementar búsqueda de rutinas o ejercicios
    setSearchQuery('');
  };

  const handleNotifications = () => {
    router.push('/client/messages'); // Usar messages como notificaciones por ahora
  };

  const handleSettings = () => {
    router.push('/client/settings');
  };

  const handleViewSessionDetails = (sessionId: string) => {
    router.push('/client/calendar'); // Redirigir al calendario para ver detalles
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNav />
      
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Hola, {user.displayName || 'Atleta'}! 💪</h1>
              <p className="text-gray-600">Aquí está tu progreso y rutinas de entrenamiento</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={handleSearch}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={handleViewMarketplace}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Marketplace
              </button>
              <button
                onClick={handleNotifications}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </button>
              <button
                onClick={handleSettings}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+5%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{quickStats.completedSessions.toString()}</h3>
              <p className="text-sm text-gray-600">Sesiones Completadas</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{quickStats.totalProgress}%</h3>
              <p className="text-sm text-gray-600">Progreso Total</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+8%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{quickStats.exercisesCompleted.toString()}</h3>
              <p className="text-sm text-gray-600">Ejercicios Realizados</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Nuevo</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{quickStats.achievementsUnlocked.toString()}</h3>
              <p className="text-sm text-gray-600">Logros Desbloqueados</p>
            </div>
          </div>

          {/* Current Routine and Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Current Routine */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Rutina Actual</h2>
                  <button
                    onClick={handleViewRoutine}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver todas
                  </button>
                </div>
                <div className="space-y-2">
                  {currentRoutine ? (
                    <>
                      <h3 className="text-lg font-medium text-gray-900">{currentRoutine.name}</h3>
                      <p className="text-sm text-gray-600">{currentRoutine.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{currentRoutine.duration}</span>
                        <span>{currentRoutine.frequency}</span>
                        <span>Próxima: {currentRoutine.nextSession}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No tienes rutinas asignadas</p>
                  )}
                </div>
              </div>
              <div className="p-6">
                {currentRoutine ? (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progreso de la Rutina</span>
                        <span className="text-sm font-bold text-primary-600">{currentRoutine.progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                          style={{ width: `${currentRoutine.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {currentRoutine.exercises?.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                              {exercise.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{exercise.name}</h4>
                              <p className="text-xs text-gray-500">
                                {exercise.sets} × {exercise.reps}
                                {exercise.weight ? ` • ${exercise.weight}` : ''}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty === 'easy' ? 'Fácil' : exercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleStartSession(currentRoutine.id)}
                      className="w-full mt-6 flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Comenzar Sesión
                    </button>
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No tienes rutinas asignadas. Contacta a tu entrenador.
                  </p>
                )}
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Progreso Semanal</h2>
                  <button
                    onClick={handleViewProgress}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver detalles
                  </button>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Flame className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="font-medium text-gray-900">{quickStats.weeklyStreak} días seguidos</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium text-gray-900">{quickStats.totalCalories} kcal</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {weeklyProgress.map((day) => (
                    <div key={day.day} className="flex items-center space-x-4">
                      <div className="w-8 text-center text-sm font-medium text-gray-700">{day.day}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">{day.completed ? 'Completado' : 'Pendiente'}</span>
                          <span className="text-xs text-gray-500">{day.exercises}/{day.totalExercises} ejercicios</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(day.percentage)} rounded-full transition-all duration-300`}
                            style={{ width: `${day.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-6 h-6 flex items-center justify-center">
                        {day.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements and Upcoming Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Achievements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Logros Recientes</h2>
                <p className="text-sm text-gray-600">Tu progreso y conquistas</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.slice(0, 4).map((achievement) => {
                    const CategoryIcon = getCategoryIcon(achievement.category);
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border ${
                          achievement.unlocked
                            ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div
                          className={`w-12 h-12 ${
                            achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                          } mx-auto mb-3 flex items-center justify-center rounded-lg ${
                            achievement.unlocked ? 'bg-yellow-200' : 'bg-gray-200'
                          }`}
                        >
                          {achievement.icon}
                        </div>
                        <h3
                          className={`text-sm font-semibold text-center mb-1 ${
                            achievement.unlocked ? 'text-yellow-900' : 'text-gray-600'
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p
                          className={`text-xs text-center ${
                            achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'
                          }`}
                        >
                          {achievement.description}
                        </p>
                        {!achievement.unlocked && (
                          <div className="mt-3">
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                              {achievement.progress}/{achievement.maxProgress}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Próximas Sesiones</h2>
                <p className="text-sm text-gray-600">Tu agenda de entrenamiento</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{session.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            session.type === 'strength'
                              ? 'bg-blue-100 text-blue-800'
                              : session.type === 'cardio'
                              ? 'bg-red-100 text-red-800'
                              : session.type === 'flexibility'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {session.type === 'strength'
                            ? 'Fuerza'
                            : session.type === 'cardio'
                            ? 'Cardio'
                            : session.type === 'flexibility'
                            ? 'Flexibilidad'
                            : 'Recuperación'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {session.date} • {session.time}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {session.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {session.location}
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewSessionDetails(session.id)}
                        className="w-full mt-3 px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
