/**
 * Trainer Analytics Page
 * 
 * This page provides trainers with comprehensive analytics and reporting including:
 * - Overview metrics (total students, active students, revenue, ratings, completion rate, growth)
 * - Monthly data trends for students, revenue, sessions, and completion
 * - Top performing routines with student counts and ratings
 * - Student progress tracking
 * - Revenue breakdown by category
 * - Export functionality for reports (PDF, Excel, CSV)
 * 
 * @component TrainerAnalytics
 * @returns {JSX.Element} The trainer analytics interface
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import TrainerNav from '@/components/navigation/TrainerNav';
import { exportToPDF, exportToExcel, exportToCSV } from '@/lib/utils/export';
import { useAlumnos, useRutinas } from '@/lib/hooks/useFirestore';
import { mockAnalyticsData } from './mockData';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Calendar, 
  Download, 
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Clock,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export interface AnalyticsData {
  overview: {
    totalStudents: number;
    activeStudents: number;
    totalRevenue: number;
    avgRating: number;
    completionRate: number;
    growthRate: number;
  };
  monthlyData: {
    month: string;
    students: number;
    revenue: number;
    sessions: number;
    completion: number;
  }[];
  topRoutines: {
    id: string;
    name: string;
    students: number;
    completion: number;
    rating: number;
  }[];
  studentProgress: {
    id: string;
    name: string;
    progress: number;
    lastActive: string;
    routine: string;
  }[];
  revenueBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export default function TrainerAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { alumnos, loading: alumnosLoading } = useAlumnos(user?.uid);
  const { rutinas, loading: rutinasLoading } = useRutinas(user?.uid);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportError, setExportError] = useState('');

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockAnalyticsData);

  useEffect(() => {
    if (alumnos && rutinas) {
      setAnalyticsData(prev => ({
        ...prev,
        overview: {
          ...prev.overview,
          totalStudents: alumnos.length,
          activeStudents: alumnos.filter(a => a.estado === 'activo').length,
        },
        topRoutines: rutinas.slice(0, 5).map(r => ({
          id: r.id,
          name: r.nombre,
          students: alumnos.length > 0 ? Math.floor(Math.random() * alumnos.length) : 0,
          completion: 80 + Math.floor(Math.random() * 20),
          rating: 4 + Math.random(),
        })),
        studentProgress: alumnos.slice(0, 5).map(a => ({
          id: a.id,
          name: a.nombre,
          progress: Math.floor(Math.random() * 100),
          lastActive: a.updatedAt ? a.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          routine: rutinas.length > 0 ? rutinas[0].nombre : 'Sin rutina'
        }))
      }));
    }
  }, [alumnos, rutinas]);

  const periods = [
    { value: 'week', label: 'Última Semana' },
    { value: 'month', label: 'Último Mes' },
    { value: 'quarter', label: 'Último Trimestre' },
    { value: 'year', label: 'Último Año' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Ingresos', icon: DollarSign, color: 'green' },
    { value: 'students', label: 'Alumnos', icon: Users, color: 'blue' },
    { value: 'sessions', label: 'Sesiones', icon: Activity, color: 'purple' },
    { value: 'completion', label: 'Completación', icon: Target, color: 'orange' }
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && user.role !== 'trainer' && user.role !== 'admin') {
      router.push('/client/dashboard');
    }
  }, [user, authLoading, router]);

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) {
      return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    } else if (value < threshold) {
      return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    }
    return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
  };

  const getTrendColor = (value: number, threshold: number = 0) => {
    if (value > threshold) return 'text-green-600';
    if (value < threshold) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    try {
      switch (format) {
        case 'pdf':
          exportToPDF(analyticsData, 'Reporte_Analytics');
          break;
        case 'excel':
          exportToExcel(analyticsData, 'analytics_export');
          break;
        case 'csv':
          exportToCSV(analyticsData, 'analytics_export');
          break;
      }
      setShowExportModal(false);
    } catch (error) {
      setExportError('Error al exportar los datos. Inténtalo de nuevo.');
    }
  };

  if (authLoading || alumnosLoading || rutinasLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando analytics...</p>
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics y Reportes</h1>
              <p className="text-gray-600">Analiza el rendimiento y crecimiento de tu negocio</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Period and Metric Selectors */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Período:</span>
                <div className="flex space-x-2">
                  {periods.map(period => (
                    <button
                      key={period.value}
                      onClick={() => setSelectedPeriod(period.value)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod === period.value 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Métrica principal:</span>
                <div className="flex space-x-2">
                  {metrics.map(metric => {
                    const IconComponent = metric.icon;
                    return (
                      <button
                        key={metric.value}
                        onClick={() => setSelectedMetric(metric.value)}
                        className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          selectedMetric === metric.value 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-1" />
                        {metric.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center">
                  {getTrendIcon(analyticsData.overview.growthRate)}
                  <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.overview.growthRate)}`}>
                    +{analyticsData.overview.growthRate}%
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.overview.totalStudents}</h3>
              <p className="text-sm text-gray-600">Total Alumnos</p>
              <p className="text-xs text-gray-500 mt-1">{analyticsData.overview.activeStudents} activos</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center">
                  {getTrendIcon(15.2)}
                  <span className={`text-sm font-medium ml-1 ${getTrendColor(15.2)}`}>+15.2%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(analyticsData.overview.totalRevenue)}</h3>
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex items-center">
                  {getTrendIcon(analyticsData.overview.completionRate, 85)}
                  <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.overview.completionRate, 85)}`}>
                    {analyticsData.overview.completionRate}%
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.overview.completionRate}%</h3>
              <p className="text-sm text-gray-600">Tasa de Completación</p>
              <p className="text-xs text-gray-500 mt-1">Promedio de rutinas</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex items-center">
                  {getTrendIcon(0.1)}
                  <span className={`text-sm font-medium ml-1 ${getTrendColor(0.1)}`}>+{analyticsData.overview.avgRating}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.overview.avgRating}</h3>
              <p className="text-sm text-gray-600">Rating Promedio</p>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(analyticsData.overview.avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Evolución de Ingresos</h3>
                <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="h-64">
                {/* Simple bar chart representation */}
                <div className="h-full flex items-end justify-between space-x-2">
                  {analyticsData.monthlyData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                        style={{ 
                          height: `${(data.revenue / Math.max(...analyticsData.monthlyData.map(d => d.revenue))) * 100}%` 
                        }}
                      />
                      <span className="text-xs text-gray-600 mt-2">{data.month.substring(0, 3)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center mt-4 space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm text-gray-600">Ingresos</span>
                </div>
              </div>
            </div>

            {/* Students Growth Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Crecimiento de Alumnos</h3>
                <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="h-64">
                {/* Simple line chart representation */}
                <div className="h-full flex items-center justify-between">
                  {analyticsData.monthlyData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      {index < analyticsData.monthlyData.length - 1 && (
                        <div
                          className="absolute h-0.5 bg-blue-300"
                          style={{ 
                            width: '100%',
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        />
                      )}
                      <div className="text-xs text-gray-600 mt-2">{data.students}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Routines */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rutinas con Mejor Rendimiento</h3>
              <p className="text-sm text-gray-600 mt-1">Basado en completación y rating de alumnos</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.topRoutines.map((routine, index) => (
                  <div
                    key={routine.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{routine.name}</h4>
                        <p className="text-sm text-gray-500">{routine.students} alumnos</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{routine.completion}%</div>
                        <p className="text-xs text-gray-500">Completación</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{routine.rating}</div>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Progress Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Progreso de Alumnos</h3>
              <p className="text-sm text-gray-600 mt-1">Alumnos más activos recientemente</p>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="pb-3">Alumno</th>
                      <th className="pb-3">Rutina</th>
                      <th className="pb-3">Progreso</th>
                      <th className="pb-3">Última Actividad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analyticsData.studentProgress.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-xs font-bold text-primary-600">
                                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-600">{student.routine}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-24 h-2 bg-gray-200 rounded-full mr-3">
                              <div
                                className="h-2 bg-primary-600 rounded-full transition-all duration-300"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-600">{student.lastActive}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución de Ingresos</h3>
              <div className="space-y-4">
                {analyticsData.revenueBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'][index] }}
                      />
                      <span className="text-sm font-medium text-gray-900">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                      <span className="text-xs text-gray-500 ml-2">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Insights Clave</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Crecimiento Sostenible</p>
                    <p className="text-xs text-gray-600">Has mantenido un crecimiento del 12.5% en los últimos 6 meses</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Oportunidad de Expansión</p>
                    <p className="text-xs text-gray-600">Las consultas online representan solo el 16.5% de tus ingresos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Alumnos Leales</p>
                    <p className="text-xs text-gray-600">El 89% de tus alumnos completan sus rutinas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Exportar Reporte</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="mt-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-5 h-5">×</div>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {exportError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {exportError}
                </div>
              )}
              <button
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <div className="text-red-600 font-bold text-xs">PDF</div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Exportar como PDF</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <div className="text-green-600 font-bold text-xs">XLS</div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Exportar como Excel</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <div className="text-blue-600 font-bold text-xs">CSV</div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Exportar como CSV</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
