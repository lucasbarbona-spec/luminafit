'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import ClientNav from '@/components/navigation/ClientNav';
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Calendar, 
  Filter, 
  Download, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Award, 
  Trophy, 
  Medal, 
  Star, 
  Clock, 
  Zap, 
  Heart, 
  Flame, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  Upload, 
  Settings, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  X,
  Users,
  BarChart,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  CalendarDays,
  Timer,
  Weight,
  Ruler,
  ActivityIcon
} from 'lucide-react';

interface ProgressData {
  weight: number;
  bodyFat: number;
  muscleMass: number;
  measurements: {
    chest: number;
    waist: number;
    arms: number;
    thighs: number;
  };
  performance: {
    strength: number;
    cardio: number;
    flexibility: number;
    endurance: number;
  };
  date: string;
  photos: string[];
}

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: 'weight' | 'performance' | 'measurement' | 'time';
  deadline: string;
  achieved: boolean;
  progress: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedDate?: string;
  category: 'strength' | 'cardio' | 'consistency' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function ClientProgress() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['performance', 'goals']);

  const [progressHistory, setProgressHistory] = useState<ProgressData[]>([
    {
      weight: 75.5,
      bodyFat: 18.5,
      muscleMass: 35.2,
      measurements: {
        chest: 102,
        waist: 84,
        arms: 38,
        thighs: 62
      },
      performance: {
        strength: 75,
        cardio: 82,
        flexibility: 70,
        endurance: 78
      },
      date: '2024-01-15',
      photos: []
    },
    {
      weight: 74.2,
      bodyFat: 17.8,
      muscleMass: 36.1,
      measurements: {
        chest: 104,
        waist: 82,
        arms: 39,
        thighs: 63
      },
      performance: {
        strength: 78,
        cardio: 85,
        flexibility: 73,
        endurance: 82
      },
      date: '2024-02-15',
      photos: []
    },
    {
      weight: 73.0,
      bodyFat: 16.9,
      muscleMass: 37.0,
      measurements: {
        chest: 105,
        waist: 80,
        arms: 40,
        thighs: 64
      },
      performance: {
        strength: 82,
        cardio: 88,
        flexibility: 76,
        endurance: 86
      },
      date: '2024-03-15',
      photos: []
    },
    {
      weight: 71.8,
      bodyFat: 16.2,
      muscleMass: 37.8,
      measurements: {
        chest: 106,
        waist: 78,
        arms: 41,
        thighs: 65
      },
      performance: {
        strength: 85,
        cardio: 91,
        flexibility: 79,
        endurance: 89
      },
      date: '2024-04-15',
      photos: []
    },
    {
      weight: 70.5,
      bodyFat: 15.5,
      muscleMass: 38.5,
      measurements: {
        chest: 107,
        waist: 76,
        arms: 42,
        thighs: 66
      },
      performance: {
        strength: 88,
        cardio: 94,
        flexibility: 82,
        endurance: 92
      },
      date: '2024-05-15',
      photos: []
    },
    {
      weight: 69.2,
      bodyFat: 14.8,
      muscleMass: 39.2,
      measurements: {
        chest: 108,
        waist: 74,
        arms: 43,
        thighs: 67
      },
      performance: {
        strength: 91,
        cardio: 97,
        flexibility: 85,
        endurance: 95
      },
      date: '2024-06-15',
      photos: []
    }
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Pérdida de Peso',
      description: 'Llegar a 68kg para el verano',
      target: 68,
      current: 69.2,
      unit: 'kg',
      category: 'weight',
      deadline: '2024-07-15',
      achieved: false,
      progress: 85
    },
    {
      id: '2',
      title: 'Fuerza Máxima',
      description: 'Levantar 100kg en sentadillas',
      target: 100,
      current: 85,
      unit: 'kg',
      category: 'performance',
      deadline: '2024-08-01',
      achieved: false,
      progress: 85
    },
    {
      id: '3',
      title: 'Resistencia Cardio',
      description: 'Correr 10km sin parar',
      target: 10,
      current: 8,
      unit: 'km',
      category: 'performance',
      deadline: '2024-07-30',
      achieved: false,
      progress: 80
    },
    {
      id: '4',
      title: 'Reducción de Cintura',
      description: 'Bajar a 72cm de cintura',
      target: 72,
      current: 74,
      unit: 'cm',
      category: 'measurement',
      deadline: '2024-08-15',
      achieved: false,
      progress: 75
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Primer Mes',
      description: 'Completaste tu primer mes de entrenamiento',
      icon: <Trophy className="w-6 h-6" />,
      unlocked: true,
      unlockedDate: '2024-02-15',
      category: 'milestone',
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Racha de 7 días',
      description: '7 días consecutivos de entrenamiento',
      icon: <Flame className="w-6 h-6" />,
      unlocked: true,
      unlockedDate: '2024-02-20',
      category: 'consistency',
      rarity: 'common'
    },
    {
      id: '3',
      title: 'Fuerza Máxima',
      description: 'Alcanza 100kg en sentadillas',
      icon: <Zap className="w-6 h-6" />,
      unlocked: false,
      category: 'strength',
      rarity: 'rare'
    },
    {
      id: '4',
      title: 'Maestro del Cardio',
      description: 'Completa 50 sesiones de cardio',
      icon: <Heart className="w-6 h-6" />,
      unlocked: false,
      category: 'cardio',
      rarity: 'epic'
    },
    {
      id: '5',
      title: 'Transformación Completa',
      description: 'Alcanza todos tus objetivos principales',
      icon: <Medal className="w-6 h-6" />,
      unlocked: false,
      category: 'milestone',
      rarity: 'legendary'
    }
  ]);

  const periods = [
    { value: 'week', label: 'Última Semana' },
    { value: 'month', label: 'Último Mes' },
    { value: 'quarter', label: 'Último Trimestre' },
    { value: 'year', label: 'Último Año' },
    { value: 'all', label: 'Todo el Tiempo' }
  ];

  const metrics = [
    { value: 'all', label: 'Todas las Métricas' },
    { value: 'weight', label: 'Peso' },
    { value: 'bodyFat', label: 'Grasa Corporal' },
    { value: 'muscleMass', label: 'Masa Muscular' },
    { value: 'performance', label: 'Rendimiento' },
    { value: 'measurements', label: 'Medidas' }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== 'client') {
      router.push('/trainer/dashboard');
    }
  }, [user, loading, router]);

  const latestProgress = progressHistory[progressHistory.length - 1];
  const initialProgress = progressHistory[0];

  const calculateChange = (initial: number, current: number) => {
    const change = current - initial;
    const percentage = (change / initial) * 100;
    return { change, percentage };
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100';
    if (progress >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleUploadPhoto = () => {
    // Handle photo upload logic
    setShowPhotoModal(false);
  };

  const handleCreateGoal = () => {
    // Handle goal creation logic
    setShowGoalModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando progreso...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Progreso</h1>
              <p className="text-gray-600">Seguimiento detallado de tu evolución</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowPhotoModal(true)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4 mr-2" />
                Subir Foto
              </button>
              <button
                onClick={() => setShowGoalModal(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Objetivo
              </button>
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>

          {/* Period and Metric Selectors */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Período:</label>
                <select
                  value={selectedPeriod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>{period.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Métrica:</label>
                <select
                  value={selectedMetric}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMetric(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {metrics.map(metric => (
                    <option key={metric.value} value={metric.value}>{metric.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Progress Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Weight className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center text-sm">
                  <ArrowDown className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">-6.3kg</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{latestProgress.weight}kg</h3>
              <p className="text-sm text-gray-600">Peso Actual</p>
              <p className="text-xs text-gray-500">Inicial: {initialProgress.weight}kg</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex items-center text-sm">
                  <ArrowDown className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">-3.7%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{latestProgress.bodyFat}%</h3>
              <p className="text-sm text-gray-600">Grasa Corporal</p>
              <p className="text-xs text-gray-500">Inicial: {initialProgress.bodyFat}%</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+4.0kg</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{latestProgress.muscleMass}kg</h3>
              <p className="text-sm text-gray-600">Masa Muscular</p>
              <p className="text-xs text-gray-500">Inicial: {initialProgress.muscleMass}kg</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+16%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">91%</h3>
              <p className="text-sm text-gray-600">Rendimiento General</p>
              <p className="text-xs text-gray-500">Inicial: 75%</p>
            </div>
          </div>

          {/* Progress Charts Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Evolución del Progreso</h2>
              <button
                onClick={() => toggleSection('charts')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {expandedSections.includes('charts') ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            </div>
            {expandedSections.includes('charts') && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weight Progress Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Progreso de Peso</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <LineChart className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-500 ml-3">Gráfico de evolución de peso</p>
                  </div>
                </div>
                
                {/* Body Composition Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Composición Corporal</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <PieChart className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-500 ml-3">Gráfico de composición corporal</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Goals Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Mis Objetivos</h2>
              <button
                onClick={() => toggleSection('goals')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {expandedSections.includes('goals') ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            </div>
            {expandedSections.includes('goals') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${goal.achieved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {goal.achieved ? 'Logrado' : 'En Progreso'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progreso</span>
                        <span className="text-sm font-bold text-primary-600">{goal.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(goal.progress).split(' ')[1]} rounded-full transition-all duration-300`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Actual: {goal.current}{goal.unit}</span>
                      <span>Meta: {goal.target}{goal.unit}</span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <CalendarDays className="w-3 h-3 mr-1" />
                      Fecha límite: {goal.deadline}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Logros Desbloqueados</h2>
              <button
                onClick={() => toggleSection('achievements')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {expandedSections.includes('achievements') ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            </div>
            {expandedSections.includes('achievements') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-6 rounded-lg border-2 ${getRarityColor(achievement.rarity)} ${achievement.unlocked ? '' : 'opacity-60'}`}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-lg">
                      {achievement.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">{achievement.title}</h3>
                    <p className="text-sm text-center text-gray-600 mb-3">{achievement.description}</p>
                    {achievement.unlocked && (
                      <div className="text-xs text-center text-gray-500">Desbloqueado: {achievement.unlockedDate}</div>
                    )}
                    {!achievement.unlocked && (
                      <div className="text-xs text-center text-gray-500">Bloqueado</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photo Upload Modal */}
          {showPhotoModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Subir Foto de Progreso</h2>
                  <button
                    onClick={() => setShowPhotoModal(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Arrastra una foto aquí o haz clic para seleccionar</p>
                    <p className="text-sm text-gray-500">PNG, JPG hasta 10MB</p>
                  </div>
                  <button
                    onClick={handleUploadPhoto}
                    className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Subir Foto
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Goal Creation Modal */}
          {showGoalModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Objetivo</h2>
                  <button
                    onClick={() => setShowGoalModal(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título del Objetivo</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: Bajar 5kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      placeholder="Describe tu objetivo..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Valor Actual</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meta</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Límite</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button
                    onClick={handleCreateGoal}
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Crear Objetivo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
