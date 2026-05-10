'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePlanes } from '@/lib/hooks/useFirestore';
import TrainerNav from '@/components/navigation/TrainerNav';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  MoreHorizontal,
  X,
  Send,
  Mail
} from 'lucide-react';
import { useArgentinaLocale } from '@/lib/hooks/useArgentinaLocale';
import type { Suscripcion, Pago } from '@/types';

export default function TrainerBilling() {
  const { user } = useAuth();
  const router = useRouter();
  const { formatCurrency } = useArgentinaLocale();
  const { planes, createPlan, updatePlan, deletePlan, loading: planesLoading } = usePlanes(user?.uid);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ nombre: '', descripcion: '', precio: 0, frecuencia: 'mensual' });

  const [subscriptions, setSubscriptions] = useState<Suscripcion[]>([
    {
      id: '1',
      alumnoId: 'student1',
      planId: 'profesional',
      planNombre: 'Plan Profesional',
      precio: 5500,
      moneda: 'ARS',
      frecuencia: 'mensual',
      estado: 'activa',
      fechaInicio: new Date('2024-01-01'),
      fechaProximoPago: new Date('2024-07-01'),
      metodoPago: 'mercado_pago',
      mercadoPagoPreferenceId: 'pref_123',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-06-01')
    },
    {
      id: '2',
      alumnoId: 'student2',
      planId: 'basico',
      planNombre: 'Plan Básico',
      precio: 2500,
      moneda: 'ARS',
      frecuencia: 'mensual',
      estado: 'activa',
      fechaInicio: new Date('2024-02-01'),
      fechaProximoPago: new Date('2024-07-15'),
      metodoPago: 'transferencia',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-06-15')
    },
    {
      id: '3',
      alumnoId: 'student3',
      planId: 'empresarial',
      planNombre: 'Plan Empresarial',
      precio: 12000,
      moneda: 'ARS',
      frecuencia: 'anual',
      estado: 'vencida',
      fechaInicio: new Date('2023-06-01'),
      fechaProximoPago: new Date('2024-06-01'),
      metodoPago: 'mercado_pago',
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2024-06-01')
    }
  ]);

  const [payments, setPayments] = useState<Pago[]>([
    {
      id: '1',
      suscripcionId: '1',
      alumnoId: 'student1',
      monto: 5500,
      moneda: 'ARS',
      fecha: new Date('2024-06-01'),
      metodoPago: 'mercado_pago',
      estado: 'completado',
      mercadoPagoPaymentId: 'pay_123',
      mercadoPagoStatus: 'approved',
      createdAt: new Date('2024-06-01')
    },
    {
      id: '2',
      suscripcionId: '2',
      alumnoId: 'student2',
      monto: 2500,
      moneda: 'ARS',
      fecha: new Date('2024-06-15'),
      metodoPago: 'transferencia',
      estado: 'completado',
      createdAt: new Date('2024-06-15')
    },
    {
      id: '3',
      suscripcionId: '3',
      alumnoId: 'student3',
      monto: 12000,
      moneda: 'ARS',
      fecha: new Date('2024-06-01'),
      metodoPago: 'mercado_pago',
      estado: 'pendiente',
      mercadoPagoPaymentId: 'pay_456',
      mercadoPagoStatus: 'pending',
      notas: 'Pago pendiente de renovación',
      createdAt: new Date('2024-06-01')
    }
  ]);

  const statusFilters = [
    { value: 'all', label: 'Todas' },
    { value: 'activa', label: 'Activas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'vencida', label: 'Vencidas' },
    { value: 'cancelada', label: 'Canceladas' }
  ];

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.planNombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || sub.estado === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const monthlyRevenue = payments
    .filter(p => p.estado === 'completado' && p.fecha.getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.monto, 0);

  const pendingPayments = payments.filter(p => p.estado === 'pendiente').length;
  const activeSubscriptions = subscriptions.filter(s => s.estado === 'activa').length;
  const overdueSubscriptions = subscriptions.filter(s => s.estado === 'vencida').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activa':
      case 'completado':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'vencida':
      case 'fallido':
        return 'error';
      case 'cancelada':
      case 'reembolsado':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await createPlan({
        ...newPlan,
        moneda: 'ARS',
        frecuencia: newPlan.frecuencia as 'mensual' | 'trimestral' | 'anual' | 'unico',
        activo: true
      });
      setShowPlanModal(false);
      setNewPlan({ nombre: '', descripcion: '', precio: 0, frecuencia: 'mensual' });
    } catch (error) {
      console.error('Error creating plan', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerNav />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Facturación y Pagos</h1>
            <p className="text-gray-600 mt-1">Gestiona suscripciones, pagos y cobros</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setShowPlanModal(true)}
            >
              Nuevo Plan
            </Button>
            <Button
              variant="outline"
              icon={<Mail className="w-5 h-5" />}
            >
              Enviar Recordatorios
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos del Mes</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyRevenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-success-600" />
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Suscripciones Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
                </div>
                <CreditCard className="w-8 h-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pagos Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
                </div>
                <Clock className="w-8 h-8 text-warning-600" />
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Suscripciones Vencidas</p>
                  <p className="text-2xl font-bold text-gray-900">{overdueSubscriptions}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-error-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Planes Ofrecidos */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mis Planes de Suscripción</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planes.map(plan => (
              <Card key={plan.id} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{plan.nombre}</h3>
                    <Badge variant={plan.activo ? 'success' : 'secondary'}>
                      {plan.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <p className="text-2xl font-black text-gray-900 mb-1">{formatCurrency(plan.precio)}</p>
                  <p className="text-sm text-gray-500 mb-4 capitalize">{plan.frecuencia}</p>
                  <p className="text-sm text-gray-600 mb-4">{plan.descripcion}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" icon={<Edit className="w-4 h-4" />}>Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => deletePlan(plan.id)} icon={<Trash2 className="w-4 h-4" />} />
                  </div>
                </CardContent>
              </Card>
            ))}
            {planes.length === 0 && !planesLoading && (
              <div className="col-span-3 text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">Aún no has creado ningún plan.</p>
                <Button variant="ghost" className="mt-2 text-primary-600" onClick={() => setShowPlanModal(true)}>
                  Crear mi primer plan
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar suscripciones..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statusFilters.map(filter => 
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              )}
            </select>
            <Button
              variant="outline"
              icon={<Filter className="w-4 h-4" />}
            >
              Filtros
            </Button>
          </div>
        </div>

        {/* Subscriptions Table */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Suscripciones Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Alumno</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Precio</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Frecuencia</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Próximo Pago</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map(sub => (
                    <tr key={sub.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">Alumno {sub.alumnoId}</td>
                      <td className="py-3 px-4">{sub.planNombre}</td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(sub.precio)}</td>
                      <td className="py-3 px-4">{sub.frecuencia}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(sub.estado)}>{sub.estado}</Badge>
                      </td>
                      <td className="py-3 px-4">{sub.fechaProximoPago.toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Send className="w-4 h-4" />}
                          >
                            Enviar Link
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<MoreHorizontal className="w-4 h-4" />}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card variant="elevated" className="mt-6">
          <CardHeader>
            <CardTitle>Pagos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.slice(0, 5).map(payment => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.estado === 'completado' ? 'bg-success-100' : 'bg-warning-100'
                    }`}>
                      {payment.estado === 'completado' ? (
                        <CheckCircle className="w-5 h-5 text-success-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-warning-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Alumno {payment.alumnoId}</p>
                      <p className="text-sm text-gray-600">{payment.fecha.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(payment.monto)}</p>
                    <Badge variant={getStatusColor(payment.estado)} className="mt-1">{payment.estado}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Crear Nuevo Plan</CardTitle>
              <Button variant="ghost" size="sm" icon={<X className="w-5 h-5" />} onClick={() => setShowPlanModal(false)} />
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Plan</label>
                  <Input 
                    required 
                    value={newPlan.nombre} 
                    onChange={e => setNewPlan({...newPlan, nombre: e.target.value})} 
                    placeholder="Ej. Plan Mensual Elite" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto Neto a Recibir (ARS)</label>
                  <Input 
                    type="number" 
                    required 
                    value={newPlan.precio || ''} 
                    onChange={e => setNewPlan({...newPlan, precio: Number(e.target.value)})} 
                    placeholder="Ej. 15000" 
                  />
                  <p className="text-xs text-gray-500 mt-1">El cliente verá este monto + recargo de Mercado Pago.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
                  <select 
                    className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:ring-2 focus:ring-primary-500"
                    value={newPlan.frecuencia}
                    onChange={e => setNewPlan({...newPlan, frecuencia: e.target.value})}
                  >
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                    <option value="unico">Pago Único</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea 
                    className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    value={newPlan.descripcion}
                    onChange={e => setNewPlan({...newPlan, descripcion: e.target.value})}
                    placeholder="Descripción de los beneficios..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" type="button" onClick={() => setShowPlanModal(false)}>Cancelar</Button>
                  <Button variant="primary" type="submit">Guardar Plan</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
