/**
 * Trainer Calendar Page
 * 
 * This page allows trainers to manage their training sessions including:
 * - Viewing sessions in calendar (month/week views)
 * - Creating new sessions with form validation
 * - Viewing session details
 * - Deleting sessions
 * - Filtering sessions by status (all, confirmed, pending, completed)
 * - Searching sessions by title or student name
 * 
 * @component TrainerCalendarPage
 * @returns {JSX.Element} The trainer calendar interface
 */
'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import TrainerNav from '@/components/navigation/TrainerNav';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import CalendarComponent from '@/components/ui/Calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  CheckCircle, 
  Plus, 
  Video, 
  MessageSquare,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  X
} from 'lucide-react';

import type { CalendarSession } from '@/components/ui/Calendar';

interface Session extends CalendarSession {
  studentId?: string;
  studentName?: string;
  notes?: string;
}

export default function TrainerCalendarPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'confirmed' | 'pending' | 'completed'>('all');
  const [isMounted, setIsMounted] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Form state for creating sessions
  const [newSession, setNewSession] = useState({
    title: '',
    date: '',
    time: '',
    type: 'Entrenamiento de fuerza',
    studentId: '',
    studentName: '',
    notes: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check for action parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    if (action === 'create') {
      setShowSessionForm(true);
    }
  }, []);

  // Datos de ejemplo iniciales
  const initialSessions: Session[] = [
    {
      id: '1',
      title: 'Entrenamiento de fuerza - Juan Pérez',
      date: '2024-06-20',
      time: '10:00',
      trainer: 'Trainer',
      type: 'Entrenamiento de fuerza',
      status: 'confirmed' as const,
      studentId: 'student1',
      studentName: 'Juan Pérez',
      notes: 'Enfoque en pierna'
    },
    {
      id: '2',
      title: 'Cardio - María García',
      date: '2024-06-22',
      time: '14:00',
      trainer: 'Trainer',
      type: 'Cardio',
      status: 'pending' as const,
      studentId: 'student2',
      studentName: 'María García'
    },
    {
      id: '3',
      title: 'Yoga - Ana López',
      date: '2024-06-25',
      time: '09:00',
      trainer: 'Trainer',
      type: 'Flexibilidad',
      status: 'confirmed' as const,
      studentId: 'student3',
      studentName: 'Ana López'
    },
    {
      id: '4',
      title: 'HIIT - Carlos Ruiz',
      date: '2024-06-28',
      time: '16:00',
      trainer: 'Trainer',
      type: 'HIIT',
      status: 'pending' as const,
      studentId: 'student4',
      studentName: 'Carlos Ruiz'
    }
  ];

  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  // Redirect if not authenticated or not trainer
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'trainer' && user.role !== 'admin') {
      router.push('/client/dashboard');
    }
  }, [user, router]);

  // Show loading state while auth is being determined
  if (loading || !isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.studentName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || session.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateSession = () => {
    setShowSessionForm(true);
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    setSelectedSession(null);
  };

  const handleSaveSession = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validate required fields
    if (!newSession.title || !newSession.date || !newSession.time) {
      setFormError('Por favor completa los campos requeridos');
      return;
    }

    // Create new session
    const session: Session = {
      id: Date.now().toString(),
      title: newSession.title,
      date: newSession.date,
      time: newSession.time,
      trainer: user?.email || 'Trainer',
      type: newSession.type,
      status: 'pending' as const,
      studentId: newSession.studentId,
      studentName: newSession.studentName,
      notes: newSession.notes
    };

    setSessions([...sessions, session]);
    setShowSessionForm(false);
    
    // Reset form
    setNewSession({
      title: '',
      date: '',
      time: '',
      type: 'Entrenamiento de fuerza',
      studentId: '',
      studentName: '',
      notes: ''
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setNewSession(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success-500 text-white';
      case 'pending':
        return 'bg-warning-500 text-white';
      case 'completed':
        return 'bg-primary-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Calendario de Sesiones</h1>
            <p className="text-gray-500 font-medium">Gestiona tus sesiones de entrenamiento</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleCreateSession}
            className="mt-4 sm:mt-0"
            aria-label="Crear nueva sesión"
          >
            Nueva Sesión
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar sesiones o alumnos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl"
              aria-label="Buscar sesiones o alumnos"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'primary' : 'outline'}
              size="md"
              onClick={() => setFilterType('all')}
              aria-label="Mostrar todas las sesiones"
              aria-pressed={filterType === 'all'}
            >
              Todas
            </Button>
            <Button
              variant={filterType === 'confirmed' ? 'primary' : 'outline'}
              size="md"
              onClick={() => setFilterType('confirmed')}
              aria-label="Mostrar sesiones confirmadas"
              aria-pressed={filterType === 'confirmed'}
            >
              Confirmadas
            </Button>
            <Button
              variant={filterType === 'pending' ? 'primary' : 'outline'}
              size="md"
              onClick={() => setFilterType('pending')}
              aria-label="Mostrar sesiones pendientes"
              aria-pressed={filterType === 'pending'}
            >
              Pendientes
            </Button>
            <Button
              variant={filterType === 'completed' ? 'primary' : 'outline'}
              size="md"
              onClick={() => setFilterType('completed')}
              aria-label="Mostrar sesiones completadas"
              aria-pressed={filterType === 'completed'}
            >
              Completadas
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Calendario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  sessions={filteredSessions}
                  onDateClick={setSelectedDate}
                  onSessionClick={handleSessionClick}
                />
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Sessions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Próximas Sesiones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredSessions.slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-sm">{session.title}</h3>
                        <Badge className={getStatusColor(session.status)} variant="default">
                          {session.status === 'confirmed' ? 'Confirmada' : 
                           session.status === 'pending' ? 'Pendiente' : 'Completada'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{session.date}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{session.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Session Detail Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="session-detail-title">
            <Card className="max-w-lg w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle id="session-detail-title">Detalle de Sesión</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<X className="w-5 h-5" />}
                    onClick={() => setSelectedSession(null)}
                    aria-label="Cerrar detalle de sesión"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{selectedSession.title}</h3>
                    <p className="text-sm text-gray-500">{selectedSession.type}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedSession.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedSession.time}</span>
                    </div>
                  </div>

                  {selectedSession.studentName && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedSession.studentName}</span>
                    </div>
                  )}

                  {selectedSession.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Notas:</p>
                      <p className="text-sm text-gray-600">{selectedSession.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="primary"
                      size="md"
                      icon={<Edit className="w-4 h-4" />}
                      className="flex-1"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => handleDeleteSession(selectedSession.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Session Form Modal */}
        {showSessionForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="create-session-title">
            <Card className="max-w-lg w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle id="create-session-title">Nueva Sesión</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<X className="w-5 h-5" />}
                    onClick={() => setShowSessionForm(false)}
                    aria-label="Cerrar formulario de nueva sesión"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSession} className="space-y-4">
                  {formError && (
                    <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
                      {formError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Título</label>
                    <Input
                      type="text"
                      placeholder="Ej: Entrenamiento de fuerza"
                      value={newSession.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Fecha</label>
                      <Input
                        type="date"
                        value={newSession.date}
                        onChange={(e) => handleFormChange('date', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Hora</label>
                      <Input
                        type="time"
                        value={newSession.time}
                        onChange={(e) => handleFormChange('time', e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tipo</label>
                    <select 
                      value={newSession.type}
                      onChange={(e) => handleFormChange('type', e.target.value)}
                      className="w-full h-12 rounded-xl border border-gray-200 px-4"
                    >
                      <option>Entrenamiento de fuerza</option>
                      <option>Cardio</option>
                      <option>Flexibilidad</option>
                      <option>HIIT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Alumno</label>
                    <select 
                      value={newSession.studentId}
                      onChange={(e) => {
                        const selectedOption = e.target.options[e.target.selectedIndex];
                        handleFormChange('studentId', e.target.value);
                        handleFormChange('studentName', selectedOption.text !== 'Seleccionar alumno...' ? selectedOption.text : '');
                      }}
                      className="w-full h-12 rounded-xl border border-gray-200 px-4"
                    >
                      <option value="">Seleccionar alumno...</option>
                      <option value="student1">Juan Pérez</option>
                      <option value="student2">María García</option>
                      <option value="student3">Ana López</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Notas</label>
                    <textarea
                      placeholder="Notas adicionales..."
                      value={newSession.notes}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      className="w-full h-24 rounded-xl border border-gray-200 p-4 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="primary"
                      size="md"
                      className="flex-1"
                    >
                      Crear Sesión
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setShowSessionForm(false);
                        setNewSession({
                          title: '',
                          date: '',
                          time: '',
                          type: 'Entrenamiento de fuerza',
                          studentId: '',
                          studentName: '',
                          notes: ''
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
