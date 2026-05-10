'use client';

import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  Users, 
  Calendar, 
  Plus, 
  Search, 
  FileText, 
  BarChart3, 
  MessageSquare,
  Clock,
  Activity,
  Target,
  Zap,
  ChevronRight,
  Star,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
  color: string;
  href: string;
  badge?: string;
  priority: 'high' | 'medium' | 'low';
}

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick?: (action: QuickAction) => void;
  showShortcuts?: boolean;
  compact?: boolean;
}

export default function QuickActions({
  actions,
  onActionClick,
  showShortcuts = true,
  compact = false
}: QuickActionsProps) {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Agrupar acciones por prioridad
  const highPriorityActions = actions.filter(action => action.priority === 'high');
  const mediumPriorityActions = actions.filter(action => action.priority === 'medium');
  const lowPriorityActions = actions.filter(action => action.priority === 'low');

  // Manejar clic en acción
  const handleActionClick = (action: QuickAction) => {
    if (onActionClick) {
      onActionClick(action);
    } else {
      window.location.href = action.href;
    }
  };

  // Renderizar acción individual
  const renderAction = (action: QuickAction) => {
    const isHovered = hoveredAction === action.id;
    
    return (
      <div
        key={action.id}
        className={`relative group cursor-pointer transition-all duration-200 ${
          compact 
            ? 'flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50' 
            : 'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-primary-300'
        }`}
        onClick={() => handleActionClick(action)}
        onMouseEnter={() => setHoveredAction(action.id)}
        onMouseLeave={() => setHoveredAction(null)}
      >
        {/* Icono */}
        <div
          className={`flex-shrink-0 ${
            compact ? 'w-8 h-8' : 'w-12 h-12'
          } rounded-lg flex items-center justify-center ${action.color}`}
        >
          {action.icon}
        </div>

        {/* Contenido */}
        <div className={`flex-1 ${compact ? '' : 'ml-4'}`}>
          <div className="flex items-center justify-between">
            <h3
              className={`font-medium text-gray-900 ${
                compact ? 'text-sm' : 'text-base'
              }`}
            >
              {action.title}
            </h3>
            {action.badge && (
              <Badge variant="primary" size="sm">
                {action.badge}
              </Badge>
            )}
          </div>
          {!compact && (
            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
          )}
          {showShortcuts && action.shortcut && (
            <div className={`flex items-center gap-1 mt-2 text-xs text-gray-500`}>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">
                {action.shortcut}
              </kbd>
            </div>
          )}
        </div>

        {/* Flecha */}
        <div
          className={`flex-shrink-0 transition-transform duration-200 ${
            isHovered ? 'translate-x-1' : ''
          }`}
        >
          <ChevronRight
            className={`w-5 h-5 text-gray-400 ${
              compact ? 'w-4 h-4' : ''
            }`}
          />
        </div>

        {/* Indicador de prioridad alta */}
        {action.priority === 'high' && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        )}
      </div>
    );
  };

  // Vista compacta (barra lateral)
  if (compact) {
    return <div className="space-y-1">{actions.map(renderAction)}</div>;
  }

  // Vista completa (tarjeta)
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Acciones de alta prioridad */}
        {highPriorityActions.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-red-600" />
              <h4 className="font-medium text-gray-900">Acciones Importantes</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {highPriorityActions.map(renderAction)}
            </div>
          </div>
        )}

        {/* Acciones de prioridad media */}
        {mediumPriorityActions.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-gray-900">Acciones Frecuentes</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mediumPriorityActions.map(renderAction)}
            </div>
          </div>
        )}

        {/* Acciones de baja prioridad */}
        {lowPriorityActions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-yellow-600" />
              <h4 className="font-medium text-gray-900">Otras Acciones</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lowPriorityActions.map(renderAction)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Hook para generar acciones rápidas para trainers
export function useTrainerQuickActions() {
  const [actions] = useState<QuickAction[]>([
    {
      id: 'add-student',
      title: 'Nuevo Alumno',
      description: 'Registrar un nuevo alumno en el sistema',
      icon: <Users className="w-6 h-6" />,
      shortcut: 'Ctrl + Shift + N',
      color: 'bg-blue-100 text-blue-600',
      href: '/trainer/students?action=add',
      priority: 'high'
    },
    {
      id: 'create-routine',
      title: 'Crear Rutina',
      description: 'Diseñar una nueva rutina de entrenamiento',
      icon: <FileText className="w-6 h-6" />,
      shortcut: 'Ctrl + Shift + R',
      color: 'bg-green-100 text-green-600',
      href: '/trainer/routines?action=create',
      priority: 'high'
    },
    {
      id: 'schedule-session',
      title: 'Agendar Sesión',
      description: 'Programar una nueva sesión de entrenamiento',
      icon: <Calendar className="w-6 h-6" />,
      shortcut: 'Ctrl + Shift + S',
      color: 'bg-purple-100 text-purple-600',
      href: '/trainer/calendar?action=create',
      priority: 'high',
      badge: 'Nuevo'
    },
    {
      id: 'view-students',
      title: 'Ver Alumnos',
      description: 'Gestionar lista de alumnos activos',
      icon: <Users className="w-6 h-6" />,
      shortcut: 'Ctrl + 1',
      color: 'bg-indigo-100 text-indigo-600',
      href: '/trainer/students',
      priority: 'medium'
    },
    {
      id: 'view-routines',
      title: 'Ver Rutinas',
      description: 'Explorar rutinas existentes',
      icon: <FileText className="w-6 h-6" />,
      shortcut: 'Ctrl + 2',
      color: 'bg-orange-100 text-orange-600',
      href: '/trainer/routines',
      priority: 'medium'
    },
    {
      id: 'view-calendar',
      title: 'Calendario',
      description: 'Ver agenda y sesiones programadas',
      icon: <Calendar className="w-6 h-6" />,
      shortcut: 'Ctrl + 3',
      color: 'bg-pink-100 text-pink-600',
      href: '/trainer/calendar',
      priority: 'medium'
    },
    {
      id: 'view-analytics',
      title: 'Analíticas',
      description: 'Ver estadísticas y reportes',
      icon: <BarChart3 className="w-6 h-6" />,
      shortcut: 'Ctrl + 4',
      color: 'bg-teal-100 text-teal-600',
      href: '/trainer/analytics',
      priority: 'medium'
    },
    {
      id: 'view-messages',
      title: 'Mensajes',
      description: 'Revisar comunicaciones con alumnos',
      icon: <MessageSquare className="w-6 h-6" />,
      shortcut: 'Ctrl + 5',
      color: 'bg-cyan-100 text-cyan-600',
      href: '/trainer/messages',
      priority: 'low'
    },
    {
      id: 'quick-search',
      title: 'Búsqueda Rápida',
      description: 'Buscar alumnos, rutinas o sesiones',
      icon: <Search className="w-6 h-6" />,
      shortcut: '/',
      color: 'bg-gray-100 text-gray-600',
      href: '/trainer/search',
      priority: 'low'
    },
    {
      id: 'view-progress',
      title: 'Progreso General',
      description: 'Ver progreso de todos los alumnos',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-emerald-100 text-emerald-600',
      href: '/trainer/progress',
      priority: 'low'
    },
    {
      id: 'view-marketplace',
      title: 'Marketplace',
      description: 'Gestionar productos y ofertas en el marketplace',
      icon: <ShoppingBag className="w-6 h-6" />,
      shortcut: 'Ctrl + Shift + M',
      color: 'bg-indigo-100 text-indigo-600',
      href: '/trainer/marketplace',
      priority: 'medium'
    }
  ]);

  return actions;
}

// Componente de acciones rápidas flotante
export function FloatingQuickActions({ actions }: { actions: QuickAction[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200 ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Panel de acciones */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-2 min-w-64">
          <div className="mb-2 px-2 py-1">
            <h3 className="text-sm font-medium text-gray-900">Acciones Rápidas</h3>
          </div>
          {actions.slice(0, 5).map(action => (
            <button
              key={action.id}
              onClick={() => {
                window.location.href = action.href;
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color}`}
              >
                {action.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{action.title}</div>
                {action.shortcut && (
                  <div className="text-xs text-gray-500">{action.shortcut}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
