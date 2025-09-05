// Shared calculations utilities across all workspace modules
// Common mathematical and utility functions used by multiple backends

export interface MathUtils {
  round: (value: number, decimals: number) => number;
  clamp: (value: number, min: number, max: number) => number;
  normalize: (value: number, min: number, max: number) => number;
  interpolate: (start: number, end: number, factor: number) => number;
}

export interface StatisticalUtils {
  mean: (values: number[]) => number;
  median: (values: number[]) => number;
  standardDeviation: (values: number[]) => number;
  percentile: (values: number[], p: number) => number;
  correlation: (x: number[], y: number[]) => number;
}

export interface ValidationUtils {
  isValidNumber: (value: any) => boolean;
  isValidDate: (value: any) => boolean;
  isValidEmail: (value: string) => boolean;
  isValidUrl: (value: string) => boolean;
}

// Mathematical utilities
export const mathUtils: MathUtils = {
  round: (value: number, decimals: number = 2): number => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  clamp: (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  },

  normalize: (value: number, min: number, max: number): number => {
    return (value - min) / (max - min);
  },

  interpolate: (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  }
};

// Statistical utilities
export const statisticalUtils: StatisticalUtils = {
  mean: (values: number[]): number => {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  },

  median: (values: number[]): number => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  },

  standardDeviation: (values: number[]): number => {
    if (values.length === 0) return 0;
    const mean = statisticalUtils.mean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return Math.sqrt(statisticalUtils.mean(squaredDiffs));
  },

  percentile: (values: number[], p: number): number => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  },

  correlation: (x: number[], y: number[]): number => {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const meanX = statisticalUtils.mean(x);
    const meanY = statisticalUtils.mean(y);
    
    let numerator = 0;
    let sumXSquared = 0;
    let sumYSquared = 0;
    
    for (let i = 0; i < x.length; i++) {
      const deltaX = x[i] - meanX;
      const deltaY = y[i] - meanY;
      numerator += deltaX * deltaY;
      sumXSquared += deltaX * deltaX;
      sumYSquared += deltaY * deltaY;
    }
    
    const denominator = Math.sqrt(sumXSquared * sumYSquared);
    return denominator === 0 ? 0 : numerator / denominator;
  }
};

// Validation utilities
export const validationUtils: ValidationUtils = {
  isValidNumber: (value: any): boolean => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  },

  isValidDate: (value: any): boolean => {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  },

  isValidEmail: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  isValidUrl: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
};

// Data transformation utilities
export const dataUtils = {
  // Convert array of objects to CSV format
  arrayToCSV: (data: any[]): string => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => 
        typeof row[header] === 'string' && row[header].includes(',') 
          ? `"${row[header]}"` 
          : row[header]
      ).join(','))
    ].join('\n');
    
    return csvContent;
  },

  // Parse CSV string to array of objects
  csvToArray: (csv: string): any[] => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {} as any);
    });
  },

  // Deep clone object
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  },

  // Merge objects deeply
  deepMerge: (target: any, source: any): any => {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = dataUtils.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  },

  // Group array by key
  groupBy: <T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }
};

// Export all utilities
export { mathUtils, statisticalUtils, validationUtils, dataUtils };