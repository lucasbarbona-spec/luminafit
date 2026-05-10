/**
 * Utilidades de validación para formularios
 * Proporciona validaciones reutilizables para inputs de usuario
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Validación de email
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'El email es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'El email no es válido' };
  }

  return { isValid: true };
}

// Validación de contraseña
export function validatePassword(password: string): ValidationResult {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'La contraseña es requerida' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  // Validación opcional para contraseña fuerte
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (strengthScore < 2) {
    return { 
      isValid: true, 
      error: 'La contraseña es débil. Considera usar mayúsculas, números y caracteres especiales' 
    };
  }

  return { isValid: true };
}

// Validación de nombre
export function validateName(name: string, fieldName: string = 'nombre'): ValidationResult {
  if (!name || name.trim() === '') {
    return { isValid: false, error: `El ${fieldName} es requerido` };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: `El ${fieldName} debe tener al menos 2 caracteres` };
  }

  if (name.trim().length > 50) {
    return { isValid: false, error: `El ${fieldName} no puede exceder 50 caracteres` };
  }

  return { isValid: true };
}

// Validación de teléfono
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim() === '') {
    return { isValid: true }; // Teléfono opcional
  }

  // Eliminar espacios y caracteres especiales
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Validar formato internacional (mínimo 10 dígitos)
  const phoneRegex = /^\+?[\d]{10,15}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'El número de teléfono no es válido' };
  }

  return { isValid: true };
}

// Validación de fecha
export function validateDate(date: string | Date): ValidationResult {
  if (!date) {
    return { isValid: false, error: 'La fecha es requerida' };
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'La fecha no es válida' };
  }

  // Validar que no sea una fecha futura (para fechas de nacimiento, etc.)
  if (dateObj > new Date()) {
    return { isValid: false, error: 'La fecha no puede ser futura' };
  }

  return { isValid: true };
}

// Validación de número positivo
export function validatePositiveNumber(value: number | string, fieldName: string = 'valor'): ValidationResult {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} debe ser un número válido` };
  }

  if (numValue < 0) {
    return { isValid: false, error: `${fieldName} debe ser positivo` };
  }

  return { isValid: true };
}

// Validación de URL
export function validateUrl(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return { isValid: true }; // URL opcional
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'La URL no es válida' };
  }
}

// Validación de formulario completo
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateForm(formData: Record<string, unknown>, rules: Record<string, (value: unknown) => ValidationResult>): FormValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const validation = rules[field](formData[field]);
    if (!validation.isValid) {
      errors[field] = validation.error || 'Valor inválido';
      isValid = false;
    }
  });

  return { isValid, errors };
}
