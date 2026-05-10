'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { 
  Home, 
  Activity, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User,
  Target,
  Award,
  ChevronRight,
  Bell,
  Search,
  CreditCard,
  ShoppingBag
} from 'lucide-react';

export default function ClientNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/client/dashboard', icon: Home },
    { name: 'Rutinas', href: '/client/routines', icon: Activity },
    { name: 'Progreso', href: '/client/progress', icon: TrendingUp },
    { name: 'Calendario', href: '/client/calendar', icon: Calendar },
    { name: 'Logros', href: '/client/achievements', icon: Award },
    { name: 'Suscripción', href: '/client/subscription', icon: CreditCard },
    { name: 'Marketplace', href: '/client/marketplace', icon: ShoppingBag },
    { name: 'Configuración', href: '/client/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/client/dashboard') {
      return pathname === href || pathname === '/client';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Mobile menu button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
            <Activity className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">LuminaFit</h1>
            <p className="text-xs text-gray-500">Cliente</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* User info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-primary-600 font-bold text-sm">
              {(user?.displayName || 'U').substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">{user?.displayName || 'Usuario'}</h3>
            <p className="text-xs text-gray-500">{user?.email || 'usuario@email.com'}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="text-center">
            <div className="font-bold text-gray-900">85%</div>
            <div className="text-gray-500">Progreso</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">12</div>
            <div className="text-gray-500">Sesiones</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">3</div>
            <div className="text-gray-500">Logros</div>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => {
                router.push(item.href);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              {item.name}
              {isActive(item.href) && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => router.push('/client/notifications')}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5 mr-3" />
          Notificaciones
          <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
