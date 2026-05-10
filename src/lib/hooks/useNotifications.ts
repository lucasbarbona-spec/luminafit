'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface SessionData {
  id: string;
  date: string;
  time: string;
  trainer: string;
}

interface StudentData {
  name: string;
  id: string;
}

interface SystemAlertDetails {
  type: string;
  message?: string;
  timestamp?: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  userId?: string;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'session' | 'student' | 'system' | 'message' | 'achievement';
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sessionReminders: boolean;
  studentUpdates: boolean;
  systemAlerts: boolean;
  newMessages: boolean;
  achievements: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    inApp: true,
    sessionReminders: true,
    studentUpdates: true,
    systemAlerts: true,
    newMessages: true,
    achievements: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const notificationQueueRef = useRef<Notification[]>([]);

  // Generar notificaciones inteligentes basadas en eventos
  const generateSmartNotification = useCallback((
    type: Notification['type'],
    category: Notification['category'],
    title: string,
    message: string,
    metadata?: Record<string, unknown>
  ): Notification => {
    const priority = determinePriority(type, category);
    
    return {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      userId,
      priority,
      category,
      metadata
    };
  }, [userId]);

  // Determinar prioridad basada en tipo y categoría
  const determinePriority = (
    type: Notification['type'],
    category: Notification['category']
  ): Notification['priority'] => {
    if (type === 'error') return 'high';
    if (category === 'system') return 'high';
    if (category === 'session' && type === 'warning') return 'medium';
    if (category === 'achievement') return 'medium';
    return 'low';
  };

  // Verificar si estamos en horas silenciosas
  const isInQuietHours = useCallback(() => {
    if (!preferences.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = preferences.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = preferences.quietHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime > endTime) {
      // Cruza medianoche
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }, [preferences.quietHours]);

  // Verificar si se debe mostrar notificación
  const shouldShowNotification = useCallback((notification: Notification): boolean => {
    if (isInQuietHours() && notification.priority !== 'high') return false;
    
    switch (notification.category) {
      case 'session':
        return preferences.sessionReminders;
      case 'student':
        return preferences.studentUpdates;
      case 'system':
        return preferences.systemAlerts;
      case 'message':
        return preferences.newMessages;
      case 'achievement':
        return preferences.achievements;
      default:
        return true;
    }
  }, [preferences, isInQuietHours]);

  // Agregar notificación
  const addNotification = useCallback((
    type: Notification['type'],
    category: Notification['category'],
    title: string,
    message: string,
    metadata?: Record<string, unknown>
  ) => {
    const notification = generateSmartNotification(type, category, title, message, metadata);
    
    if (shouldShowNotification(notification)) {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Simular notificación push del navegador
      if (preferences.push && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          tag: notification.id
        });
      }
    }
  }, [generateSmartNotification, shouldShowNotification, preferences.push]);

  // Marcar como leída
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // Eliminar notificación
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const removed = notifications.find(n => n.id === notificationId);
    if (removed && !removed.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, [notifications]);

  // Limpiar todas las notificaciones
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Actualizar preferencias
  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  // Solicitar permiso de notificaciones push
  const requestPushPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updatePreferences({ push: true });
      }
      return permission;
    }
    return 'denied';
  }, [updatePreferences]);

  // Generar notificaciones inteligentes automáticamente
  const generateSessionReminder = useCallback((sessionData: SessionData) => {
    const sessionTime = new Date(sessionData.date + ' ' + sessionData.time);
    const now = new Date();
    const timeDiff = sessionTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff <= 24 && hoursDiff > 0) {
      let message = '';
      let type: Notification['type'] = 'info';
      
      if (hoursDiff <= 2) {
        message = `La sesión con ${sessionData.trainer} comienza en menos de 2 horas`;
        type = 'warning';
      } else if (hoursDiff <= 24) {
        message = `Recordatorio: Sesión con ${sessionData.trainer} mañana a las ${sessionData.time}`;
        type = 'info';
      }

      addNotification(
        type,
        'session',
        'Recordatorio de Sesión',
        message,
        { sessionId: sessionData.id, sessionTime: sessionData.date + ' ' + sessionData.time }
      );
    }
  }, [addNotification]);

  const generateStudentUpdate = useCallback((studentData: StudentData, updateType: string) => {
    const messages = {
      'new_routine': `${studentData.name} ha completado una nueva rutina`,
      'progress': `${studentData.name} ha alcanzado un nuevo hito en su progreso`,
      'message': `${studentData.name} te ha enviado un mensaje`,
      'achievement': `${studentData.name} ha desbloqueado un nuevo logro`
    };

    addNotification(
      'success',
      'student',
      'Actualización de Alumno',
      messages[updateType as keyof typeof messages] || `${studentData.name} tiene una actualización`,
      { studentId: studentData.id, updateType }
    );
  }, [addNotification]);

  const generateSystemAlert = useCallback((alertType: string, details: SystemAlertDetails) => {
    const alerts = {
      'backup': 'Copia de seguridad completada exitosamente',
      'maintenance': 'Mantenimiento programado del sistema',
      'security': 'Se detectó una actividad inusual en tu cuenta',
      'update': 'Nuevas funciones disponibles en el sistema'
    };

    addNotification(
      alertType === 'security' ? 'error' : 'info',
      'system',
      'Alerta del Sistema',
      alerts[alertType as keyof typeof alerts] || 'Actualización del sistema',
      { alertType, details }
    );
  }, [addNotification]);

  // Simular notificaciones periódicas
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular notificaciones de ejemplo
      const random = Math.random();
      if (random < 0.1) { // 10% de probabilidad
        generateSystemAlert('backup', { type: 'backup', timestamp: new Date() });
      }
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [generateSystemAlert]);

  // Inicializar permisos de notificaciones
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      requestPushPermission();
    }
  }, [requestPushPermission]);

  // Calcular unread count
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updatePreferences,
    requestPushPermission,
    generateSessionReminder,
    generateStudentUpdate,
    generateSystemAlert
  };
}

// Hook para notificaciones en tiempo real
export function useRealtimeNotifications(userId: string) {
  const notifications = useNotifications(userId);
  const [isConnected, setIsConnected] = useState(false);

  // Simular conexión WebSocket para notificaciones en tiempo real
  useEffect(() => {
    setIsConnected(true);
    
    // Simular recepción de notificaciones en tiempo real
    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.05) { // 5% de probabilidad
        const types = ['info', 'success', 'warning'] as const;
        const categories = ['session', 'student', 'system', 'achievement'] as const;
        
        notifications.addNotification(
          types[Math.floor(Math.random() * types.length)],
          categories[Math.floor(Math.random() * categories.length)],
          'Notificación en Tiempo Real',
          'Esta es una notificación generada automáticamente para demostrar el sistema en tiempo real.'
        );
      }
    }, 20000); // Cada 20 segundos

    return () => {
      setIsConnected(false);
      clearInterval(interval);
    };
  }, [notifications]);

  return {
    ...notifications,
    isConnected
  };
}
