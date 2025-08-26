// Performance monitoring and optimization tools

import * as React from 'react';

// Performance metrics collector
class PerformanceCollector {
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initObservers();
  }

  private initObservers() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        }
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // longtask may not be supported
      }

      // Monitor layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).value > 0.1) {
            console.warn(`Layout shift detected: ${(entry as any).value}`);
          }
        }
      });

      try {
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (e) {
        // layout-shift may not be supported
      }
    }
  }

  // Record performance metrics
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  // Get performance statistics
  getStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p90: sorted[Math.floor(sorted.length * 0.9)],
      p95: sorted[Math.floor(sorted.length * 0.95)]
    };
  }

  // Cleanup resources
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.metrics.clear();
  }
}

export const performanceCollector = new PerformanceCollector();

// Performance timer
export class PerformanceTimer {
  private startTime: number;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
  }

  end(): number {
    const duration = performance.now() - this.startTime;
    performanceCollector.recordMetric(this.name, duration);
    return duration;
  }
}

// Performance decorator
export function measurePerformance(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const timer = new PerformanceTimer(`${name}.${propertyKey}`);
      try {
        const result = originalMethod.apply(this, args);
        
        if (result instanceof Promise) {
          return result.finally(() => timer.end());
        } else {
          timer.end();
          return result;
        }
      } catch (error) {
        timer.end();
        throw error;
      }
    };

    return descriptor;
  };
}

// Memory usage monitoring
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    };
  }
  return null;
}

// FPS monitoring
export class FPSMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;
  private running = false;

  start() {
    this.running = true;
    this.tick();
  }

  stop() {
    this.running = false;
  }

  private tick = () => {
    if (!this.running) return;

    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      if (this.fps < 30) {
        console.warn(`Low FPS detected: ${this.fps}`);
      }
    }

    requestAnimationFrame(this.tick);
  };

  getFPS(): number {
    return this.fps;
  }
}

// Resource loading monitoring
export function monitorResourceLoading() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        
        // Check for slow resources
        if (resource.duration > 1000) {
          console.warn(`Slow resource: ${resource.name} took ${resource.duration}ms`);
        }
        
        // Check for large resources
        if (resource.transferSize > 1024 * 1024) { // 1MB
          console.warn(`Large resource: ${resource.name} is ${Math.round(resource.transferSize / 1024)}KB`);
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
    return observer;
  }
  return null;
}

// Code splitting and lazy loading tools
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFunc);

  const LazyWrapper = (props: React.ComponentProps<T>) => {
    return React.createElement(
      React.Suspense,
      { fallback: fallback ? React.createElement(fallback) : React.createElement('div', null, 'Loading...') },
      React.createElement(LazyComponent, props)
    );
  };

  return LazyWrapper;
}

// Image preloading manager
export class ImagePreloader {
  private cache = new Set<string>();
  private loading = new Set<string>();

  async preload(src: string): Promise<void> {
    if (this.cache.has(src) || this.loading.has(src)) {
      return;
    }

    this.loading.add(src);

    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
      });
      
      this.cache.add(src);
    } finally {
      this.loading.delete(src);
    }
  }

  async preloadBatch(srcs: string[], concurrency = 3): Promise<void> {
    const chunks = [];
    for (let i = 0; i < srcs.length; i += concurrency) {
      chunks.push(srcs.slice(i, i + concurrency));
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(src => this.preload(src)));
    }
  }

  isLoaded(src: string): boolean {
    return this.cache.has(src);
  }

  clear() {
    this.cache.clear();
    this.loading.clear();
  }
}

export const imagePreloader = new ImagePreloader();

// Web Workers tools
export function createWorker(workerFunction: Function): Worker {
  const blob = new Blob([`(${workerFunction.toString()})()`], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

// Performance report generator
export function generatePerformanceReport() {
  const report = {
    timestamp: new Date().toISOString(),
    memory: getMemoryUsage(),
    metrics: {} as Record<string, any>,
    navigation: performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming,
    resources: performance.getEntriesByType('resource').length
  };

  // Collect all performance metrics
  const metricNames = ['component-render', 'api-call', 'image-load'];
  metricNames.forEach(name => {
    const stats = performanceCollector.getStats(name);
    if (stats) {
      report.metrics[name] = stats;
    }
  });

  return report;
}

// Performance optimization recommendations
export function getPerformanceRecommendations() {
  const recommendations = [];
  const memory = getMemoryUsage();
  
  if (memory && memory.used > memory.limit * 0.8) {
    recommendations.push('Memory usage is high. Consider implementing virtual scrolling or pagination.');
  }

  const renderStats = performanceCollector.getStats('component-render');
  if (renderStats && renderStats.avg > 16) {
    recommendations.push('Component rendering is slow. Consider using React.memo or useMemo.');
  }

  const apiStats = performanceCollector.getStats('api-call');
  if (apiStats && apiStats.avg > 1000) {
    recommendations.push('API calls are slow. Consider implementing caching or request optimization.');
  }

  return recommendations;
}
