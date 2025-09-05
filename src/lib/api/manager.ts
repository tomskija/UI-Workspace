import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BackendConfig, workspaceConfig } from '@/lib/config/workspace';

// Generic API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  timestamp?: string;
}

// Generic API error
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Health check response
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version?: string;
  uptime?: number;
  services?: Record<string, any>;
}

// API client manager for handling multiple backends
export class ApiManager {
  private clients: Map<string, AxiosInstance> = new Map();
  private healthStatus: Map<string, boolean> = new Map();

  constructor() {
    this.initializeClients();
  }

  // Initialize API clients for all enabled backends
  private initializeClients(): void {
    Object.entries(workspaceConfig.backends).forEach(([key, config]) => {
      if (config.enabled) {
        this.createClient(key, config);
      }
    });
  }

  // Create an API client for a specific backend
  private createClient(backendKey: string, config: BackendConfig): void {
    const client = axios.create({
      baseURL: config.url,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Version': config.version,
        'X-Client': 'ui-workspace',
      },
    });

    // Request interceptor
    client.interceptors.request.use(
      (requestConfig) => {
        // Add auth token if available
        const token = this.getAuthToken(backendKey);
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }

        // Log API calls in development
        if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_API_CALLS === 'true') {
          console.log(`🚀 [${backendKey.toUpperCase()}] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
        }

        return requestConfig;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    client.interceptors.response.use(
      (response) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_API_CALLS === 'true') {
          console.log(`✅ [${backendKey.toUpperCase()}] ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ [${backendKey.toUpperCase()}] ${error.response?.status} ${error.config?.url}`, {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
          });
        }

        // Handle authentication errors
        if (error.response?.status === 401) {
          this.handleAuthError(backendKey);
        }

        return Promise.reject(this.normalizeError(error, backendKey));
      }
    );

    this.clients.set(backendKey, client);
  }

  // Get API client for a specific backend
  getClient(backendKey: string): AxiosInstance | null {
    return this.clients.get(backendKey) || null;
  }

  // Generic API request method
  async request<T = any>(
    backendKey: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const client = this.getClient(backendKey);
    if (!client) {
      throw new Error(`Backend '${backendKey}' is not configured or enabled`);
    }

    try {
      const response: AxiosResponse<T> = await client.request({
        method,
        url: endpoint,
        data,
        ...config,
      });

      return {
        data: response.data,
        status: response.status,
        message: response.statusText,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw this.normalizeError(error, backendKey);
    }
  }

  // Health check for a specific backend
  async healthCheck(backendKey: string): Promise<HealthCheckResponse> {
    const config = workspaceConfig.backends[backendKey];
    if (!config) {
      throw new Error(`Backend '${backendKey}' is not configured`);
    }

    try {
      const response = await this.request<HealthCheckResponse>(
        backendKey,
        'GET',
        config.healthEndpoint || '/health'
      );
      
      this.healthStatus.set(backendKey, true);
      return response.data;
    } catch (error) {
      this.healthStatus.set(backendKey, false);
      throw error;
    }
  }

  // Check health of all enabled backends
  async healthCheckAll(): Promise<Record<string, HealthCheckResponse | ApiError>> {
    const results: Record<string, HealthCheckResponse | ApiError> = {};
    const enabledBackends = Object.keys(workspaceConfig.backends).filter(
      key => workspaceConfig.backends[key].enabled
    );

    await Promise.allSettled(
      enabledBackends.map(async (backendKey) => {
        try {
          results[backendKey] = await this.healthCheck(backendKey);
        } catch (error) {
          results[backendKey] = error as ApiError;
        }
      })
    );

    return results;
  }

  // Get health status for a backend
  isBackendHealthy(backendKey: string): boolean {
    return this.healthStatus.get(backendKey) || false;
  }

  // Get all healthy backends
  getHealthyBackends(): string[] {
    return Array.from(this.healthStatus.entries())
      .filter(([, isHealthy]) => isHealthy)
      .map(([backendKey]) => backendKey);
  }

  // Generic methods for common operations
  async get<T = any>(backendKey: string, endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(backendKey, 'GET', endpoint, undefined, config);
  }

  async post<T = any>(backendKey: string, endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(backendKey, 'POST', endpoint, data, config);
  }

  async put<T = any>(backendKey: string, endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(backendKey, 'PUT', endpoint, data, config);
  }

  async delete<T = any>(backendKey: string, endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(backendKey, 'DELETE', endpoint, undefined, config);
  }

  // Authentication helpers
  private getAuthToken(backendKey: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`auth_token_${backendKey}`);
  }

  setAuthToken(backendKey: string, token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`auth_token_${backendKey}`, token);
  }

  clearAuthToken(backendKey: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`auth_token_${backendKey}`);
  }

  private handleAuthError(backendKey: string): void {
    this.clearAuthToken(backendKey);
    // Could redirect to login page or emit an auth event
    console.warn(`Authentication failed for backend: ${backendKey}`);
  }

  // Error normalization
  private normalizeError(error: any, backendKey: string): ApiError {
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
      code: error.response?.data?.code || error.code,
      details: {
        backend: backendKey,
        url: error.config?.url,
        method: error.config?.method,
        originalError: error.response?.data || error.message,
      },
    };
  }

  // Refresh all clients (useful for config changes)
  refreshClients(): void {
    this.clients.clear();
    this.healthStatus.clear();
    this.initializeClients();
  }

  // Get backend configuration
  getBackendConfig(backendKey: string): BackendConfig | null {
    return workspaceConfig.backends[backendKey] || null;
  }

  // Get all enabled backend keys
  getEnabledBackendKeys(): string[] {
    return Object.keys(workspaceConfig.backends).filter(
      key => workspaceConfig.backends[key].enabled
    );
  }
}

// Singleton instance
export const apiManager = new ApiManager();

// Export for convenient usage
export default apiManager;