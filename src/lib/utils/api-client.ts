/**
 * Cliente API con manejo de errores integrado
 * Proporciona una interfaz consistente para llamadas a API
 */

import { ErrorHandler } from './error-handler';

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  ok: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number = 10000;
  private defaultRetries: number = 3;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_BASE_URL || '';
  }

  /**
   * Realiza una llamada a la API con manejo de errores
   */
  async request<T = any>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = this.defaultRetries
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    };

    let lastError: Error | null = null;

    // Reintentos
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Error desconocido');
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json().catch(() => null);

        return {
          data,
          status: response.status,
          ok: true
        };

      } catch (error) {
        lastError = error as Error;
        
        // No reintentar en ciertos errores
        if (error instanceof Error && (
          error.message.includes('400') ||
          error.message.includes('401') ||
          error.message.includes('403') ||
          error.message.includes('404')
        )) {
          break;
        }

        // Esperar antes de reintentar
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // Manejar error final
    const appError = ErrorHandler.network(
      lastError?.message || 'Error de conexión',
      url
    );

    return {
      error: appError.message,
      status: 0,
      ok: false
    };
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any, options?: Omit<ApiOptions, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: data });
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any, options?: Omit<ApiOptions, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: data });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, options?: Omit<ApiOptions, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: data });
  }
}

// Instancia por defecto
export const apiClient = new ApiClient();

// Hook para React
export function useApiClient() {
  return {
    get: apiClient.get.bind(apiClient),
    post: apiClient.post.bind(apiClient),
    put: apiClient.put.bind(apiClient),
    delete: apiClient.delete.bind(apiClient),
    patch: apiClient.patch.bind(apiClient),
    request: apiClient.request.bind(apiClient)
  };
}

export default apiClient;
