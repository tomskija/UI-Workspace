// Weather-specific API client
// Example of how to create module-specific API clients

import { apiManager, ApiResponse } from './manager';

// Weather API types (from Weather-Forcasting backend)
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

// Weather API client class
export class WeatherApiClient {
  private backendKey = 'weather';

  // Health check - verify backend connection
  async healthCheck(): Promise<ApiResponse> {
    return apiManager.healthCheck(this.backendKey);
  }

  // Get current weather for a location
  async getCurrentWeather(location: string): Promise<WeatherResponse> {
    const response = await apiManager.get<WeatherResponse>(
      this.backendKey,
      `/weather/current`,
      { params: { location } }
    );
    return response.data;
  }

  // Get weather forecast (1-7 days)
  async getForecast(location: string, days: number = 7): Promise<WeatherResponse> {
    const response = await apiManager.get<WeatherResponse>(
      this.backendKey,
      `/weather/forecast`,
      { params: { location, days } }
    );
    return response.data;
  }

  // Get historical weather data
  async getHistoricalWeather(location: string, date: string): Promise<WeatherResponse> {
    const response = await apiManager.get<WeatherResponse>(
      this.backendKey,
      `/weather/history`,
      { params: { location, date } }
    );
    return response.data;
  }

  // Get weather alerts for a location
  async getWeatherAlerts(location: string): Promise<WeatherAlert[]> {
    const response = await apiManager.get<WeatherAlert[]>(
      this.backendKey,
      `/weather/alerts`,
      { params: { location } }
    );
    return response.data;
  }

  // Search locations (if backend supports it)
  async searchLocations(query: string): Promise<WeatherLocation[]> {
    try {
      const response = await apiManager.get<WeatherLocation[]>(
        this.backendKey,
        '/weather/search',
        { params: { q: query, limit: 10 } }
      );
      return response.data;
    } catch (error) {
      // Fallback to empty array if search not implemented
      console.warn('Location search not available:', error);
      return [];
    }
  }

  // Get weather statistics for a period
  async getWeatherStats(location: string, period: string = '30d'): Promise<WeatherStats> {
    const response = await apiManager.get<WeatherStats>(
      this.backendKey,
      `/weather/stats`,
      { params: { location, period } }
    );
    return response.data;
  }

  // Run weather calculations (if backend exposes Calculator.py functions)
  async runCalculation(data: any): Promise<any> {
    const response = await apiManager.post(
      this.backendKey,
      '/weather/calculate',
      data
    );
    return response.data;
  }

  // Batch requests for multiple locations
  async getBatchWeather(locations: string[]): Promise<WeatherResponse[]> {
    const response = await apiManager.post<WeatherResponse[]>(
      this.backendKey,
      '/weather/batch',
      { locations }
    );
    return response.data;
  }

  // Subscribe to real-time weather updates (if supported)
  async subscribeToUpdates(location: string, callback: (data: WeatherResponse) => void): Promise<void> {
    // This would typically use WebSockets or Server-Sent Events
    console.log(`Subscribing to weather updates for ${location}`);
    // Implementation depends on backend support
  }
}

// React Query hooks for weather data
export const weatherQueries = {
  // Current weather query
  currentWeather: (location: string) => ({
    queryKey: ['weather', 'current', location],
    queryFn: () => weatherApi.getCurrentWeather(location),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: apiManager.isBackendHealthy('weather'),
  }),

  // Weather forecast query
  forecast: (location: string, days: number = 7) => ({
    queryKey: ['weather', 'forecast', location, days],
    queryFn: () => weatherApi.getForecast(location, days),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
    enabled: apiManager.isBackendHealthy('weather'),
  }),

  // Weather alerts query
  alerts: (location: string) => ({
    queryKey: ['weather', 'alerts', location],
    queryFn: () => weatherApi.getWeatherAlerts(location),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    enabled: apiManager.isBackendHealthy('weather'),
  }),

  // Historical weather query
  historical: (location: string, date: string) => ({
    queryKey: ['weather', 'historical', location, date],
    queryFn: () => weatherApi.getHistoricalWeather(location, date),
    staleTime: 60 * 60 * 1000, // 1 hour (historical data doesn't change)
    retry: 2,
    enabled: apiManager.isBackendHealthy('weather'),
  }),

  // Weather statistics query
  stats: (location: string, period: string) => ({
    queryKey: ['weather', 'stats', location, period],
    queryFn: () => weatherApi.getWeatherStats(location, period),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: apiManager.isBackendHealthy('weather'),
  }),

  // Health check query
  health: () => ({
    queryKey: ['weather', 'health'],
    queryFn: () => weatherApi.healthCheck(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  }),
};

// Export singleton instance
export const weatherApi = new WeatherApiClient();

// Utility function to check if weather backend is accessible
export const checkWeatherBackendConnection = async (): Promise<boolean> => {
  try {
    await weatherApi.healthCheck();
    console.log('✅ Weather backend connection successful');
    return true;
  } catch (error) {
    console.error('❌ Weather backend connection failed:', error);
    return false;
  }
};

export default weatherApi;