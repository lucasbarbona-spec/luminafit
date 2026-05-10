'use client';

import React from 'react';
import { useTheme } from '@/lib/hooks/useTheme';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  const getIcon = () => {
    if (theme === 'system') return Monitor;
    return isDark ? Sun : Moon;
  };

  const getLabel = () => {
    if (theme === 'system') return 'Sistema';
    return isDark ? 'Claro' : 'Oscuro';
  };

  const Icon = getIcon();

  return React.createElement(
    'button',
    {
      onClick: toggleTheme,
      className: 'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
      title: `Tema: ${getLabel()}`,
      'aria-label': `Cambiar tema (actual: ${getLabel()})`
    },
    React.createElement(Icon, { className: 'w-5 h-5 text-gray-600 dark:text-gray-400' })
  );
};
