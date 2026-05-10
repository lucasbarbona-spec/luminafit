'use client';

import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { User, Bell, Shield, CreditCard, HelpCircle, Moon, Globe, Lock, Smartphone, Mail, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 234 567 8900',
    bio: 'Entusiasta del fitness, enfocado en ganar fuerza y mantener un estilo de vida saludable.',
    notifications: {
      email: true,
      push: true,
      sms: false,
      workoutReminders: true,
      achievementAlerts: true,
      trainerMessages: true
    },
    privacy: {
      shareProgress: true,
      showAchievements: true,
      allowMessages: true
    },
    subscription: {
      plan: 'Premium',
      status: 'active',
      nextBilling: '2024-07-15',
      amount: 29.99
    }
  });

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
    { id: 'billing', label: 'Facturación', icon: CreditCard },
    { id: 'security', label: 'Seguridad', icon: Lock },
    { id: 'help', label: 'Ayuda', icon: HelpCircle }
  ];

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value }
    }));
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [field]: value }
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-600">Gestiona tu perfil y preferencias</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de navegación */}
        <div className="lg:col-span-1">
          <Card variant="elevated">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 border-primary-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          {/* Perfil */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleProfileChange('bio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button variant="primary">Guardar Cambios</Button>
              </div>
            </div>
          )}

          {/* Notificaciones */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Preferencias de Notificación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Notificaciones por Email</div>
                      <p className="text-sm text-gray-600">Recibir actualizaciones por correo electrónico</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('email', !profile.notifications.email)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profile.notifications.email ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Notificaciones Push</div>
                      <p className="text-sm text-gray-600">Notificaciones en tiempo real en tu dispositivo</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('push', !profile.notifications.push)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profile.notifications.push ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Privacidad */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Configuración de Privacidad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Compartir Progreso</div>
                      <p className="text-sm text-gray-600">Permitir que otros vean tu progreso</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange('shareProgress', !profile.privacy.shareProgress)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profile.privacy.shareProgress ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.privacy.shareProgress ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Facturación */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Información de Suscripción</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                    <div>
                      <h3 className="text-lg font-medium text-primary-900">{profile.subscription.plan}</h3>
                      <p className="text-sm text-primary-700">Estado: {profile.subscription.status}</p>
                    </div>
                    <Badge variant="success">Activo</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Próximo cobro</span>
                      <span className="font-medium">{profile.subscription.nextBilling}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monto</span>
                      <span className="font-medium">${profile.subscription.amount}/mes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Seguridad */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Seguridad de la Cuenta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Button variant="secondary">Cambiar Contraseña</Button>
                  </div>
                  <div>
                    <Button variant="secondary">Configurar Autenticación de Dos Factores</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ayuda */}
          {activeTab === 'help' && (
            <div className="space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Ayuda y Soporte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      Preguntas Frecuentes
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      Contactar Soporte
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      Enviar Comentarios
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
