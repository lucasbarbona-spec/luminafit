'use client';

import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  Settings, 
  Bell, 
  Mail, 
  Smartphone, 
  Monitor, 
  Calendar, 
  Users, 
  AlertTriangle, 
  MessageSquare, 
  Trophy,
  Moon,
  Sun,
  Save,
  X
} from 'lucide-react';
import { NotificationPreferences } from '@/lib/hooks/useNotifications';

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onUpdatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  onRequestPushPermission: () => Promise<string>;
  onClose?: () => void;
}

export default function NotificationSettings({
  preferences,
  onUpdatePreferences,
  onRequestPushPermission,
  onClose
}: NotificationSettingsProps) {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isSaving, setIsSaving] = useState(false);

  // Actualizar preferencias locales
  const updateLocalPreference = (key: keyof NotificationPreferences, value: unknown) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  // Guardar preferencias
  const handleSave = async () => {
    setIsSaving(true);
    try {
      onUpdatePreferences(localPreferences);
      if (onClose) onClose();
    } finally {
      setIsSaving(false);
    }
  };

  // Solicitar permiso de notificaciones push
  const handleRequestPushPermission = async () => {
    const permission = await onRequestPushPermission();
    if (permission === 'granted') {
      updateLocalPreference('push', true);
    }
  };

  // Formatear tiempo
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">Configuración de Notificaciones</h2>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Canales de notificación */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Canales de Notificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Notificaciones en la App</h4>
                    <p className="text-sm text-gray-600">Mostrar notificaciones dentro de la aplicación</p>
                  </div>
                </div>
                <button
                  onClick={() => updateLocalPreference('inApp', !localPreferences.inApp)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localPreferences.inApp ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localPreferences.inApp ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Notificaciones Push</h4>
                    <p className="text-sm text-gray-600">Recibir notificaciones en tu dispositivo</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateLocalPreference('push', !localPreferences.push)}
                    disabled={!('Notification' in window)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localPreferences.push ? 'bg-primary-600' : 'bg-gray-200'
                    } ${!('Notification' in window) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localPreferences.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  {!('Notification' in window) && (
                    <Badge variant="warning" size="sm">
                      No soportado
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Notificaciones por Email</h4>
                    <p className="text-sm text-gray-600">Recibir resúmenes por correo electrónico</p>
                  </div>
                </div>
                <button
                  onClick={() => updateLocalPreference('email', !localPreferences.email)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localPreferences.email ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localPreferences.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Categorías de notificación */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Categorías de Notificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Recordatorios de Sesiones</h4>
                    <p className="text-sm text-gray-600">Alertas sobre próximas sesiones de entrenamiento</p>
                  </div>
                </div>
                <button
                  onClick={() => updateLocalPreference('sessionReminders', !localPreferences.sessionReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localPreferences.sessionReminders ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localPreferences.sessionReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Actualizaciones de Alumnos</h4>
                    <p className="text-sm text-gray-600">Notificaciones sobre progreso y actividades de alumnos</p>
                  </div>
                </div>
                <button
                  onClick={() => updateLocalPreference('studentUpdates', !localPreferences.studentUpdates)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localPreferences.studentUpdates ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localPreferences.studentUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Nuevos Mensajes</h4>
                    <p className="text-sm text-gray-600">Alertas cuando recibas nuevos mensajes</p>
                  </div>
                </div>
                <button
                  onClick={() => updateLocalPreference('newMessages', !localPreferences.newMessages)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localPreferences.newMessages ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localPreferences.newMessages ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Logros y Metas</h4>
                    <p className="text-sm text-gray-600">Celebración de logros y cumplimiento de objetivos</p>
                  </div>
                </div>
                <button
                  onClick={() => updateLocalPreference('achievements', !localPreferences.achievements)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localPreferences.achievements ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localPreferences.achievements ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Alertas del Sistema</h4>
                    <p className="text-sm text-gray-600">Notificaciones importantes del sistema</p>
                  </div>
                </div>
                <button
                  onClick={() => updateLocalPreference('systemAlerts', !localPreferences.systemAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localPreferences.systemAlerts ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localPreferences.systemAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Horas silenciosas */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Horas Silenciosas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Modo Silencioso</h4>
                    <p className="text-sm text-gray-600">No interrumpir durante horas específicas</p>
                  </div>
                </div>
                <button
                  onClick={() => updateLocalPreference('quietHours', {
                    ...localPreferences.quietHours,
                    enabled: !localPreferences.quietHours.enabled
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localPreferences.quietHours.enabled ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localPreferences.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {localPreferences.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
                    <input
                      type="time"
                      value={localPreferences.quietHours.start}
                      onChange={(e) => updateLocalPreference('quietHours', {
                        ...localPreferences.quietHours,
                        start: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
                    <input
                      type="time"
                      value={localPreferences.quietHours.end}
                      onChange={(e) => updateLocalPreference('quietHours', {
                        ...localPreferences.quietHours,
                        end: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              {localPreferences.quietHours.enabled && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      Modo silencioso activo de {formatTime(localPreferences.quietHours.start)} a {formatTime(localPreferences.quietHours.end)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <div className="text-sm text-gray-600">
            Las notificaciones de alta prioridad siempre se mostrarán
          </div>
          <div className="flex gap-3">
            {onClose && (
              <Button variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
            )}
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
