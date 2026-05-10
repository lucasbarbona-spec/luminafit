'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import ClientNav from '@/components/navigation/ClientNav';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  Crown, 
  Diamond, 
  Flame, 
  Zap, 
  Heart, 
  Target, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Filter, 
  Search, 
  Lock, 
  Unlock, 
  Gift, 
  Bell, 
  Settings, 
  ChevronRight, 
  ChevronDown, 
  X,
  Users,
  Clock,
  BarChart3,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Compass,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'strength' | 'cardio' | 'consistency' | 'milestone' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  points: number;
  requirements: string[];
  rewards?: {
    type: 'badge' | 'points' | 'title' | 'feature';
    description: string;
  }[];
}

interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  categoryProgress: {
    strength: number;
    cardio: number;
    consistency: number;
    milestone: number;
    social: number;
    special: number;
  };
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  achievements: number;
  streak: number;
  change: 'up' | 'down' | 'same';
}

export default function ClientAchievements() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showAchievementDetails, setShowAchievementDetails] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Primer Paso',
      description: 'Completa tu primera sesión de entrenamiento',
      icon: <Trophy className="w-6 h-6" />,
      category: 'milestone',
      rarity: 'common',
      unlocked: true,
      unlockedDate: '2024-01-15',
      progress: 1,
      maxProgress: 1,
      points: 10,
      requirements: ['Completar 1 sesión de entrenamiento'],
      rewards: [
        { type: 'points', description: '+10 puntos de experiencia' },
        { type: 'badge', description: 'Insignia de Principiante' }
      ]
    },
    {
      id: '2',
      title: 'Racha de 7 Días',
      description: 'Entrena durante 7 días consecutivos',
      icon: <Flame className="w-6 h-6" />,
      category: 'consistency',
      rarity: 'common',
      unlocked: true,
      unlockedDate: '2024-02-20',
      progress: 7,
      maxProgress: 7,
      points: 25,
      requirements: ['Entrenar 7 días seguidos'],
      rewards: [
        { type: 'points', description: '+25 puntos de experiencia' },
        { type: 'badge', description: 'Insignia de Constancia' }
      ]
    },
    {
      id: '3',
      title: 'Fuerza Inicial',
      description: 'Completa tu primera rutina de fuerza',
      icon: <Zap className="w-6 h-6" />,
      category: 'strength',
      rarity: 'common',
      unlocked: true,
      unlockedDate: '2024-01-20',
      progress: 1,
      maxProgress: 1,
      points: 15,
      requirements: ['Completar 1 rutina de fuerza'],
      rewards: [
        { type: 'points', description: '+15 puntos de experiencia' }
      ]
    },
    {
      id: '4',
      title: 'Cardio Warrior',
      description: 'Completa 10 sesiones de cardio',
      icon: <Heart className="w-6 h-6" />,
      category: 'cardio',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: '2024-03-10',
      progress: 10,
      maxProgress: 10,
      points: 50,
      requirements: ['Completar 10 sesiones de cardio'],
      rewards: [
        { type: 'points', description: '+50 puntos de experiencia' },
        { type: 'badge', description: 'Insignia de Cardio' }
      ]
    },
    {
      id: '5',
      title: 'Fuerza Máxima',
      description: 'Alcanza 100kg en sentadillas',
      icon: <BarChart3 className="w-6 h-6" />,
      category: 'strength',
      rarity: 'epic',
      unlocked: false,
      progress: 85,
      maxProgress: 100,
      points: 100,
      requirements: ['Levantar 100kg en sentadillas'],
      rewards: [
        { type: 'points', description: '+100 puntos de experiencia' },
        { type: 'badge', description: 'Insignia de Fuerza Épica' },
        { type: 'title', description: 'Título: "Maestro de la Fuerza"' }
      ]
    },
    {
      id: '6',
      title: 'Maratonista',
      description: 'Corre 21km en una sola sesión',
      icon: <Activity className="w-6 h-6" />,
      category: 'cardio',
      rarity: 'epic',
      unlocked: false,
      progress: 15,
      maxProgress: 21,
      points: 120,
      requirements: ['Correr 21km sin parar'],
      rewards: [
        { type: 'points', description: '+120 puntos de experiencia' },
        { type: 'badge', description: 'Insignia de Maratonista' }
      ]
    },
    {
      id: '7',
      title: 'Leyenda de la Consistencia',
      description: 'Mantén una racha de 30 días consecutivos',
      icon: <Crown className="w-6 h-6" />,
      category: 'consistency',
      rarity: 'legendary',
      unlocked: false,
      progress: 7,
      maxProgress: 30,
      points: 200,
      requirements: ['Entrenar 30 días seguidos'],
      rewards: [
        { type: 'points', description: '+200 puntos de experiencia' },
        { type: 'badge', description: 'Insignia Legendaria' },
        { type: 'title', description: 'Título: "Leyenda del Gimnasio"' },
        { type: 'feature', description: 'Acceso exclusivo a rutinas premium' }
      ]
    },
    {
      id: '8',
      title: 'Social Butterfly',
      description: 'Invita a 3 amigos al gimnasio',
      icon: <Users className="w-6 h-6" />,
      category: 'social',
      rarity: 'rare',
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      points: 40,
      requirements: ['Invitar a 3 amigos'],
      rewards: [
        { type: 'points', description: '+40 puntos de experiencia' },
        { type: 'badge', description: 'Insignia Social' }
      ]
    },
    {
      id: '9',
      title: 'Explorador',
      description: 'Prueba todos los tipos de entrenamiento',
      icon: <Compass className="w-6 h-6" />,
      category: 'special',
      rarity: 'rare',
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      points: 60,
      requirements: ['Completar rutinas de fuerza', 'Completar rutinas de cardio', 'Completar rutinas de flexibilidad', 'Completar rutinas de recuperación', 'Completar consultorías'],
      rewards: [
        { type: 'points', description: '+60 puntos de experiencia' },
        { type: 'badge', description: 'Insignia de Explorador' }
      ]
    },
    {
      id: '10',
      title: 'Mes Completo',
      description: 'Completa todas tus sesiones programadas por un mes',
      icon: <Calendar className="w-6 h-6" />,
      category: 'consistency',
      rarity: 'epic',
      unlocked: false,
      progress: 22,
      maxProgress: 30,
      points: 150,
      requirements: ['Completar 30 sesiones en un mes'],
      rewards: [
        { type: 'points', description: '+150 puntos de experiencia' },
        { type: 'badge', description: 'Insignia de Mes Perfecto' }
      ]
    }
  ]);

  const [stats, setStats] = useState<AchievementStats>({
    totalAchievements: achievements.length,
    unlockedAchievements: achievements.filter(a => a.unlocked).length,
    totalPoints: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0),
    currentStreak: 7,
    longestStreak: 14,
    categoryProgress: {
      strength: achievements.filter(a => a.category === 'strength').length,
      cardio: achievements.filter(a => a.category === 'cardio').length,
      consistency: achievements.filter(a => a.category === 'consistency').length,
      milestone: achievements.filter(a => a.category === 'milestone').length,
      social: achievements.filter(a => a.category === 'social').length,
      special: achievements.filter(a => a.category === 'special').length
    }
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Juan Pérez', avatar: 'JP', points: 1250, achievements: 28, streak: 45, change: 'same' },
    { rank: 2, name: 'María García', avatar: 'MG', points: 1180, achievements: 25, streak: 30, change: 'up' },
    { rank: 3, name: 'Carlos Rodríguez', avatar: 'CR', points: 980, achievements: 22, streak: 21, change: 'down' },
    { rank: 4, name: 'Ana Martínez', avatar: 'AM', points: 920, achievements: 20, streak: 18, change: 'up' },
    { rank: 5, name: 'Luis Sánchez', avatar: 'LS', points: 850, achievements: 18, streak: 15, change: 'same' },
    { rank: 6, name: 'Tú', avatar: 'TU', points: stats.totalPoints, achievements: stats.unlockedAchievements, streak: stats.currentStreak, change: 'up' }
  ]);

  const categories = [
    { value: 'all', label: 'Todas', icon: Trophy },
    { value: 'strength', label: 'Fuerza', icon: Zap },
    { value: 'cardio', label: 'Cardio', icon: Heart },
    { value: 'consistency', label: 'Constancia', icon: Flame },
    { value: 'milestone', label: 'Hitos', icon: Target },
    { value: 'social', label: 'Social', icon: Users },
    { value: 'special', label: 'Especial', icon: Star }
  ];

  const rarities = [
    { value: 'all', label: 'Todas', color: 'gray' },
    { value: 'common', label: 'Común', color: 'green' },
    { value: 'rare', label: 'Raro', color: 'blue' },
    { value: 'epic', label: 'Épico', color: 'purple' },
    { value: 'legendary', label: 'Legendario', color: 'yellow' }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== 'client') {
      router.push('/trainer/dashboard');
    }
  }, [user, loading, router]);

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-green-300 bg-green-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-green-800';
      case 'rare': return 'text-blue-800';
      case 'epic': return 'text-purple-800';
      case 'legendary': return 'text-yellow-800';
      default: return 'text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return Zap;
      case 'cardio': return Heart;
      case 'consistency': return Flame;
      case 'milestone': return Target;
      case 'social': return Users;
      case 'special': return Star;
      default: return Trophy;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowAchievementDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando logros...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Logros</h1>
              <p className="text-gray-600">Desbloquea logros y gana puntos</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Ranking
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  {Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100)}%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.unlockedAchievements}/{stats.totalAchievements}</h3>
              <p className="text-sm text-gray-600">Logros Desbloqueados</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Activa</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.currentStreak}</h3>
              <p className="text-sm text-gray-600">Racha Actual</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Diamond className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">+15%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalPoints}</h3>
              <p className="text-sm text-gray-600">Puntos Totales</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">#6</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Top 10%</h3>
              <p className="text-sm text-gray-600">Ranking Global</p>
            </div>
          </div>

          {/* Category Progress */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Progreso por Categoría</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(stats.categoryProgress).map(([category, count]) => {
                const CategoryIcon = getCategoryIcon(category);
                const categoryAchievements = achievements.filter(a => a.category === category);
                const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
                const progressPercentage = (unlockedInCategory / categoryAchievements.length) * 100;
                
                return (
                  <div key={category} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CategoryIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {category === 'strength' ? 'Fuerza' : 
                           category === 'cardio' ? 'Cardio' : 
                           category === 'consistency' ? 'Constancia' : 
                           category === 'milestone' ? 'Hitos' : 
                           category === 'social' ? 'Social' : 'Especial'}
                        </h3>
                        <span className="text-sm text-gray-600">{unlockedInCategory}/{categoryAchievements.length}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(progressPercentage)} rounded-full transition-all duration-300`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    placeholder="Buscar logros..."
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
                  value={selectedRarity}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRarity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {rarities.map(rarity => (
                    <option key={rarity.value} value={rarity.value}>{rarity.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {viewMode === 'grid' ? <div className="w-5 h-5">☰</div> : <div className="w-5 h-5">⊞</div>}
                </button>
              </div>
            </div>
          </div>

          {/* Achievements Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredAchievements.map((achievement) => {
              const CategoryIcon = getCategoryIcon(achievement.category);
              
              if (viewMode === 'grid') {
                return (
                  <div
                    key={achievement.id}
                    onClick={() => handleAchievementClick(achievement)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${getRarityColor(achievement.rarity)} ${achievement.unlocked ? '' : 'opacity-60'}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 flex items-center justify-center rounded-lg">
                        {achievement.icon}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRarityTextColor(achievement.rarity)} bg-white bg-opacity-80`}>
                          {achievement.rarity === 'common' ? 'Común' : 
                           achievement.rarity === 'rare' ? 'Raro' : 
                           achievement.rarity === 'epic' ? 'Épico' : 'Legendario'}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          +{achievement.points} pts
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                    {!achievement.unlocked && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progreso</span>
                          <span className="text-sm font-bold text-primary-600">{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor((achievement.progress / achievement.maxProgress) * 100)} rounded-full transition-all duration-300`}
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CategoryIcon className="w-4 h-4 text-gray-600 mr-1" />
                        <span className="text-xs text-gray-600">
                          {achievement.category === 'strength' ? 'Fuerza' : 
                           achievement.category === 'cardio' ? 'Cardio' : 
                           achievement.category === 'consistency' ? 'Constancia' : 
                           achievement.category === 'milestone' ? 'Hitos' : 
                           achievement.category === 'social' ? 'Social' : 'Especial'}
                        </span>
                      </div>
                      {achievement.unlocked && (
                        <div className="text-xs text-gray-500">{achievement.unlockedDate}</div>
                      )}
                      {!achievement.unlocked && (
                        <div className="flex items-center">
                          <Lock className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">Bloqueado</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                // List view
                return (
                  <div
                    key={achievement.id}
                    onClick={() => handleAchievementClick(achievement)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getRarityColor(achievement.rarity)} ${achievement.unlocked ? '' : 'opacity-60'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg">
                          {achievement.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getRarityTextColor(achievement.rarity)} bg-white bg-opacity-80`}>
                            {achievement.rarity === 'common' ? 'Común' : 
                             achievement.rarity === 'rare' ? 'Raro' : 
                             achievement.rarity === 'epic' ? 'Épico' : 'Legendario'}
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            +{achievement.points} pts
                          </span>
                        </div>
                        {!achievement.unlocked && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{achievement.progress}/{achievement.maxProgress}</div>
                            <p className="text-xs text-gray-500">Progreso</p>
                          </div>
                        )}
                        {achievement.unlocked && (
                          <div className="flex items-center">
                            <Unlock className="w-5 h-5 text-green-600 mr-1" />
                            <span className="text-sm text-green-600">Desbloqueado</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* Achievement Details Modal */}
          {showAchievementDetails && selectedAchievement && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedAchievement.title}</h2>
                    <p className="text-sm text-gray-600">{selectedAchievement.description}</p>
                  </div>
                  <button
                    onClick={() => setShowAchievementDetails(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 flex items-center justify-center rounded-lg">
                      {selectedAchievement.icon}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-sm text-gray-600">Rareza:</span>
                          <span className={`px-3 py-1 text-sm rounded-full ${getRarityTextColor(selectedAchievement.rarity)} bg-opacity-20 ${getRarityColor(selectedAchievement.rarity).split(' ')[1]}`}>
                            {selectedAchievement.rarity === 'common' ? 'Común' : 
                             selectedAchievement.rarity === 'rare' ? 'Raro' : 
                             selectedAchievement.rarity === 'epic' ? 'Épico' : 'Legendario'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-sm text-gray-600">Puntos:</span>
                          <span className="font-bold text-yellow-600">+{selectedAchievement.points} puntos</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">Categoría:</span>
                          <span className="font-medium text-gray-900">
                            {selectedAchievement.category === 'strength' ? 'Fuerza' : 
                             selectedAchievement.category === 'cardio' ? 'Cardio' : 
                             selectedAchievement.category === 'consistency' ? 'Constancia' : 
                             selectedAchievement.category === 'milestone' ? 'Hitos' : 
                             selectedAchievement.category === 'social' ? 'Social' : 'Especial'}
                          </span>
                        </div>
                      </div>
                      {!selectedAchievement.unlocked && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progreso</span>
                            <span className="text-sm font-bold text-primary-600">{selectedAchievement.progress}/{selectedAchievement.maxProgress}</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor((selectedAchievement.progress / selectedAchievement.maxProgress) * 100)} rounded-full transition-all duration-300`}
                              style={{ width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Requisitos</h3>
                    <ul className="space-y-2">
                      {selectedAchievement.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-center">
                          {selectedAchievement.unlocked ? (
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 mr-2 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {selectedAchievement.rewards && selectedAchievement.rewards.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Recompensas</h3>
                      <div className="space-y-2">
                        {selectedAchievement.rewards.map((reward, index) => (
                          <div key={index} className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <Gift className="w-5 h-5 text-yellow-600 mr-3" />
                            <span className="text-sm text-yellow-800">{reward.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedAchievement.unlocked && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-800">¡Logro Desbloqueado!</span>
                      </div>
                      <p className="text-sm text-green-700">Desbloqueado el: {selectedAchievement.unlockedDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Modal */}
          {showLeaderboard && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Ranking Global</h2>
                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          entry.name === 'Tú' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            entry.rank === 1 ? 'bg-yellow-500 text-white' :
                            entry.rank === 2 ? 'bg-gray-400 text-white' :
                            entry.rank === 3 ? 'bg-orange-600 text-white' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {entry.rank}
                          </div>
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">{entry.avatar}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{entry.name}</h3>
                            <p className="text-sm text-gray-600">{entry.achievements} logros • {entry.streak} días racha</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{entry.points}</div>
                            <p className="text-xs text-gray-500">Puntos</p>
                          </div>
                          <div className="flex items-center">
                            {entry.change === 'up' ? (
                              <ArrowUp className="w-5 h-5 text-green-600" />
                            ) : entry.change === 'down' ? (
                              <ArrowDown className="w-5 h-5 text-red-600" />
                            ) : (
                              <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
