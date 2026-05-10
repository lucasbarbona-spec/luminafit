'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import ClientNav from '@/components/navigation/ClientNav';
import { 
  Activity, 
  Play, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar, 
  Filter, 
  Search, 
  ChevronRight, 
  Star, 
  Zap, 
  Heart, 
  Award, 
  BarChart3, 
  Timer, 
  CheckCircle, 
  AlertCircle, 
  Pause, 
  RotateCcw, 
  MoreHorizontal,
  Eye,
  MessageSquare,
  Users,
  Flame,
  Trophy,
  Settings,
  X
} from 'lucide-react';

interface Routine {
  id: string;
  name: string;
  description: string;
  duration: string;
  frequency: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'strength' | 'cardio' | 'flexibility' | 'recovery';
  progress: number;
  totalExercises: number;
  completedExercises: number;
  nextSession: string;
  trainer: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  lastUpdated: string;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest: number;
  notes: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export default function ClientRoutines() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [activeSession, setActiveSession] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: '1',
      name: 'Rutina de Fuerza Avanzada',
      description: 'Programa completo de entrenamiento de fuerza para nivel intermedio-avanzado',
      duration: '8 semanas',
      frequency: '4 días por semana',
      difficulty: 'hard',
      category: 'strength',
      progress: 65,
      totalExercises: 5,
      completedExercises: 3,
      nextSession: 'Mañana 10:00 AM',
      trainer: 'Juan Pérez',
      rating: 4.8,
      isActive: true,
      createdAt: '2024-01-15',
      lastUpdated: '2024-06-20',
      exercises: [
        { id: '1', name: 'Sentadillas con barra', sets: 4, reps: 12, weight: 60, rest: 90, notes: 'Mantener espalda recta', completed: true, difficulty: 'medium', category: 'legs' },
        { id: '2', name: 'Press de banca', sets: 4, reps: 10, weight: 50, rest: 90, notes: 'Controlar el descenso', completed: true, difficulty: 'medium', category: 'chest' },
        { id: '3', name: 'Remo con mancuernas', sets: 3, reps: 15, weight: 12, rest: 60, notes: 'Contraer dorsal', completed: false, difficulty: 'easy', category: 'back' },
        { id: '4', name: 'Zancadas', sets: 3, reps: 10, weight: 0, rest: 60, notes: 'Mantener equilibrio', completed: false, difficulty: 'medium', category: 'legs' },
        { id: '5', name: 'Plancha abdominal', sets: 3, reps: 60, weight: 0, rest: 30, notes: 'Activar core', completed: false, difficulty: 'hard', category: 'core' }
      ]
    },
    {
      id: '2',
      name: 'Cardio Intenso',
      description: 'Sesión de cardio de alta intensidad para quemar calorías y mejorar resistencia',
      duration: '4 semanas',
      frequency: '3 días por semana',
      difficulty: 'medium',
      category: 'cardio',
      progress: 80,
      totalExercises: 6,
      completedExercises: 5,
      nextSession: 'Viernes 6:00 PM',
      trainer: 'María García',
      rating: 4.6,
      isActive: true,
      createdAt: '2024-02-01',
      lastUpdated: '2024-06-19',
      exercises: [
        { id: '1', name: 'Saltos la cuerda', sets: 3, reps: 180, weight: 0, rest: 30, notes: 'Ritmo constante', completed: true, difficulty: 'medium', category: 'cardio' },
        { id: '2', name: 'Burpees', sets: 3, reps: 15, weight: 0, rest: 45, notes: 'Explosión completa', completed: true, difficulty: 'hard', category: 'cardio' },
        { id: '3', name: 'Mountain climbers', sets: 3, reps: 20, weight: 0, rest: 30, notes: 'Mantener ritmo', completed: true, difficulty: 'medium', category: 'cardio' },
        { id: '4', name: 'Jumping jacks', sets: 3, reps: 50, weight: 0, rest: 30, notes: 'Amplitud completa', completed: true, difficulty: 'easy', category: 'cardio' },
        { id: '5', name: 'Sprints', sets: 5, reps: 30, weight: 0, rest: 60, notes: 'Máxima intensidad', completed: true, difficulty: 'hard', category: 'cardio' },
        { id: '6', name: 'Cool down', sets: 1, reps: 300, weight: 0, rest: 0, notes: 'Relajación', completed: false, difficulty: 'easy', category: 'recovery' }
      ]
    },
    {
      id: '3',
      name: 'Yoga y Flexibilidad',
      description: 'Sesión suave para mejorar flexibilidad, equilibrio y reducir estrés',
      duration: '6 semanas',
      frequency: '2 días por semana',
      difficulty: 'easy',
      category: 'flexibility',
      progress: 90,
      totalExercises: 8,
      completedExercises: 7,
      nextSession: 'Domingo 9:00 AM',
      trainer: 'Ana Martínez',
      rating: 4.9,
      isActive: true,
      createdAt: '2024-01-10',
      lastUpdated: '2024-06-18',
      exercises: [
        { id: '1', name: 'Saludo al sol', sets: 1, reps: 10, weight: 0, rest: 30, notes: 'Respiración profunda', completed: true, difficulty: 'easy', category: 'flexibility' },
        { id: '2', name: 'Perro mirando abajo', sets: 1, reps: 5, weight: 0, rest: 30, notes: 'Estirar espalda', completed: true, difficulty: 'easy', category: 'flexibility' },
        { id: '3', name: 'Guerrero I', sets: 1, reps: 5, weight: 0, rest: 30, notes: 'Fuerza y equilibrio', completed: true, difficulty: 'medium', category: 'flexibility' },
        { id: '4', name: 'Árbol', sets: 1, reps: 5, weight: 0, rest: 30, notes: 'Equilibrio', completed: true, difficulty: 'medium', category: 'flexibility' },
        { id: '5', name: 'Triángulo', sets: 1, reps: 5, weight: 0, rest: 30, notes: 'Lateralidad', completed: true, difficulty: 'easy', category: 'flexibility' },
        { id: '6', name: 'Cobra', sets: 1, reps: 3, weight: 0, rest: 30, notes: 'Flexibilidad espinal', completed: true, difficulty: 'easy', category: 'flexibility' },
        { id: '7', name: 'Niña', sets: 1, reps: 3, weight: 0, rest: 30, notes: 'Relajación', completed: true, difficulty: 'easy', category: 'flexibility' },
        { id: '8', name: 'Savasana', sets: 1, reps: 300, weight: 0, rest: 0, notes: 'Meditación final', completed: false, difficulty: 'easy', category: 'recovery' }
      ]
    }
  ]);

  const categories = [
    { value: 'all', label: 'Todas', icon: Target },
    { value: 'strength', label: 'Fuerza', icon: Zap },
    { value: 'cardio', label: 'Cardio', icon: Heart },
    { value: 'flexibility', label: 'Flexibilidad', icon: Activity },
    { value: 'recovery', label: 'Recuperación', icon: Award }
  ];

  const difficulties = [
    { value: 'all', label: 'Todos', color: 'gray' },
    { value: 'easy', label: 'Principiante', color: 'green' },
    { value: 'medium', label: 'Intermedio', color: 'yellow' },
    { value: 'hard', label: 'Avanzado', color: 'red' }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== 'client') {
      router.push('/trainer/dashboard');
    }
  }, [user, loading, router]);

  const filteredRoutines = routines.filter(routine => {
    const matchesSearch = routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         routine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || routine.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || routine.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return Zap;
      case 'cardio': return Heart;
      case 'flexibility': return Activity;
      case 'recovery': return Award;
      default: return Target;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleStartSession = (routine: Routine) => {
    setSelectedRoutine(routine);
    setShowSessionModal(true);
    setCurrentExerciseIndex(0);
    setActiveSession(true);
  };

  const handleCompleteExercise = (exerciseId: string) => {
    if (selectedRoutine) {
      const updatedExercises = selectedRoutine.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: true } : ex
      );
      const updatedRoutine = {
        ...selectedRoutine,
        exercises: updatedExercises,
        completedExercises: updatedExercises.filter(ex => ex.completed).length,
        progress: Math.round((updatedExercises.filter(ex => ex.completed).length / updatedExercises.length) * 100)
      };
      setSelectedRoutine(updatedRoutine);
      
      // Update routines list
      setRoutines(routines.map(r => 
        r.id === updatedRoutine.id ? updatedRoutine : r
      ));
      
      // Move to next exercise
      const nextIndex = currentExerciseIndex + 1;
      if (nextIndex < updatedExercises.length) {
        setCurrentExerciseIndex(nextIndex);
      } else {
        // Session completed
        setActiveSession(false);
        setShowSessionModal(false);
      }
    }
  };

  const handlePauseSession = () => {
    setActiveSession(false);
  };

  const handleResumeSession = () => {
    setActiveSession(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando rutinas...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Rutinas</h1>
              <p className="text-gray-600">Tus programas de entrenamiento personalizados</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {viewMode === 'grid' ? (
                  <div className="w-5 h-5">☰</div>
                ) : (
                  <div className="w-5 h-5">⊞</div>
                )}
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar rutinas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {difficulties.map(diff => (
                    <option key={diff.value} value={diff.value}>{diff.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Routines Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredRoutines.map((routine) => {
              const CategoryIcon = getCategoryIcon(routine.category);
              
              if (viewMode === 'grid') {
                return (
                  <div key={routine.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <CategoryIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(routine.difficulty)}`}>
                            {routine.difficulty === 'easy' ? 'Principiante' : routine.difficulty === 'medium' ? 'Intermedio' : 'Avanzado'}
                          </span>
                          {routine.isActive && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Activa</span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{routine.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{routine.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{routine.duration}</span>
                          <span>{routine.frequency}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {routine.trainer}
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progreso</span>
                        <span className="text-sm font-bold text-primary-600">{routine.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(routine.progress)} rounded-full transition-all duration-300`}
                          style={{ width: `${routine.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{routine.completedExercises}/{routine.totalExercises} ejercicios</span>
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleStartSession(routine)}
                          className="flex items-center px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Iniciar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // List view
                return (
                  <div key={routine.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <CategoryIcon className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{routine.name}</h3>
                            <p className="text-sm text-gray-600">{routine.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(routine.difficulty)}`}>
                              {routine.difficulty === 'easy' ? 'Principiante' : routine.difficulty === 'medium' ? 'Intermedio' : 'Avanzado'}
                            </span>
                            {routine.isActive && (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Activa</span>
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{routine.progress}%</div>
                            <p className="text-xs text-gray-500">Progreso</p>
                          </div>
                          <button
                            onClick={() => handleStartSession(routine)}
                            className="flex items-center px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Iniciar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* Session Modal */}
          {showSessionModal && selectedRoutine && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedRoutine.name}</h2>
                    <p className="text-sm text-gray-600">Ejercicio {currentExerciseIndex + 1} de {selectedRoutine.exercises.length}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowSessionModal(false);
                      setActiveSession(false);
                    }}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  {selectedRoutine.exercises[currentExerciseIndex] && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {selectedRoutine.exercises[currentExerciseIndex].name}
                        </h3>
                        <div className="flex items-center justify-center space-x-2">
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(selectedRoutine.exercises[currentExerciseIndex].difficulty)}`}
                          >
                            {selectedRoutine.exercises[currentExerciseIndex].difficulty === 'easy'
                              ? 'Fácil'
                              : selectedRoutine.exercises[currentExerciseIndex].difficulty === 'medium'
                              ? 'Medio'
                              : 'Difícil'}
                          </span>
                          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                            {selectedRoutine.exercises[currentExerciseIndex].category}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-center space-x-8">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {selectedRoutine.exercises[currentExerciseIndex].sets.toString()}
                            </div>
                            <p className="text-sm text-gray-600">Series</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {selectedRoutine.exercises[currentExerciseIndex].reps.toString()}
                            </div>
                            <p className="text-sm text-gray-600">Repeticiones</p>
                          </div>
                          {selectedRoutine.exercises[currentExerciseIndex].weight && (
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {selectedRoutine.exercises[currentExerciseIndex].weight}kg
                              </div>
                              <p className="text-sm text-gray-600">Peso</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          <Clock className="w-5 h-5 text-gray-600 mr-2" />
                          <span className="text-gray-700">Descanso: {selectedRoutine.exercises[currentExerciseIndex].rest}s</span>
                        </div>
                        {selectedRoutine.exercises[currentExerciseIndex].notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                              <strong>Nota: </strong>
                              {selectedRoutine.exercises[currentExerciseIndex].notes}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={activeSession ? handlePauseSession : handleResumeSession}
                          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          {activeSession ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Reanudar
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleCompleteExercise(selectedRoutine.exercises[currentExerciseIndex].id)}
                          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Completar Ejercicio
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
