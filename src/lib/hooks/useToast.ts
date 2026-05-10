'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { Toast } from '@/components/ui/Toast';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev: ToastMessage[]) => [...prev, newToast]);
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev: ToastMessage[]) => prev.filter((toast: ToastMessage) => toast.id !== id));
  };

  return React.createElement(
    ToastContext.Provider,
    { value: { showToast, removeToast } },
    children,
    React.createElement('div', { key: 'toast-container', className: 'fixed top-4 right-4 z-50 space-y-2' },
      toasts.map((toast: ToastMessage) =>
        React.createElement(Toast, {
          key: toast.id,
          ...toast,
          onClose: () => removeToast(toast.id)
        })
      )
    )
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
