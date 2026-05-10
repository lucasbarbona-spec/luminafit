/**
 * Sistema centralizado de manejo de errores
 * Proporciona utilidades para manejar errores de manera consistente
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  stack?: string;
}

export class ErrorHandler {
  private static errors: AppError[] = [];

  /**
   * Maneja un error y lo registra
   */
  static handle(error: Error | AppError, context?: string): AppError {
    const appError: AppError = {
      code: this.extractErrorCode(error),
      message: error.message || 'Error desconocido',
      details: context,
      timestamp: new Date(),
      stack: error.stack
    };

    // Registrar error
    this.errors.push(appError);

    // En desarrollo, mostrar en consola
    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 Error capturado:', appError);
    }

    // En producción, enviar a servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(appError);
    }

    return appError;
  }

  /**
   * Crea un error de validación
   */
  static validation(message: string, field?: string): AppError {
    return this.handle(new Error(message), `Validación${field ? ` - ${field}` : ''}`);
  }

  /**
   * Crea un error de red
   */
  static network(message: string, url?: string): AppError {
    return this.handle(new Error(message), `Red${url ? ` - ${url}` : ''}`);
  }

  /**
   * Crea un error de autenticación
   */
  static auth(message: string): AppError {
    return this.handle(new Error(message), 'Autenticación');
  }

  /**
   * Crea un error de base de datos
   */
  static database(message: string, operation?: string): AppError {
    return this.handle(new Error(message), `Base de datos${operation ? ` - ${operation}` : ''}`);
  }

  /**
   * Obtiene errores recientes
   */
  static getRecentErrors(limit: number = 10): AppError[] {
    return this.errors.slice(-limit);
  }

  /**
   * Limpia el registro de errores
   */
  static clearErrors(): void {
    this.errors = [];
  }

  /**
   * Extrae el código de error
   */
  private static extractErrorCode(error: Error | AppError): string {
    if ('code' in error) return error.code;
    
    // Errores comunes de Firebase
    if (error.message.includes('auth/')) {
      return error.message.split('/')[0].replace('auth/', '');
    }
    
    // Errores de red
    if (error.message.includes('fetch')) return 'NETWORK_ERROR';
    if (error.message.includes('timeout')) return 'TIMEOUT_ERROR';
    
    // Errores de validación
    if (error.message.includes('required') || error.message.includes('invalid')) {
      return 'VALIDATION_ERROR';
    }
    
    return 'UNKNOWN_ERROR';
  }

  /**
   * Envía errores a servicio de monitoreo (placeholder)
   */
  private static sendToMonitoring(error: AppError): void {
    // Aquí se integraría con servicios como Sentry, LogRocket, etc.
    // Por ahora, solo guardamos en localStorage para debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      existingErrors.push(error);
      
      // Mantener solo los últimos 100 errores
      if (existingErrors.length > 100) {
        existingErrors.splice(0, existingErrors.length - 100);
      }
      
      localStorage.setItem('app_errors', JSON.stringify(existingErrors));
    } catch (e) {
      // Silenciar errores de localStorage
    }
  }
}

/**
 * Hook de React para manejo de errores
 */
export function useErrorHandler() {
  const handleError = (error: Error | AppError, context?: string) => {
    return ErrorHandler.handle(error, context);
  };

  const getRecentErrors = (limit?: number) => {
    return ErrorHandler.getRecentErrors(limit);
  };

  const clearErrors = () => {
    ErrorHandler.clearErrors();
  };

  return {
    handleError,
    getRecentErrors,
    clearErrors,
    validation: ErrorHandler.validation,
    network: ErrorHandler.network,
    auth: ErrorHandler.auth,
    database: ErrorHandler.database
  };
}

export default ErrorHandler;
