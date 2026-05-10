'use client';

import { useEffect, useCallback, useRef, useState } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category: 'navigation' | 'actions' | 'creation' | 'search' | 'help';
}

interface KeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  showHelp?: boolean;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const {
    enabled = true,
    preventDefault = true,
    showHelp = false
  } = options;

  const shortcutsRef = useRef<KeyboardShortcut[]>([]);
  const isHelpVisibleRef = useRef(false);

  // Registrar un atajo de teclado
  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    shortcutsRef.current.push(shortcut);
  }, []);

  // Eliminar un atajo de teclado
  const unregisterShortcut = useCallback((key: string, modifiers: Partial<Pick<KeyboardShortcut, 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>> = {}) => {
    shortcutsRef.current = shortcutsRef.current.filter(shortcut => 
      shortcut.key !== key || 
      shortcut.ctrlKey !== modifiers.ctrlKey ||
      shortcut.altKey !== modifiers.altKey ||
      shortcut.shiftKey !== modifiers.shiftKey ||
      shortcut.metaKey !== modifiers.metaKey
    );
  }, []);

  // Manejar eventos de teclado
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const matchingShortcut = shortcutsRef.current.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.metaKey === event.metaKey
      );
    });

    if (matchingShortcut) {
      if (preventDefault) {
        event.preventDefault();
      }
      matchingShortcut.action();
    }
  }, [enabled, preventDefault]);

  // Mostrar/Ocultar ayuda de atajos
  const toggleHelp = useCallback(() => {
    isHelpVisibleRef.current = !isHelpVisibleRef.current;
  }, []);

  // Obtener atajos por categoría
  const getShortcutsByCategory = useCallback((category: KeyboardShortcut['category']) => {
    return shortcutsRef.current.filter(shortcut => shortcut.category === category);
  }, []);

  // Obtener todos los atajos
  const getAllShortcuts = useCallback(() => {
    return shortcutsRef.current;
  }, []);

  // Formatear descripción del atajo
  const formatShortcut = useCallback((shortcut: KeyboardShortcut) => {
    const parts = [];
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.metaKey) parts.push('Cmd');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  }, []);

  // Configurar event listener
  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);

  return {
    registerShortcut,
    unregisterShortcut,
    toggleHelp,
    getShortcutsByCategory,
    getAllShortcuts,
    formatShortcut,
    isHelpVisible: isHelpVisibleRef.current
  };
}

// Hook específico para trainers con atajos predefinidos
export function useTrainerKeyboardShortcuts() {
  const shortcuts = useKeyboardShortcuts({ enabled: true });

  // Atajos predefinidos para trainers
  const setupTrainerShortcuts = useCallback((actions: {
    navigateToStudents: () => void;
    navigateToRoutines: () => void;
    navigateToCalendar: () => void;
    navigateToAnalytics: () => void;
    navigateToMessages: () => void;
    createStudent: () => void;
    createRoutine: () => void;
    createSession: () => void;
    search: () => void;
    toggleNotifications: () => void;
    toggleHelp: () => void;
  }) => {
    // Navegación
    shortcuts.registerShortcut({
      key: '1',
      ctrlKey: true,
      action: actions.navigateToStudents,
      description: 'Ir a Alumnos',
      category: 'navigation'
    });

    shortcuts.registerShortcut({
      key: '2',
      ctrlKey: true,
      action: actions.navigateToRoutines,
      description: 'Ir a Rutinas',
      category: 'navigation'
    });

    shortcuts.registerShortcut({
      key: '3',
      ctrlKey: true,
      action: actions.navigateToCalendar,
      description: 'Ir a Calendario',
      category: 'navigation'
    });

    shortcuts.registerShortcut({
      key: '4',
      ctrlKey: true,
      action: actions.navigateToAnalytics,
      description: 'Ir a Analíticas',
      category: 'navigation'
    });

    shortcuts.registerShortcut({
      key: '5',
      ctrlKey: true,
      action: actions.navigateToMessages,
      description: 'Ir a Mensajes',
      category: 'navigation'
    });

    // Creación
    shortcuts.registerShortcut({
      key: 'n',
      ctrlKey: true,
      shiftKey: true,
      action: actions.createStudent,
      description: 'Nuevo Alumno',
      category: 'creation'
    });

    shortcuts.registerShortcut({
      key: 'r',
      ctrlKey: true,
      shiftKey: true,
      action: actions.createRoutine,
      description: 'Nueva Rutina',
      category: 'creation'
    });

    shortcuts.registerShortcut({
      key: 's',
      ctrlKey: true,
      shiftKey: true,
      action: actions.createSession,
      description: 'Nueva Sesión',
      category: 'creation'
    });

    // Acciones rápidas
    shortcuts.registerShortcut({
      key: '/',
      action: actions.search,
      description: 'Buscar',
      category: 'search'
    });

    shortcuts.registerShortcut({
      key: 'n',
      ctrlKey: true,
      action: actions.toggleNotifications,
      description: 'Notificaciones',
      category: 'actions'
    });

    shortcuts.registerShortcut({
      key: '?',
      action: actions.toggleHelp,
      description: 'Mostrar Ayuda',
      category: 'help'
    });

    // Atajos adicionales
    shortcuts.registerShortcut({
      key: 'h',
      ctrlKey: true,
      action: () => window.location.href = '/trainer/dashboard',
      description: 'Inicio',
      category: 'navigation'
    });

    shortcuts.registerShortcut({
      key: 'Escape',
      action: () => {
        // Cerrar modales o panels abiertos
        const modals = document.querySelectorAll('[role="dialog"]');
        if (modals.length > 0) {
          (modals[modals.length - 1] as HTMLElement).click();
        }
      },
      description: 'Cerrar Modal',
      category: 'actions'
    });

  }, [shortcuts]);

  return {
    ...shortcuts,
    setupTrainerShortcuts
  };
}

// Hook para detección de teclas modificadoras
export function useModifierKeys() {
  const [modifiers, setModifiers] = useState({
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setModifiers(prev => ({
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey
      }));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setModifiers(prev => ({
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return modifiers;
}
