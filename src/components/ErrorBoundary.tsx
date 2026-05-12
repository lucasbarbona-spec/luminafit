'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error para debugging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    }

    // Aquí podrías enviar el error a un servicio de monitoreo como Sentry
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  private renderErrorUI() {
    const { error, errorInfo } = this.state;
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-error-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Algo salió mal
            </h1>
            
            <p className="text-gray-600 mb-6">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </p>

            {process.env.NODE_ENV === 'development' && error && (
              <div className="w-full bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Detalles del error (desarrollo):
                </p>
                <p className="text-xs text-error-600 font-mono break-all">
                  {error.toString()}
                </p>
                {errorInfo && (
                  <p className="text-xs text-gray-500 mt-2 font-mono break-all">
                    {errorInfo.componentStack}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderErrorUI();
    }

    return this.props.children;
  }
}

// Hook simplificado para errores asíncronos en componentes funcionales
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}
