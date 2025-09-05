import axios from 'axios';

// API client configuration - connects to Weather-Forcasting backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

console.log('🔗 Connecting to Weather API at:', API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for weather calculations
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for authentication and logging
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API calls in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        // Uncomment if you have a login page
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Weather API types based on Weather-Forcasting backend
export interface WeatherLocation {
  city: string;
  country: string;
  coordinates: [number, number]; // [latitude, longitude]
  region?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number; // Celsius
  humidity: number; // Percentage
  pressure: number; // hPa
  wind_speed: number; // m/s
  wind_direction?: number; // degrees
  conditions: string;
  description?: string;
  icon?: string;
  visibility?: number; // km
  uv_index?: number;
  feels_like?: number; // Celsius
}

export interface WeatherForecast {
  date: string; // ISO date string
  high: number; // Celsius
  low: number; // Celsius
  conditions: string;
  precipitation_chance: number; // Percentage
  precipitation_mm?: number;
  humidity?: number;
  wind_speed?: number;
  icon?: string;
  description?: string;
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  forecast?: WeatherForecast[];
  last_updated: string;
  source?: string;
  model_version?: string;
}

export interface WeatherAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  start_time: string;
  end_time?: string;
  area?: string;
}

export interface WeatherStats {
  location: string;
  period: string;
  avg_temperature: number;
  min_temperature: number;
  max_temperature: number;
  avg_humidity: number;
  total_precipitation: number;
  dominant_conditions: string[];
}

// Weather API functions - matches Weather-Forcasting backend endpoints
export const weatherApi = {
  // Health check - verify backend connection
  healthCheck: async (): Promise<{ status: string; timestamp: string; version?: string }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Get current weather for a location
  getCurrentWeather: async (location: string): Promise<WeatherResponse> => {
    const response = await apiClient.get(`/weather/current`, {
      params: { location }
    });
    return response.data;
  },

  // Get weather forecast (1-7 days)
  getForecast: async (location: string, days: number = 7): Promise<WeatherResponse> => {
    const response = await apiClient.get(`/weather/forecast`, {
      params: { location, days }
    });
    return response.data;
  },

  // Get historical weather data
  getHistoricalWeather: async (location: string, date: string): Promise<WeatherResponse> => {
    const response = await apiClient.get(`/weather/history`, {
      params: { location, date }
    });
    return response.data;
  },

  // Get weather alerts for a location
  getWeatherAlerts: async (location: string): Promise<WeatherAlert[]> => {
    const response = await apiClient.get(`/weather/alerts`, {
      params: { location }
    });
    return response.data;
  },

  // Search locations (if backend supports it)
  searchLocations: async (query: string): Promise<WeatherLocation[]> => {
    try {
      const response = await apiClient.get('/weather/search', {
        params: { q: query, limit: 10 }
      });
      return response.data;
    } catch (error) {
      // Fallback to empty array if search not implemented
      console.warn('Location search not available:', error);
      return [];
    }
  },

  // Get weather statistics for a period
  getWeatherStats: async (location: string, period: string = '30d'): Promise<WeatherStats> => {
    const response = await apiClient.get(`/weather/stats`, {
      params: { location, period }
    });
    return response.data;
  },

  // Run weather calculations (if backend exposes Calculator.py functions)
  runCalculation: async (data: any): Promise<any> => {
    try {
      const response = await apiClient.post('/weather/calculate', data);
      return response.data;
    } catch (error) {
      console.warn('Weather calculation endpoint not available:', error);
      throw error;
    }
  }
};

// React Query hooks for efficient data management
export const weatherQueries = {
  // Current weather query
  currentWeather: (location: string) => ({
    queryKey: ['weather', 'current', location],
    queryFn: () => weatherApi.getCurrentWeather(location),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  }),

  // Weather forecast query
  forecast: (location: string, days: number = 7) => ({
    queryKey: ['weather', 'forecast', location, days],
    queryFn: () => weatherApi.getForecast(location, days),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
  }),

  // Weather alerts query
  alerts: (location: string) => ({
    queryKey: ['weather', 'alerts', location],
    queryFn: () => weatherApi.getWeatherAlerts(location),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  }),

  // Historical weather query
  historical: (location: string, date: string) => ({
    queryKey: ['weather', 'historical', location, date],
    queryFn: () => weatherApi.getHistoricalWeather(location, date),
    staleTime: 60 * 60 * 1000, // 1 hour (historical data doesn't change)
    retry: 2,
  }),

  // Weather statistics query
  stats: (location: string, period: string) => ({
    queryKey: ['weather', 'stats', location, period],
    queryFn: () => weatherApi.getWeatherStats(location, period),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  }),
};

// Utility function to check if backend is accessible
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    await weatherApi.healthCheck();
    console.log('✅ Backend connection successful');
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
};

export default apiClient;