'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  LogOut,
  Dumbbell,
  ShoppingBag,
  ChevronDown
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  current?: boolean;
}

export default function TrainerNav() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (loading || !isMounted) {
    return null;
  }

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/trainer/dashboard',
      icon: <Home className="w-5 h-5" />,
      current: pathname === '/trainer/dashboard'
    },
    {
      name: 'Alumnos',
      href: '/trainer/students',
      icon: <Users className="w-5 h-5" />,
      current: pathname === '/trainer/students'
    },
    {
      name: 'Rutinas',
      href: '/trainer/routines',
      icon: <Calendar className="w-5 h-5" />,
      current: pathname === '/trainer/routines'
    },
    {
      name: 'Analytics',
      href: '/trainer/analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      current: pathname === '/trainer/analytics'
    },
    {
      name: 'Marketplace',
      href: '/trainer/marketplace',
      icon: <ShoppingBag className="w-5 h-5" />,
      current: pathname === '/trainer/marketplace'
    }
  ];

  const handleLogout = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    logout();
    window.location.href = '/';
  };

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    window.location.href = href;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200 lg:fixed lg:inset-y-0 lg:z-40">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center px-6 mb-8">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <Dumbbell className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">LuminaFit</h1>
              <p className="text-xs text-gray-500">Panel Trainer</p>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-gray-600">
                  {(user?.displayName || 'T').charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.displayName || 'Trainer'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-4 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className="relative flex flex-col w-64 max-w-xs bg-white shadow-xl">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <Dumbbell className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gray-900">LuminaFit</h1>
                  <p className="text-xs text-gray-500">Panel Trainer</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Mobile User Info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-gray-600">
                    {(user?.displayName || 'T').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.displayName || 'Trainer'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 space-y-1 py-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Logout */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
