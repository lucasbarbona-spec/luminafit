/**
 * Utilidades de optimización de rendimiento
 * Proporciona herramientas para mejorar el rendimiento de la aplicación
 */

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  timestamp: number;
}

class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = [];
  private static observers: PerformanceObserver[] = [];

  /**
   * Inicia el monitoreo de rendimiento
   */
  static startMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitorear navegación
    this.observeNavigation();

    // Monitorear recursos
    this.observeResources();

    // Monitorear medidas personalizadas
    this.observeMeasures();
  }

  /**
   * Detiene el monitoreo
   */
  static stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  /**
   * Registra una métrica personalizada
   */
  static mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  }

  /**
   * Mide el tiempo entre dos marcas
   */
  static measure(name: string, startMark: string, endMark?: string): number {
    if (typeof window === 'undefined' || !window.performance) return 0;

    try {
      window.performance.measure(name, startMark, endMark);
      const measure = window.performance.getEntriesByName(name, 'measure')[0];
      return measure ? measure.duration : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Obtiene métricas de rendimiento
   */
  static getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Limpia métricas antiguas
   */
  static clearMetrics(): void {
    this.metrics = [];
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    }
  }

  /**
   * Obtiene información de memoria (Chrome)
   */
  static getMemoryUsage(): number | null {
    if (typeof window !== 'undefined' && 'memory' in window.performance) {
      return (window.performance as any).memory.usedJSHeapSize;
    }
    return null;
  }

  /**
   * Optimiza la carga de imágenes
   */
  static optimizeImageLoading(): void {
    if (typeof window === 'undefined') return;

    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Preload de recursos críticos
   */
  static preloadResource(href: string, as: string): void {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }

  /**
   * Observa eventos de navegación
   */
  private static observeNavigation(): void {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          const metrics: PerformanceMetrics = {
            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            renderTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            timestamp: Date.now()
          };
          this.metrics.push(metrics);
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.push(observer);
  }

  /**
   * Observa carga de recursos
   */
  private static observeResources(): void {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          console.log(`Resource loaded: ${resource.name} - ${resource.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  /**
   * Observa medidas personalizadas
   */
  private static observeMeasures(): void {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
          console.log(`Measure: ${entry.name} - ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });
    this.observers.push(observer);
  }
}

/**
 * Hook de React para optimización de componentes
 */
export function usePerformanceOptimization() {
  const startTiming = (name: string) => {
    PerformanceMonitor.mark(`${name}-start`);
  };

  const endTiming = (name: string): number => {
    const endMark = `${name}-end`;
    PerformanceMonitor.mark(endMark);
    return PerformanceMonitor.measure(name, `${name}-start`, endMark);
  };

  const getMemoryUsage = () => {
    return PerformanceMonitor.getMemoryUsage();
  };

  const preloadImage = (src: string) => {
    PerformanceMonitor.preloadResource(src, 'image');
  };

  return {
    startTiming,
    endTiming,
    getMemoryUsage,
    preloadImage,
    getMetrics: PerformanceMonitor.getMetrics.bind(PerformanceMonitor),
    clearMetrics: PerformanceMonitor.clearMetrics.bind(PerformanceMonitor)
  };
}

/**
 * Utilidades de debounce y throttle
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Memoización simple
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export default PerformanceMonitor;
