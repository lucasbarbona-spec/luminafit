'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAlumnos } from '@/lib/hooks/useFirestore';
import TrainerNav from '@/components/navigation/TrainerNav';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Pause, 
  Play, 
  MessageSquare, 
  BarChart3, 
  Target, 
  Heart, 
  Zap,
  MoreHorizontal,
  ChevronRight,
  Star,
  UserPlus,
  Download,
  Bell,
  Settings,
  X
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive' | 'paused';
  joinDate: string;
  lastActive: string;
  progress: number;
  totalSessions: number;
  completedSessions: number;
  currentRoutine: string;
  nextSession: string;
  goals: string[];
  notes: string;
  performance: {
    strength: number;
    cardio: number;
    flexibility: number;
    consistency: number;
  };
  communication: {
    lastMessage: string;
    unreadCount: number;
  };
  billing: {
    plan: string;
    nextPayment: string;
    status: 'active' | 'overdue' | 'cancelled';
  };
}

interface StudentMetrics {
  totalStudents: number;
  activeStudents: number;
  newThisMonth: number;
  avgProgress: number;
  totalSessions: number;
  completionRate: number;
  retentionRate: number;
}



export default function TrainerStudents() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { alumnos, loading: alumnosLoading, createAlumno } = useAlumnos(user?.uid);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSort, setSelectedSort] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '', goals: '' });

  const [metrics, setMetrics] = useState<StudentMetrics>({
    totalStudents: 0,
    activeStudents: 0,
    newThisMonth: 0,
    avgProgress: 0,
    totalSessions: 0,
    completionRate: 0,
    retentionRate: 0
  });

  useEffect(() => {
    if (alumnos) {
      const mapped: Student[] = alumnos.map(a => ({
        id: a.id,
        name: a.nombre,
        email: a.email,
        phone: a.telefono || '',
        avatar: a.fotoUrl ? 'A' : a.nombre.substring(0, 2).toUpperCase(),
        status: a.estado === 'activo' ? 'active' : a.estado === 'inactivo' ? 'inactive' : 'paused',
        joinDate: a.fechaInicio?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        progress: 0,
        totalSessions: 0,
        completedSessions: 0,
        currentRoutine: 'Sin rutina asignada',
        nextSession: 'No programada',
        goals: a.objetivos || [],
        notes: a.notas || '',
        performance: { strength: 0, cardio: 0, flexibility: 0, consistency: 0 },
        communication: { lastMessage: '', unreadCount: 0 },
        billing: { plan: 'Básico', nextPayment: '', status: 'active' }
      }));
      setStudents(mapped);
      
      const total = mapped.length;
      if (total > 0) {
        setMetrics({
          totalStudents: total,
          activeStudents: mapped.filter(s => s.status === 'active').length,
          newThisMonth: mapped.filter(s => new Date(s.joinDate).getMonth() === new Date().getMonth()).length,
          avgProgress: Math.round(mapped.reduce((sum, s) => sum + s.progress, 0) / total),
          totalSessions: mapped.reduce((sum, s) => sum + s.totalSessions, 0),
          completionRate: 0,
          retentionRate: 100
        });
      }
    }
  }, [alumnos]);

  const statusFilters = [
    { value: 'all', label: 'Todos', color: 'gray' },
    { value: 'active', label: 'Activos', color: 'green' },
    { value: 'inactive', label: 'Inactivos', color: 'red' },
    { value: 'paused', label: 'Pausados', color: 'yellow' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'progress', label: 'Progreso' },
    { value: 'lastActive', label: 'Última Actividad' },
    { value: 'joinDate', label: 'Fecha de Ingreso' }
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && user.role !== 'trainer' && user.role !== 'admin') {
      router.push('/client/dashboard');
    }
  }, [user, authLoading, router]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (selectedSort) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'progress':
        return b.progress - a.progress;
      case 'lastActive':
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      case 'joinDate':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return AlertCircle;
      case 'paused': return Pause;
      default: return Clock;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleStudentAction = (action: string, student: Student) => {
    switch (action) {
      case 'view':
        setSelectedStudent(student);
        setShowStudentDetails(true);
        break;
      case 'progress':
        router.push(`/trainer/students/${student.id}/progress`);
        break;
      case 'message':
        router.push(`/trainer/messages?student=${student.id}`);
        break;
      case 'edit':
        setSelectedStudent(student);
        setShowCreateModal(true);
        break;
      default:
        break;
    }
  };

  const handleCreateStudent = async () => {
    try {
      await createAlumno({
        nombre: newStudent.name,
        email: newStudent.email,
        telefono: newStudent.phone,
        objetivos: newStudent.goals ? newStudent.goals.split(',').map(g => g.trim()) : [],
        fechaInicio: new Date(),
        estado: 'activo',
      });
      setShowCreateModal(false);
      setNewStudent({ name: '', email: '', phone: '', goals: '' });
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  if (authLoading || alumnosLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando alumnos...</p>
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
            <div className="">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Alumnos</h1>
              <p className="text-gray-600">Gestiona y monitorea el progreso de tus alumnos</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Alumno
              </button>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+{metrics.newThisMonth}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.totalStudents}</h3>
              <p className="text-sm text-gray-600">Total Alumnos</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {Math.round((metrics.activeStudents / metrics.totalStudents) * 100)}%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.activeStudents}</h3>
              <p className="text-sm text-gray-600">Alumnos Activos</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+5%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.avgProgress}%</h3>
              <p className="text-sm text-gray-600">Progreso Promedio</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-green-600">{metrics.retentionRate}%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.completionRate}</h3>
              <p className="text-sm text-gray-600">Tasa de Completación</p>
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
                    placeholder="Buscar alumnos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedStatus}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {statusFilters.map(filter => 
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  )}
                </select>
                <select
                  value={selectedSort}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSort(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {sortOptions.map(option => 
                    <option key={option.value} value={option.value}>{option.label}</option>
                  )}
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

          {/* Students Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {sortedStudents.map((student) => {
              const StatusIcon = getStatusIcon(student.status);
              
              if (viewMode === 'grid') {
                return (
                  <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-bold text-lg">{student.avatar}</span>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(student.status)}`}>
                            {student.status === 'active' ? 'Activo' : student.status === 'inactive' ? 'Inactivo' : 'Pausado'}
                          </span>
                          {student.communication.unreadCount > 0 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                              {student.communication.unreadCount} nuevos
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{student.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{student.email}</p>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Progreso</span>
                          <span className="text-sm font-medium text-gray-900">{student.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 ${getProgressColor(student.progress)} rounded-full transition-all duration-300`}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Activity className="w-4 h-4 mr-2" />
                          {student.currentRoutine}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {student.nextSession}
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStudentAction('view', student)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStudentAction('progress', student)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Ver progreso detallado"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStudentAction('message', student)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStudentAction('edit', student)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // List view
                return (
                  <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-lg">{student.avatar}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(student.status)}`}>
                              {student.status === 'active' ? 'Activo' : student.status === 'inactive' ? 'Inactivo' : 'Pausado'}
                            </span>
                            {student.communication.unreadCount > 0 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                {student.communication.unreadCount} nuevos
                              </span>
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{student.progress}%</div>
                            <p className="text-xs text-gray-500">Progreso</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{student.completedSessions}/{student.totalSessions}</div>
                            <p className="text-xs text-gray-500">Sesiones</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStudentAction('view', student)}
                              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStudentAction('message', student)}
                              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStudentAction('edit', student)}
                              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
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

          {/* Create Student Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Agregar Nuevo Alumno</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ej: Juan Pérez"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="ejemplo@email.com"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+34 600 123 456"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos (separados por coma)</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      placeholder="Pérdida de peso, Ganar masa muscular..."
                      value={newStudent.goals}
                      onChange={(e) => setNewStudent({...newStudent, goals: e.target.value})}
                    />
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
                    onClick={handleCreateStudent}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Crear Alumno
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
