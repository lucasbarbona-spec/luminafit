/**
 * Calendar Component
 * 
 * A reusable calendar component for displaying and managing sessions.
 * Features:
 * - Month and week view modes
 * - Session display on calendar dates
 * - Date selection and session click handlers
 * - Navigation between months/weeks
 * - Session status indicators (confirmed, pending, completed)
 * 
 * @component Calendar
 * @param {CalendarSession[]} sessions - Array of sessions to display
 * @param {(date: Date) => void} onDateClick - Callback when a date is clicked
 * @param {(session: CalendarSession) => void} onSessionClick - Callback when a session is clicked
 * @param {'month' | 'week'} view - Initial view mode (default: 'month')
 * @returns {JSX.Element} The calendar component
 */
'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';

export interface CalendarSession {
  id: string;
  title: string;
  date: string;
  time: string;
  trainer?: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed';
}

interface CalendarProps {
  sessions?: CalendarSession[];
  onDateClick?: (date: Date) => void;
  onSessionClick?: (session: CalendarSession) => void;
  view?: 'month' | 'week';
}

export default function Calendar({ 
  sessions = [], 
  onDateClick, 
  onSessionClick, 
  view = 'month' 
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentView, setCurrentView] = useState<'month' | 'week'>(view);

  // Obtener el primer día del mes
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Obtener el último día del mes
  const getLastDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // Obtener los días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Agregar días vacíos al principio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Agregar todos los días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Obtener días de la semana
  const getDaysInWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Obtener sesiones para una fecha específica
  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(session => session.date === dateStr);
  };

  // Navegación
  const navigatePrevious = () => {
    if (currentView === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const navigateNext = () => {
    if (currentView === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Formatear mes y año
  const formatMonthYear = (date: Date) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Formatear semana
  const formatWeekRange = (date: Date) => {
    const days = getDaysInWeek(date);
    const start = days[0];
    const end = days[6];
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} - ${end.getDate()} de ${formatMonthYear(start).split(' ')[0]} ${start.getFullYear()}`;
    } else {
      return `${start.getDate()} de ${formatMonthYear(start).split(' ')[0]} - ${end.getDate()} de ${formatMonthYear(end).split(' ')[0]} ${end.getFullYear()}`;
    }
  };

  // Manejar clic en un día
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    if (onDateClick) {
      onDateClick(date);
    }
  };

  // Renderizar vista mensual
  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header del calendario */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={navigatePrevious}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold text-gray-900">{formatMonthYear(currentDate)}</h3>
            <Button variant="ghost" size="sm" onClick={navigateNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={goToToday}>
              Hoy
            </Button>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('month')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentView === 'month' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setCurrentView('week')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentView === 'week' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Semana
              </button>
            </div>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="bg-white p-2 h-24" />;
            }

            const daySessions = getSessionsForDate(date);
            const isToday = date.getTime() === today.getTime();
            const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();

            return (
              <div
                key={date.toISOString()}
                onClick={() => handleDayClick(date)}
                className={`bg-white p-2 h-24 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isToday ? 'bg-primary-50' : ''
                } ${isSelected ? 'ring-2 ring-primary-500' : ''} ${
                  !isCurrentMonth ? 'text-gray-400' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-primary-600' : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </span>
                  {isToday && <Badge variant="primary" size="sm">Hoy</Badge>}
                </div>
                <div className="space-y-1">
                  {daySessions.slice(0, 2).map(session => (
                    <div
                      key={session.id}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (onSessionClick) {
                          onSessionClick(session);
                        }
                      }}
                      className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                        session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="font-medium">{session.time}</div>
                      <div className="truncate">{session.title}</div>
                    </div>
                  ))}
                  {daySessions.length > 2 && (
                    <div className="text-xs text-gray-500">+{daySessions.length - 2} más</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizar vista semanal
  const renderWeekView = () => {
    const days = getDaysInWeek(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header del calendario */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={navigatePrevious}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold text-gray-900">{formatWeekRange(currentDate)}</h3>
            <Button variant="ghost" size="sm" onClick={navigateNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={goToToday}>
              Hoy
            </Button>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('month')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentView === 'month' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setCurrentView('week')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentView === 'week' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Semana
              </button>
            </div>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          <div className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">Hora</div>
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Horas del día */}
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 12 }, (_, hourIndex) => {
            const hour = hourIndex + 8; // 8 AM to 8 PM
            return (
              <div key={`hour-${hour}`} className="grid grid-cols-8 gap-px bg-gray-200">
                <div className="bg-gray-50 p-2 text-center text-sm text-gray-600">{`${hour}:00`}</div>
                {days.map(date => {
                  const daySessions = getSessionsForDate(date).filter(session => {
                    const sessionHour = parseInt(session.time.split(':')[0]);
                    return sessionHour === hour;
                  });

                  const isToday = date.getTime() === today.getTime();

                  return (
                    <div
                      key={`${date.toISOString()}-${hour}`}
                      onClick={() => handleDayClick(date)}
                      className={`bg-white p-2 min-h-[60px] cursor-pointer hover:bg-gray-50 transition-colors ${
                        isToday ? 'bg-primary-50' : ''
                      }`}
                    >
                      {daySessions.map(session => (
                        <div
                          key={session.id}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            if (onSessionClick) {
                              onSessionClick(session);
                            }
                          }}
                          className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 mb-1 ${
                            session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="font-medium">{session.time}</div>
                          <div className="truncate">{session.title}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return <div className="w-full">{currentView === 'month' ? renderMonthView() : renderWeekView()}</div>;
}
