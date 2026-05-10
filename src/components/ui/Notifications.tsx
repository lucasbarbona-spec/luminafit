'use client';

import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck, 
  X, 
  Settings, 
  Calendar, 
  Users, 
  AlertTriangle, 
  MessageSquare, 
  Trophy,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Notification, NotificationPreferences } from '@/lib/hooks/useNotifications';

interface NotificationsProps {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  isConnected: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemoveNotification: (id: string) => void;
  onClearAll: () => void;
  onUpdatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  onRequestPushPermission: () => Promise<string>;
}

export default function Notifications({
  notifications,
  unreadCount,
  preferences,
  isConnected,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemoveNotification,
  onClearAll,
  onUpdatePreferences,
  onRequestPushPermission
}: NotificationsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'session' | 'student' | 'system' | 'achievement'>('all');

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'session') return notification.category === 'session';
    if (filter === 'student') return notification.category === 'student';
    if (filter === 'system') return notification.category === 'system';
    if (filter === 'achievement') return notification.category === 'achievement';
    return true;
  });

  // Obtener icono por tipo
  const getIconByType = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  // Obtener icono por categoría
  const getIconByCategory = (category: Notification['category']) => {
    switch (category) {
      case 'session': return <Calendar className="w-4 h-4" />;
      case 'student': return <Users className="w-4 h-4" />;
      case 'system': return <AlertTriangle className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'achievement': return <Trophy className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  // Obtener color por tipo
  const getColorByType = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  // Formatear tiempo
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    return `Hace ${days} d`;
  };

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="primary"
            size="sm"
            className="absolute -top-1 -right-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount.toString()}
          </Badge>
        )}
        {!isConnected && (
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Panel de notificaciones */}
      {showSettings && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Notificaciones</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                    Marcar todas como leídas
                  </Button>
                )}
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'all' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'unread' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                No leídas
              </button>
              <button
                onClick={() => setFilter('session')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'session' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sesiones
              </button>
              <button
                onClick={() => setFilter('student')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'student' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Alumnos
              </button>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="overflow-y-auto max-h-64">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${getColorByType(notification.type)}`}>
                        {getIconByType(notification.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                        <p className="text-gray-600 text-xs">{notification.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-gray-400">{getIconByCategory(notification.category)}</div>
                      <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          notification.priority === 'high' ? 'bg-red-500' :
                          notification.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-gray-300'
                        }`}
                      />
                      <span className="text-xs text-gray-500">{notification.priority}</span>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Marcar como leída"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveNotification(notification.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Eliminar"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay notificaciones</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-xs text-gray-600">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={onClearAll}>
                  Limpiar todo
                </Button>
                <Button variant="ghost" size="sm">
                  Configuración
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
