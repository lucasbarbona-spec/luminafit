'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import TrainerNav from '@/components/navigation/TrainerNav';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Copy, 
  Users, 
  Clock, 
  Activity,
  Target,
  ChevronRight,
  Star,
  Eye,
  Play,
  Pause,
  Settings,
  Save,
  X,
  Check,
  AlertCircle,
  TrendingUp,
  Calendar,
  Award,
  Zap
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rest: number;
  notes: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Routine {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  exercises: Exercise[];
  isPublic: boolean;
  rating: number;
  totalStudents: number;
  status: 'draft' | 'active' | 'archived';
  assignedStudents: string[]; // IDs de estudiantes asignados
  createdAt: string;
  updatedAt: string;
}

export default function TrainerRoutines() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRoutineForAssign, setSelectedRoutineForAssign] = useState<Routine | null>(null);

  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: '1',
      name: 'Rutina de Fuerza Avanzada',
      description: 'Programa completo de entrenamiento de fuerza para nivel avanzado',
      duration: 8,
      difficulty: 'hard',
      category: 'fuerza',
      exercises: [],
      isPublic: true,
      rating: 4.8,
      totalStudents: 24,
      status: 'active',
      assignedStudents: ['student1', 'student2'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Cardio Intenso',
      description: 'Sesión de cardio de alta intensidad para quemar calorías',
      duration: 4,
      difficulty: 'medium',
      category: 'cardio',
      exercises: [],
      isPublic: true,
      rating: 4.6,
      totalStudents: 18,
      status: 'active',
      assignedStudents: ['student3'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: '3',
      name: 'Yoga y Flexibilidad',
      description: 'Rutina suave para mejorar flexibilidad y reducir estrés',
      duration: 6,
      difficulty: 'easy',
      category: 'flexibilidad',
      exercises: [],
      isPublic: false,
      rating: 4.9,
      totalStudents: 12,
      status: 'draft',
      assignedStudents: [],
      createdAt: '2024-01-08',
      updatedAt: '2024-01-16'
    },
    {
      id: '4',
      name: 'Full Body Beginner',
      description: 'Rutina completa para principiantes',
      duration: 6,
      difficulty: 'easy',
      category: 'fullbody',
      exercises: [],
      isPublic: true,
      rating: 4.7,
      totalStudents: 31,
      status: 'active',
      assignedStudents: ['student4', 'student5', 'student6'],
      createdAt: '2024-01-05',
      updatedAt: '2024-01-22'
    }
  ]);

  const [newRoutine, setNewRoutine] = useState<Partial<Routine>>({
    name: '',
    description: '',
    duration: 4,
    difficulty: 'medium',
    category: 'fuerza',
    exercises: [],
    isPublic: false,
    status: 'draft'
  });

  const categories = [
    { value: 'all', label: 'Todas', icon: Target },
    { value: 'fuerza', label: 'Fuerza', icon: Zap },
    { value: 'cardio', label: 'Cardio', icon: Activity },
    { value: 'flexibilidad', label: 'Flexibilidad', icon: Settings },
    { value: 'fullbody', label: 'Full Body', icon: Users }
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
    } else if (!loading && user && user.role !== 'trainer' && user.role !== 'admin') {
      router.push('/client/dashboard');
    }
  }, [user, loading, router]);

  const filteredRoutines = routines.filter(routine => {
    const matchesSearch = routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         routine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || routine.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || routine.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleCreateRoutine = () => {
    if (newRoutine.name && newRoutine.description) {
      const routine: Routine = {
        id: Date.now().toString(),
        name: newRoutine.name!,
        description: newRoutine.description!,
        duration: newRoutine.duration || 4,
        difficulty: newRoutine.difficulty as 'easy' | 'medium' | 'hard',
        category: newRoutine.category || 'fuerza',
        exercises: [],
        isPublic: newRoutine.isPublic || false,
        rating: 0,
        totalStudents: 0,
        status: 'draft',
        assignedStudents: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      setRoutines([...routines, routine]);
      setNewRoutine({
        name: '',
        description: '',
        duration: 4,
        difficulty: 'medium',
        category: 'fuerza',
        exercises: [],
        isPublic: false,
        status: 'draft',
        assignedStudents: []
      });
      setShowCreateModal(false);
    }
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
  };

  const handleSaveEdit = () => {
    if (editingRoutine) {
      setRoutines(routines.map(r => 
        r.id === editingRoutine.id ? editingRoutine : r
      ));
      setEditingRoutine(null);
    }
  };

  const handleDeleteRoutine = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
      setRoutines(routines.filter(r => r.id !== id));
    }
  };

  const handleDuplicateRoutine = (routine: Routine) => {
    const duplicated: Routine = {
      ...routine,
      id: Date.now().toString(),
      name: `${routine.name} (Copia)`,
      status: 'draft',
      rating: 0,
      totalStudents: 0,
      assignedStudents: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setRoutines([...routines, duplicated]);
  };

  const handleAssignStudents = (routine: Routine) => {
    setSelectedRoutineForAssign(routine);
    setShowAssignModal(true);
  };

  const handleSaveAssignment = (studentIds: string[]) => {
    if (selectedRoutineForAssign) {
      setRoutines(routines.map(r => 
        r.id === selectedRoutineForAssign.id 
          ? { ...r, assignedStudents: studentIds, totalStudents: studentIds.length }
          : r
      ));
      setShowAssignModal(false);
      setSelectedRoutineForAssign(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
      case 'fuerza': return Zap;
      case 'cardio': return Activity;
      case 'flexibilidad': return Settings;
      case 'fullbody': return Users;
      default: return Target;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
      <TrainerNav />
      
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Rutinas</h1>
              <p className="text-gray-600">Crea y gestiona rutinas de entrenamiento personalizadas</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {viewMode === 'grid' ? <div className="w-5 h-5">☰</div> : <div className="w-5 h-5">⊞</div>}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Rutina
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
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{routines.length}</h3>
                  <p className="text-sm text-gray-600">Total Rutinas</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{routines.reduce((sum, r) => sum + r.totalStudents, 0)}</h3>
                  <p className="text-sm text-gray-600">Alumnos Activos</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {routines.length > 0 ? (routines.reduce((sum, r) => sum + r.rating, 0) / routines.length).toFixed(1) : '0.0'}
                  </h3>
                  <p className="text-sm text-gray-600">Rating Promedio</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{routines.filter(r => r.status === 'active').length}</h3>
                  <p className="text-sm text-gray-600">Rutinas Activas</p>
                </div>
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
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(routine.status)}`}>
                            {routine.status === 'active' ? 'Activa' : routine.status === 'draft' ? 'Borrador' : 'Archivada'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(routine.difficulty)}`}>
                            {routine.difficulty === 'easy' ? 'Principiante' : routine.difficulty === 'medium' ? 'Intermedio' : 'Avanzado'}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{routine.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{routine.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {routine.duration} semanas
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {routine.rating.toFixed(1)}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {routine.totalStudents}
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditRoutine(routine)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateRoutine(routine)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAssignStudents(routine)}
                            className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Asignar a estudiantes"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleDeleteRoutine(routine.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(routine.status)}`}>
                              {routine.status === 'active' ? 'Activa' : routine.status === 'draft' ? 'Borrador' : 'Archivada'}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(routine.difficulty)}`}>
                              {routine.difficulty === 'easy' ? 'Principiante' : routine.difficulty === 'medium' ? 'Intermedio' : 'Avanzado'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {routine.duration} sem
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {routine.rating.toFixed(1)}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {routine.totalStudents}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditRoutine(routine)}
                              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicateRoutine(routine)}
                              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoutine(routine.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Crear Nueva Rutina</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Rutina</label>
                    <input
                      type="text"
                      value={newRoutine.name || ''}
                      onChange={(e) => setNewRoutine({...newRoutine, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: Rutina de Fuerza Avanzada"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={newRoutine.description || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewRoutine({...newRoutine, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      placeholder="Describe brevemente la rutina..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duración (semanas)</label>
                      <input
                        type="number"
                        value={newRoutine.duration || 4}
                        onChange={(e) => setNewRoutine({...newRoutine, duration: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        min={1}
                        max={52}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                      <select
                        value={newRoutine.category || 'fuerza'}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewRoutine({...newRoutine, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="fuerza">Fuerza</option>
                        <option value="cardio">Cardio</option>
                        <option value="flexibilidad">Flexibilidad</option>
                        <option value="fullbody">Full Body</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
                      <select
                        value={newRoutine.difficulty || 'medium'}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewRoutine({...newRoutine, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="easy">Principiante</option>
                        <option value="medium">Intermedio</option>
                        <option value="hard">Avanzado</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newRoutine.isPublic || false}
                          onChange={(e) => setNewRoutine({...newRoutine, isPublic: e.target.checked})}
                          className="mr-2"
                        />
                        Hacer rutina pública
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateRoutine}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Crear Rutina
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
