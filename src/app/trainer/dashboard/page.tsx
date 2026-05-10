'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRealtimeNotifications } from '@/lib/hooks/useNotifications';
import { useTrainerKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { useTrainerQuickActions } from '@/components/ui/QuickActions';
import { useArgentinaLocale } from '@/lib/hooks/useArgentinaLocale';
import { useAlumnos } from '@/lib/hooks/useAlumnos';
import { useRutinas } from '@/lib/hooks/useFirestore';
import TrainerNav from '@/components/navigation/TrainerNav';
import Notifications from '@/components/ui/Notifications';
import QuickActions from '@/components/ui/QuickActions';
import KeyboardShortcutsHelp from '@/components/ui/KeyboardShortcutsHelp';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Star, 
  Plus, 
  Activity,
  Clock,
  Award,
  Target,
  ChevronRight,
  Bell,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface QuickStats {
  totalStudents: number;
  activeRoutines: number;
  avgProgress: number;
  monthlyRevenue: number;
  completedSessions: number;
  upcomingSessions: number;
}

interface RecentActivity {
  id: string;
  type: 'student' | 'routine' | 'session';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

interface StudentProgress {
  id: string;
  name: string;
  avatar: string;
  progress: number;
  lastActive: string;
  routine: string;
}

export default function TrainerDashboard() {
  const { user, logout } = useAuth();
  const { formatCurrency, formatDate, formatTime } = useArgentinaLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showHelp, setShowHelp] = useState(false);
  
  const notifications = useRealtimeNotifications(user?.uid || 'trainer-1');
  const keyboardShortcuts = useTrainerKeyboardShortcuts();
  const quickActions = useTrainerQuickActions();
  
  const { alumnos, loading: alumnosLoading } = useAlumnos();
  const { rutinas, loading: rutinasLoading } = useRutinas();
  
  const stats: QuickStats = {
    totalStudents: alumnos.length,
    activeRoutines: rutinas.length,
    avgProgress: 0,
    monthlyRevenue: 0,
    completedSessions: 0,
    upcomingSessions: 0,
  };

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'student',
      title: 'Nuevo alumno registrado',
      description: 'María González se ha unido a tu programa',
      time: 'Hace 2 horas',
      icon: <Users className="w-5 h-5 text-blue-600" />
    },
    {
      id: '2',
      type: 'routine',
      title: 'Rutina completada',
      description: 'Juan Pérez completó su rutina de pierna',
      time: 'Hace 4 horas',
      icon: <Activity className="w-5 h-5 text-green-600" />
    },
    {
      id: '3',
      type: 'session',
      title: 'Sesión programada',
      description: 'Clase de yoga mañana a las 10:00 AM',
      time: 'Hace 6 horas',
      icon: <Calendar className="w-5 h-5 text-purple-600" />
    }
  ]);

  const studentProgress: StudentProgress[] = alumnos
    .slice(0, 5)
    .map(alumno => ({
      id: alumno.id,
      name: alumno.nombre,
      avatar: alumno.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      progress: 0,
      lastActive: 'Sin actividad',
      routine: 'Sin rutina asignada'
    }));

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'trainer' && user.role !== 'admin') {
      router.push('/client/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    keyboardShortcuts.setupTrainerShortcuts({
      navigateToStudents: () => router.push('/trainer/students'),
      navigateToRoutines: () => router.push('/trainer/routines'),
      navigateToCalendar: () => router.push('/trainer/calendar'),
      navigateToAnalytics: () => router.push('/trainer/analytics'),
      navigateToMessages: () => router.push('/trainer/messages'),
      createStudent: () => router.push('/trainer/students?action=add'),
      createRoutine: () => router.push('/trainer/routines?action=create'),
      createSession: () => router.push('/trainer/calendar?action=create'),
      search: () => {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="buscar"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        } else {
          router.push('/trainer/search');
        }
      },
      toggleNotifications: () => {
        const notificationsButton = document.querySelector('[data-notifications-toggle]');
        if (notificationsButton) {
          (notificationsButton as HTMLElement).click();
        }
      },
      toggleHelp: () => setShowHelp(!showHelp)
    });
  }, [keyboardShortcuts, router, showHelp]);

  useEffect(() => {
    if (stats.upcomingSessions > 0) {
      notifications.addNotification(
        'info',
        'session',
        'Próximas Sesiones',
        `Tienes ${stats.upcomingSessions} sesiones programadas para esta semana`,
        { sessionCount: stats.upcomingSessions }
      );
    }

    if (stats.completedSessions > 100) {
      notifications.addNotification(
        'success',
        'achievement',
        '¡Excelente Trabajo!',
        'Has completado más de 100 sesiones este mes',
        { sessionsCompleted: stats.completedSessions }
      );
    }

    if (recentActivities.length > 0) {
      const newStudentActivity = recentActivities.find(a => a.type === 'student');
      if (newStudentActivity) {
        notifications.addNotification(
          'success',
          'student',
          'Nuevo Alumno',
          newStudentActivity.description,
          { activityId: newStudentActivity.id }
        );
      }
    }
  }, [stats.upcomingSessions, stats.completedSessions, recentActivities, notifications]);

  const handleViewMarketplace = () => {
    router.push('/trainer/marketplace');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-student':
        router.push('/trainer/students?action=add');
        break;
      case 'create-routine':
        router.push('/trainer/routines?action=create');
        break;
      case 'view-analytics':
        router.push('/trainer/analytics');
        break;
      case 'schedule-session':
        router.push('/trainer/calendar');
        break;
    }
  };

  if (alumnosLoading || rutinasLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
      <TrainerNav />
      
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  ¡Bienvenido de nuevo, {user.displayName || 'Trainer'}! 👋
                </h1>
                <p className="text-gray-600">Aquí tienes el resumen de tu actividad hoy</p>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <div data-notifications-toggle="true">
                  <Notifications
                    notifications={notifications.notifications}
                    unreadCount={notifications.unreadCount}
                    preferences={notifications.preferences}
                    isConnected={notifications.isConnected}
                    onMarkAsRead={notifications.markAsRead}
                    onMarkAllAsRead={notifications.markAllAsRead}
                    onRemoveNotification={notifications.removeNotification}
                    onClearAll={notifications.clearAll}
                    onUpdatePreferences={notifications.updatePreferences}
                    onRequestPushPermission={notifications.requestPushPermission}
                  />
                </div>
                <button
                  onClick={() => router.push('/trainer/search')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleViewMarketplace}
                  className="hidden sm:inline-flex"
                >
                  Marketplace
                </Button>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <QuickActions
              actions={quickActions}
              showShortcuts={true}
              compact={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card variant="elevated" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="success" size="sm">+12%</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalStudents}</h3>
              <p className="text-sm text-gray-600">Alumnos Activos</p>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <Badge variant="success" size="sm">+8%</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.activeRoutines}</h3>
              <p className="text-sm text-gray-600">Rutinas Activas</p>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="success" size="sm">+5%</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.avgProgress}%</h3>
              <p className="text-sm text-gray-600">Progreso Promedio</p>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <Badge variant="success" size="sm">+15%</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.monthlyRevenue)}</h3>
              <p className="text-sm text-gray-600">Ingresos Mensuales (ARS)</p>
            </Card>
          </div>

          <Card padding="lg" className="mb-8">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>Progreso de Alumnos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentProgress.length > 0 ? (
                  studentProgress.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-600">{student.avatar}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.routine}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-primary-600 rounded-full transition-all duration-300"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{student.progress}%</span>
                        </div>
                        <p className="text-xs text-gray-500">{student.lastActive}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No hay alumnos registrados aún</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <KeyboardShortcutsHelp
        shortcuts={keyboardShortcuts.getAllShortcuts()}
        isVisible={showHelp}
        onClose={() => setShowHelp(false)}
        formatShortcut={keyboardShortcuts.formatShortcut}
      />
    </div>
  );
}
