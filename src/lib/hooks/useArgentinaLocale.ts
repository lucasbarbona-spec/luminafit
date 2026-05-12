'use client';

import { useState, useEffect } from 'react';
import ArgentinaConfig from '@/lib/config/argentina';
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatLongDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  calculatePriceWithTaxes,
  formatPhoneNumber,
  validateCuilCuit,
  formatCuilCuit,
  getProvinceName,
  isWorkingDay,
  isWorkingHours,
  getArgentinaTimezone,
  toArgentinaTimezone,
} from '@/lib/utils/format-argentina';

export interface UseArgentinaLocaleReturn {
  // Configuración
  config: typeof ArgentinaConfig;
  
  // Formateo de moneda y números
  formatCurrency: (amount: number) => string;
  formatNumber: (number: number, decimals?: number) => string;
  
  // Formateo de fechas
  formatDate: (date: Date | string) => string;
  formatLongDate: (date: Date | string) => string;
  formatTime: (date: Date | string) => string;
  formatDateTime: (date: Date | string) => string;
  formatRelativeTime: (date: Date | string) => string;
  
  // Cálculos de impuestos
  calculatePriceWithTaxes: (basePrice: number) => {
    basePrice: number;
    iva: number;
    ganancias: number;
    ingresosBrutos: number;
    totalTaxes: number;
    finalPrice: number;
  };
  
  // Utilidades argentinas
  formatPhoneNumber: (phone: string) => string;
  validateCuilCuit: (cuilCuit: string) => boolean;
  formatCuilCuit: (cuilCuit: string) => string;
  getProvinceName: (provinceCode: string) => string;
  
  // Horario laboral
  isWorkingDay: (date: Date) => boolean;
  isWorkingHours: (date: Date) => boolean;
  
  // Zona horaria
  getArgentinaTimezone: () => string;
  toArgentinaTimezone: (date: Date) => Date;
  
  // Estado actual
  currentTime: Date;
  currentTimezone: string;
  isCurrentlyWorkingHours: boolean;
}

export function useArgentinaLocale(): UseArgentinaLocaleReturn {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [currentTimezone, setCurrentTimezone] = useState<string>(getArgentinaTimezone());
  const [isCurrentlyWorkingHours, setIsCurrentlyWorkingHours] = useState<boolean>(false);

  // Actualizar tiempo cada segundo (solo en el cliente)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateTimer = () => {
      try {
        const now = new Date();
        const argentinaTime = toArgentinaTimezone(now);
        
        setCurrentTime(prevTime => {
          // Solo actualizar si realmente cambió el tiempo
          if (prevTime.getTime() !== argentinaTime.getTime()) {
            return argentinaTime;
          }
          return prevTime;
        });
        
        setIsCurrentlyWorkingHours(
          isWorkingDay(argentinaTime) && isWorkingHours(argentinaTime)
        );
      } catch (error) {
        console.warn('Error updating timer:', error);
      }
    };

    // Actualizar inmediatamente
    updateTimer();

    // Configurar intervalo para actualizar cada segundo
    const interval = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    config: ArgentinaConfig,
    
    // Formateo de moneda y números
    formatCurrency,
    formatNumber,
    
    // Formateo de fechas
    formatDate,
    formatLongDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
    
    // Cálculos de impuestos
    calculatePriceWithTaxes,
    
    // Utilidades argentinas
    formatPhoneNumber,
    validateCuilCuit,
    formatCuilCuit,
    getProvinceName,
    
    // Horario laboral
    isWorkingDay,
    isWorkingHours,
    
    // Zona horaria
    getArgentinaTimezone,
    toArgentinaTimezone,
    
    // Estado actual
    currentTime,
    currentTimezone,
    isCurrentlyWorkingHours,
  };
}

export default useArgentinaLocale;
