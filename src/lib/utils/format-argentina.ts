import ArgentinaConfig from '@/lib/config/argentina';

// Formatear moneda en pesos argentinos
export const formatCurrency = (amount: number): string => {
  const { currency } = ArgentinaConfig;
  
  // Formatear el número con separadores argentinos
  const formattedNumber = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: currency.decimalDigits,
    maximumFractionDigits: currency.decimalDigits,
  }).format(amount);
  
  // Agregar el símbolo de moneda
  if (currency.symbolPosition === 'before') {
    return `${currency.symbol}${formattedNumber}`;
  } else {
    return `${formattedNumber}${currency.symbol}`;
  }
};

// Formatear número con separadores argentinos
export const formatNumber = (number: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

// Formatear fecha en formato argentino
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: ArgentinaConfig.country.timezone,
  }).format(dateObj);
};

// Formatear fecha larga en español argentino
export const formatLongDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: ArgentinaConfig.country.timezone,
  }).format(dateObj);
};

// Formatear hora en formato argentino
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: ArgentinaConfig.country.timezone,
  }).format(dateObj);
};

// Formatear fecha y hora completas
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: ArgentinaConfig.country.timezone,
  }).format(dateObj);
};

// Formatear fecha relativa (hace X tiempo)
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'ahora';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `hace ${days} día${days !== 1 ? 's' : ''}`;
  } else if (diffInSeconds < 2419200) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `hace ${weeks} semana${weeks !== 1 ? 's' : ''}`;
  } else if (diffInSeconds < 29030400) {
    const months = Math.floor(diffInSeconds / 2419200);
    return `hace ${months} mes${months !== 1 ? 'es' : ''}`;
  } else {
    const years = Math.floor(diffInSeconds / 29030400);
    return `hace ${years} año${years !== 1 ? 's' : ''}`;
  }
};

// Calcular precio con impuestos argentinos
export const calculatePriceWithTaxes = (basePrice: number): {
  basePrice: number;
  iva: number;
  ganancias: number;
  ingresosBrutos: number;
  totalTaxes: number;
  finalPrice: number;
} => {
  const { taxes } = ArgentinaConfig;
  
  const iva = basePrice * taxes.iva.rate;
  const ganancias = basePrice * taxes.ganancias.rate;
  const ingresosBrutos = basePrice * taxes.ingresosBrutos.rate;
  const totalTaxes = iva + ganancias + ingresosBrutos;
  const finalPrice = basePrice + totalTaxes;
  
  return {
    basePrice,
    iva,
    ganancias,
    ingresosBrutos,
    totalTaxes,
    finalPrice,
  };
};

// Formatear teléfono argentino
export const formatPhoneNumber = (phone: string): string => {
  // Eliminar todos los caracteres no numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Formato argentino: +54 9 11 1234-5678 (móvil) o +54 11 1234-5678 (fijo)
  if (cleanPhone.length === 10) {
    // Formato: 011 1234-5678
    const areaCode = cleanPhone.substring(0, 3);
    const firstPart = cleanPhone.substring(3, 7);
    const secondPart = cleanPhone.substring(7);
    return `0${areaCode} ${firstPart}-${secondPart}`;
  } else if (cleanPhone.length === 11) {
    // Formato: 011 1234-5678 (con 15 al principio)
    const areaCode = cleanPhone.substring(1, 4);
    const firstPart = cleanPhone.substring(4, 8);
    const secondPart = cleanPhone.substring(8);
    return `0${areaCode} ${firstPart}-${secondPart}`;
  } else if (cleanPhone.length === 12) {
    // Formato: +54 9 11 1234-5678
    const countryCode = cleanPhone.substring(0, 2);
    const mobilePrefix = cleanPhone.substring(2, 3);
    const areaCode = cleanPhone.substring(3, 5);
    const firstPart = cleanPhone.substring(5, 9);
    const secondPart = cleanPhone.substring(9);
    return `+${countryCode} ${mobilePrefix} ${areaCode} ${firstPart}-${secondPart}`;
  }
  
  return phone; // Devolver original si no coincide con formatos conocidos
};

// Validar CUIL/CUIT argentino
export const validateCuilCuit = (cuilCuit: string): boolean => {
  // Formato: XX-XXXXXXXX-X o XXXXXXXXXXX
  const cleanCuilCuit = cuilCuit.replace(/[-\s]/g, '');
  
  if (cleanCuilCuit.length !== 11) {
    return false;
  }
  
  // Algoritmo de validación de CUIL/CUIT
  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let total = 0;
  
  for (let i = 0; i < 10; i++) {
    total += parseInt(cleanCuilCuit[i]) * multipliers[i];
  }
  
  const remainder = total % 11;
  let checkDigit = 11 - remainder;
  
  if (checkDigit === 11) {
    checkDigit = 0;
  } else if (checkDigit === 10) {
    checkDigit = 9;
  }
  
  return checkDigit === parseInt(cleanCuilCuit[10]);
};

// Formatear CUIL/CUIT
export const formatCuilCuit = (cuilCuit: string): string => {
  const cleanCuilCuit = cuilCuit.replace(/[-\s]/g, '');
  
  if (cleanCuilCuit.length === 11) {
    return `${cleanCuilCuit.substring(0, 2)}-${cleanCuilCuit.substring(2, 10)}-${cleanCuilCuit.substring(10)}`;
  }
  
  return cuilCuit;
};

// Obtener nombre de provincia por código
export const getProvinceName = (provinceCode: string): string => {
  const { regional } = ArgentinaConfig;
  return regional.provinces.find(province => 
    province.toLowerCase() === provinceCode.toLowerCase()
  ) || provinceCode;
};

// Verificar si es día hábil en Argentina
export const isWorkingDay = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  const { regional } = ArgentinaConfig;
  
  return regional.workingDays.includes(dayOfWeek);
};

// Verificar si es horario laboral en Argentina
export const isWorkingHours = (date: Date): boolean => {
  const { regional } = ArgentinaConfig;
  const hour = date.getHours();
  const startHour = parseInt(regional.workingHours.start.split(':')[0]);
  const endHour = parseInt(regional.workingHours.end.split(':')[0]);
  
  return hour >= startHour && hour <= endHour;
};

// Obtener zona horaria de Argentina
export const getArgentinaTimezone = (): string => {
  return ArgentinaConfig.country.timezone;
};

// Convertir fecha a zona horaria de Argentina
export const toArgentinaTimezone = (date: Date): Date => {
  return new Date(date.toLocaleString('en-US', { 
    timeZone: ArgentinaConfig.country.timezone 
  }));
};

const argentinaUtils = {
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
};

export default argentinaUtils;
