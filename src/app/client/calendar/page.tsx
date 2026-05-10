'use client';

import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import CalendarComponent from '@/components/ui/Calendar';
import { Calendar, Clock, Users, CheckCircle, Plus, Video, MessageSquare } from 'lucide-react';

import type { CalendarSession } from '@/components/ui/Calendar';

interface Session extends CalendarSession {}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Datos de ejemplo iniciales
  const initialSessions: Session[] = [
    {
      id: '1',
      title: 'Entrenamiento de fuerza',
      date: '2024-06-20',
      time: '10:00',
      trainer: 'Juan Pérez',
      type: 'Entrenamiento de fuerza',
      status: 'confirmed' as const
    },
    {
      id: '2',
      title: 'Cardio',
      date: '2024-06-22',
      time: '14:00',
      trainer: 'María García',
      type: 'Cardio',
      status: 'pending' as const
    },
    {
      id: '3',
      title: 'Yoga',
      date: '2024-06-25',
      time: '09:00',
      trainer: 'Ana López',
      type: 'Flexibilidad',
      status: 'confirmed' as const
    },
    {
      id: '4',
      title: 'HIIT',
      date: '2024-06-27',
      time: '16:00',
      trainer: 'Carlos Ruiz',
      type: 'Cardio intenso',
      status: 'pending' as const
    }
  ];

  // Estado local para sesiones
  const [sessions, setSessions] = useState(initialSessions);

  // Manejar clic en una fecha
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowSessionForm(true);
    setSelectedSession(null);
  };

  // Manejar clic en una sesión
  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setSelectedDate(new Date(session.date));
    setShowSessionForm(true);
  };

  // Crear nueva sesión
  const handleCreateSession = (sessionData: { title: string; date: Date; time: string; type: string; trainer: string }) => {
    const newSession: Session = { 
      title: sessionData.title,
      date: sessionData.date.toISOString().split('T')[0],
      time: sessionData.time,
      trainer: sessionData.trainer,
      type: sessionData.type,
      status: 'pending' as const,
      id: String(Date.now())
    };
    setSessions([...sessions, newSession]);
    setShowSessionForm(false);
  };

  // Actualizar sesión
  const handleUpdateSession = (sessionData: { title: string; date: Date; time: string; type: string; trainer: string }) => {
    setSessions(sessions.map((s) => s.id === selectedSession?.id ? { 
      ...s, 
      title: sessionData.title,
      date: sessionData.date.toISOString().split('T')[0],
      time: sessionData.time,
      trainer: sessionData.trainer,
      type: sessionData.type
    } : s));
    setShowSessionForm(false);
    setSelectedSession(null);
  };

  // Eliminar sesión
  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    setSelectedDate(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendario de Sesiones</h1>
          <p className="text-gray-600">Gestiona tus sesiones de entrenamiento</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedDate(new Date());
            setShowSessionForm(true);
            setSelectedSession(null);
          }}
        >
          Nueva Sesión
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario interactivo */}
        <div className="lg:col-span-2">
          <CalendarComponent
            sessions={sessions}
            onDateClick={handleDateClick}
            onSessionClick={handleSessionClick}
          />
        </div>

        {/* Panel lateral */}
        <div className="lg:col-span-1 space-y-6">
          {/* Próximas sesiones */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Próximas Sesiones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions
                  .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                  .slice(0, 5)
                  .map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{session.title}</h4>
                          <p className="text-sm text-gray-600">Con {session.trainer}</p>
                        </div>
                        <Badge
                          variant={session.status === 'confirmed' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {session.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {session.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.time}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="secondary" size="sm">
                          Video
                        </Button>
                        <Button variant="secondary" size="sm">
                          Mensaje
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Estadísticas del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total de sesiones</span>
                  <span className="font-semibold text-gray-900">{sessions.length.toString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Confirmadas</span>
                  <span className="font-semibold text-green-600">
                    {sessions.filter((s: { status: string }) => s.status === 'confirmed').length.toString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pendientes</span>
                  <span className="font-semibold text-yellow-600">
                    {sessions.filter((s: { status: string }) => s.status === 'pending').length.toString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de formulario de sesión */}
      {showSessionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedSession ? 'Editar Sesión' : 'Nueva Sesión'}
              </h3>
              <button
                onClick={() => {
                  setShowSessionForm(false);
                  setSelectedSession(null);
                  setSelectedDate(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title');
                const time = formData.get('time');
                const trainer = formData.get('trainer');
                const type = formData.get('type');
                
                if (!title || !time || !trainer || !type) return;
                if (typeof title !== 'string' || typeof time !== 'string' || typeof trainer !== 'string' || typeof type !== 'string') return;
                
                const sessionData = {
                  title,
                  date: selectedDate || new Date(),
                  time,
                  trainer,
                  type
                };
                
                if (selectedSession) {
                  handleUpdateSession(sessionData);
                } else {
                  handleCreateSession(sessionData);
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título de la sesión</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedSession?.title || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={selectedDate?.toISOString().split('T')[0] || selectedSession?.date || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    name="time"
                    defaultValue={selectedSession?.time || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entrenador</label>
                  <input
                    type="text"
                    name="trainer"
                    defaultValue={selectedSession?.trainer || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de entrenamiento</label>
                  <select
                    name="type"
                    defaultValue={selectedSession?.type || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="Fuerza">Fuerza</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Flexibilidad">Flexibilidad</option>
                    <option value="HIIT">HIIT</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                {selectedSession && (
                  <Button variant="danger" onClick={() => handleDeleteSession(selectedSession.id)}>
                    Eliminar
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowSessionForm(false);
                      setSelectedSession(null);
                      setSelectedDate(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button variant="primary">{selectedSession ? 'Actualizar' : 'Crear'}</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
