'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNotifications, AppNotification } from '@/lib/hooks/useFirestore';
import ClientNav from '@/components/navigation/ClientNav';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter,
  X,
  Dumbbell,
  MessageSquare,
  Trophy,
  Calendar,
  Clock,
  ChevronRight
} from 'lucide-react';



export default function ClientNotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { notifications, loading: notifsLoading, markAsRead, markAllAsRead, deleteNotification, deleteNotifications } = useNotifications(user?.uid);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'routine' | 'message' | 'achievement' | 'session'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  // Redirect if not authenticated or not client
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && (user.role === 'trainer' || user.role === 'admin')) {
      router.push('/trainer/dashboard');
    }
  }, [user, authLoading, router]);

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !notification.isRead;
    return notification.type === filterType;
  });

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };

  const handleDeleteSelected = async () => {
    await deleteNotifications(Array.from(selectedNotifications));
    setSelectedNotifications(new Set());
  };

  const handleNotificationClick = (notification: AppNotification) => {
    handleMarkAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'routine':
        return <Dumbbell className="w-5 h-5" />;
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'achievement':
        return <Trophy className="w-5 h-5" />;
      case 'session':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'routine':
        return 'bg-primary-100 text-primary-700';
      case 'message':
        return 'bg-info-100 text-info-700';
      case 'achievement':
        return 'bg-warning-100 text-warning-700';
      case 'session':
        return 'bg-success-100 text-success-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Notificaciones</h1>
            <p className="text-gray-500 font-medium">
              {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="md"
                icon={<CheckCheck className="w-4 h-4" />}
                onClick={handleMarkAllAsRead}
              >
                Marcar todas como leídas
              </Button>
            )}
            {selectedNotifications.size > 0 && (
              <Button
                variant="danger"
                size="md"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={handleDeleteSelected}
              >
                Eliminar ({selectedNotifications.size})
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filterType === 'all' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilterType('all')}
          >
            Todas
          </Button>
          <Button
            variant={filterType === 'unread' ? 'primary' : 'outline'}
            size="md"
            onClick={() => setFilterType('unread')}
          >
            Sin leer
          </Button>
          <Button
            variant={filterType === 'routine' ? 'primary' : 'outline'}
            size="md"
            icon={<Dumbbell className="w-4 h-4" />}
            onClick={() => setFilterType('routine')}
          >
            Rutinas
          </Button>
          <Button
            variant={filterType === 'message' ? 'primary' : 'outline'}
            size="md"
            icon={<MessageSquare className="w-4 h-4" />}
            onClick={() => setFilterType('message')}
          >
            Mensajes
          </Button>
          <Button
            variant={filterType === 'achievement' ? 'primary' : 'outline'}
            size="md"
            icon={<Trophy className="w-4 h-4" />}
            onClick={() => setFilterType('achievement')}
          >
            Logros
          </Button>
          <Button
            variant={filterType === 'session' ? 'primary' : 'outline'}
            size="md"
            icon={<Calendar className="w-4 h-4" />}
            onClick={() => setFilterType('session')}
          >
            Sesiones
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No hay notificaciones</h3>
                <p className="text-gray-500">No tienes notificaciones en esta categoría</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'border-l-4 border-l-primary-500' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.has(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <div className={`p-3 rounded-xl flex-shrink-0 ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-bold ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.timestamp.toLocaleDateString()} {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Check className="w-4 h-4" />}
                              onClick={() => handleMarkAsRead(notification.id)}
                            />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={() => handleDeleteNotification(notification.id)}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      {notification.actionUrl && (
                        <div className="flex items-center text-sm text-primary-600 font-medium">
                          Ver detalles
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
