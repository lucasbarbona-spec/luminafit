'use client';

import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  Keyboard, 
  Navigation, 
  Plus, 
  Search, 
  HelpCircle, 
  X, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  MessageSquare,
  Home,
  Zap
} from 'lucide-react';
import type { KeyboardShortcut } from '@/lib/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
  isVisible: boolean;
  onClose: () => void;
  formatShortcut: (shortcut: KeyboardShortcut) => string;
}

export default function KeyboardShortcutsHelp({
  shortcuts,
  isVisible,
  onClose,
  formatShortcut
}: KeyboardShortcutsHelpProps) {
  if (!isVisible) return null;

  // Agrupar atajos por categoría
  const shortcutsByCategory = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <Navigation className="w-4 h-4" />;
      case 'actions': return <Zap className="w-4 h-4" />;
      case 'creation': return <Plus className="w-4 h-4" />;
      case 'search': return <Search className="w-4 h-4" />;
      case 'help': return <HelpCircle className="w-4 h-4" />;
      default: return <Keyboard className="w-4 h-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'navigation': return 'Navegación';
      case 'actions': return 'Acciones';
      case 'creation': return 'Creación';
      case 'search': return 'Búsqueda';
      case 'help': return 'Ayuda';
      default: return 'General';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return 'text-blue-600 bg-blue-50';
      case 'actions': return 'text-green-600 bg-green-50';
      case 'creation': return 'text-purple-600 bg-purple-50';
      case 'search': return 'text-yellow-600 bg-yellow-50';
      case 'help': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Atajos de Teclado</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Tips */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">Usa estos atajos de teclado para navegar más rápido por la aplicación:</p>
            
            {/* Tips box */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Consejos rápidos:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li key="tip1">Ctrl + Cmd funciona indistintamente en Windows/Mac</li>
                    <li key="tip2">Presiona ? para mostrar/ocultar esta ayuda</li>
                    <li key="tip3">Esc para cerrar cualquier modal o panel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Atajos por categoría */}
          {Object.entries(shortcutsByCategory).map(([category, categoryShortcuts]) => (
            <Card key={category} variant="elevated" className="mb-4">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                    {getCategoryIcon(category)}
                  </div>
                  <CardTitle className="text-lg">{getCategoryTitle(category)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {categoryShortcuts.map(shortcut => (
                    <div
                      key={`${shortcut.key}-${shortcut.ctrlKey}-${shortcut.altKey}-${shortcut.shiftKey}`}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {/* Teclas modificadoras */}
                          {shortcut.ctrlKey && (
                            <Badge key="ctrl" variant="secondary" size="sm">
                              Ctrl
                            </Badge>
                          )}
                          {shortcut.altKey && (
                            <Badge key="alt" variant="secondary" size="sm">
                              Alt
                            </Badge>
                          )}
                          {shortcut.shiftKey && (
                            <Badge key="shift" variant="secondary" size="sm">
                              Shift
                            </Badge>
                          )}
                          {shortcut.metaKey && (
                            <Badge key="meta" variant="secondary" size="sm">
                              Cmd
                            </Badge>
                          )}
                          {/* Tecla principal */}
                          <Badge key="key" variant="primary" size="sm">
                            {shortcut.key.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-gray-700">{shortcut.description}</span>
                      </div>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {formatShortcut(shortcut)}
                      </code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Atajos más usados */}
          <Card variant="elevated" className="mt-6">
            <CardHeader>
              <CardTitle>Atajos Más Usados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div key="home" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Home className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">Ctrl + H</div>
                    <div className="text-xs text-gray-600">Inicio</div>
                  </div>
                </div>
                <div key="search" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Search className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">/</div>
                    <div className="text-xs text-gray-600">Buscar</div>
                  </div>
                </div>
                <div key="help" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <HelpCircle className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">?</div>
                    <div className="text-xs text-gray-600">Ayuda</div>
                  </div>
                </div>
                <div key="students" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">Ctrl + 1</div>
                    <div className="text-xs text-gray-600">Alumnos</div>
                  </div>
                </div>
                <div key="calendar" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">Ctrl + 3</div>
                    <div className="text-xs text-gray-600">Calendario</div>
                  </div>
                </div>
                <div key="new" className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Plus className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">Ctrl + Shift + N</div>
                    <div className="text-xs text-gray-600">Nuevo</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <div className="text-sm text-gray-600">
            Presiona ? en cualquier momento para mostrar esta ayuda
          </div>
          <Button variant="primary" onClick={onClose}>
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
}
