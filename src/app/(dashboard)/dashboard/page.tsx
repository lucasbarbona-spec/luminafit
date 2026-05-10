'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useAlumnos } from '@/lib/hooks/useAlumnos';
import AlumnoCard from '@/components/cards/AlumnoCard';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Users, Activity, Calendar, TrendingUp, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { alumnos, loading: alumnosLoading } = useAlumnos();

  if (authLoading || alumnosLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" color="primary" />
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total de Alumnos',
      value: alumnos.length,
      icon: Users,
      color: 'primary',
      trend: '+2 esta semana',
    },
    {
      title: 'Alumnos Activos',
      value: alumnos.filter((a) => a.estado === 'activo').length,
      icon: Activity,
      color: 'success',
      trend: '+1 esta semana',
    },
    {
      title: 'Rutinas Activas',
      value: 0,
      icon: Calendar,
      color: 'warning',
      trend: 'Sin cambios',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary-600" />
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenido de vuelta,{' '}
                <span className="font-semibold text-gray-900">{user?.displayName || 'Entrenador'}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar alumnos..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <Link href="/alumnos/new">
                <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
                  Nuevo Alumno
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} variant="elevated" className="hover:scale-105 transition-transform duration-200">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.trend}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card variant="outlined" className="hover:shadow-medium transition-shadow cursor-pointer">
              <CardContent className="text-center py-6">
                <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Crear Rutina</p>
              </CardContent>
            </Card>
            <Card variant="outlined" className="hover:shadow-medium transition-shadow cursor-pointer">
              <CardContent className="text-center py-6">
                <Activity className="w-8 h-8 text-success-600 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Ver Progreso</p>
              </CardContent>
            </Card>
            <Card variant="outlined" className="hover:shadow-medium transition-shadow cursor-pointer">
              <CardContent className="text-center py-6">
                <TrendingUp className="w-8 h-8 text-warning-600 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Estadísticas</p>
              </CardContent>
            </Card>
            <Card variant="outlined" className="hover:shadow-medium transition-shadow cursor-pointer">
              <CardContent className="text-center py-6">
                <Users className="w-8 h-8 text-error-600 mx-auto mb-3" />
                <p className="font-medium text-gray-900">Gestionar Alumnos</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alumnos Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Mis Alumnos</CardTitle>
                <p className="text-gray-600 mt-1">Gestiona y monitorea el progreso de tus alumnos</p>
              </div>
              <Badge variant="info">{alumnos.length} alumnos</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {alumnos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alumnos.map((alumno) => (
                  <AlumnoCard key={alumno.id} alumno={alumno} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes alumnos aún</h3>
                <p className="text-gray-600 mb-6">
                  Comienza agregando tu primer alumno para crear rutinas personalizadas
                </p>
                <Link href="/alumnos/new">
                  <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
                    Crear Primer Alumno
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}