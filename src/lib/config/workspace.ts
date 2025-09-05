// Workspace Configuration Management
// Centralized configuration for multi-backend UI workspace

export interface BackendConfig {
  name: string;
  url: string;
  version: string;
  enabled: boolean;
  timeout?: number;
  retryCount?: number;
  healthEndpoint?: string;
  features: string[];
}

export interface WorkspaceModule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  backend: string;
  routes: string[];
  icon: string;
  color: string;
}

export interface WorkspaceConfig {
  name: string;
  version: string;
  environment: string;
  defaultModule: string;
  multiBackendEnabled: boolean;
  backends: Record<string, BackendConfig>;
  modules: Record<string, WorkspaceModule>;
  features: {
    crossModuleAnalytics: boolean;
    sharedCalculations: boolean;
    modulesCommunication: boolean;
    devTools: boolean;
    performanceMonitoring: boolean;
  };
}

// Load configuration from environment variables
export const loadWorkspaceConfig = (): WorkspaceConfig => {
  const config: WorkspaceConfig = {
    name: process.env.NEXT_PUBLIC_WORKSPACE_NAME || 'UI-Workspace',
    version: process.env.NEXT_PUBLIC_WORKSPACE_VERSION || '1.0.0',
    environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    defaultModule: process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE || 'weather',
    multiBackendEnabled: process.env.NEXT_PUBLIC_ENABLE_MULTI_BACKEND === 'true',

    backends: {
      weather: {
        name: process.env.NEXT_PUBLIC_WEATHER_API_NAME || 'Weather-Forecasting',
        url: process.env.NEXT_PUBLIC_WEATHER_API_URL || 'http://localhost:8000',
        version: process.env.NEXT_PUBLIC_WEATHER_API_VERSION || 'v1',
        enabled: process.env.NEXT_PUBLIC_ENABLE_WEATHER_MODULE === 'true',
        timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
        retryCount: parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3'),
        healthEndpoint: '/health',
        features: ['forecasting', 'alerts', 'historical', 'realtime']
      },
      finance: {
        name: process.env.NEXT_PUBLIC_FINANCE_API_NAME || 'Financial-Analysis',
        url: process.env.NEXT_PUBLIC_FINANCE_API_URL || 'http://localhost:8001',
        version: process.env.NEXT_PUBLIC_FINANCE_API_VERSION || 'v1',
        enabled: process.env.NEXT_PUBLIC_ENABLE_FINANCE_MODULE === 'true',
        timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
        retryCount: parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3'),
        healthEndpoint: '/health',
        features: ['portfolio', 'analysis', 'predictions', 'realtime']
      },
      ml: {
        name: process.env.NEXT_PUBLIC_ML_API_NAME || 'ML-Processing',
        url: process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8002',
        version: process.env.NEXT_PUBLIC_ML_API_VERSION || 'v1',
        enabled: process.env.NEXT_PUBLIC_ENABLE_ML_MODULE === 'true',
        timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
        retryCount: parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3'),
        healthEndpoint: '/health',
        features: ['training', 'inference', 'models', 'datasets']
      },
      analytics: {
        name: process.env.NEXT_PUBLIC_ANALYTICS_API_NAME || 'Data-Analytics',
        url: process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:8003',
        version: process.env.NEXT_PUBLIC_ANALYTICS_API_VERSION || 'v1',
        enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_MODULE === 'true',
        timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
        retryCount: parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3'),
        healthEndpoint: '/health',
        features: ['reporting', 'visualization', 'insights', 'export']
      }
    },

    modules: {
      weather: {
        id: 'weather',
        name: 'Weather Forecasting',
        description: 'Advanced weather forecasting and climate analysis',
        enabled: process.env.NEXT_PUBLIC_ENABLE_WEATHER_MODULE === 'true',
        backend: 'weather',
        routes: ['/weather', '/weather/dashboard', '/weather/alerts'],
        icon: 'cloud-sun',
        color: 'blue'
      },
      finance: {
        id: 'finance',
        name: 'Financial Analysis',
        description: 'Financial data analysis and portfolio management',
        enabled: process.env.NEXT_PUBLIC_ENABLE_FINANCE_MODULE === 'true',
        backend: 'finance',
        routes: ['/finance', '/finance/portfolio', '/finance/analysis'],
        icon: 'trending-up',
        color: 'green'
      },
      ml: {
        id: 'ml',
        name: 'Machine Learning',
        description: 'ML model training and inference platform',
        enabled: process.env.NEXT_PUBLIC_ENABLE_ML_MODULE === 'true',
        backend: 'ml',
        routes: ['/ml', '/ml/models', '/ml/training'],
        icon: 'brain',
        color: 'purple'
      },
      analytics: {
        id: 'analytics',
        name: 'Data Analytics',
        description: 'Advanced data analytics and reporting',
        enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_MODULE === 'true',
        backend: 'analytics',
        routes: ['/analytics', '/analytics/reports', '/analytics/insights'],
        icon: 'bar-chart',
        color: 'orange'
      }
    },

    features: {
      crossModuleAnalytics: process.env.NEXT_PUBLIC_ENABLE_CROSS_MODULE_ANALYTICS === 'true',
      sharedCalculations: process.env.NEXT_PUBLIC_ENABLE_SHARED_CALCULATIONS === 'true',
      modulesCommunication: process.env.NEXT_PUBLIC_ENABLE_MODULE_COMMUNICATION === 'true',
      devTools: process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true',
      performanceMonitoring: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true'
    }
  };

  return config;
};

// Get enabled modules
export const getEnabledModules = (config: WorkspaceConfig): WorkspaceModule[] => {
  return Object.values(config.modules).filter(module => module.enabled);
};

// Get enabled backends
export const getEnabledBackends = (config: WorkspaceConfig): BackendConfig[] => {
  return Object.values(config.backends).filter(backend => backend.enabled);
};

// Get backend by module
export const getBackendForModule = (config: WorkspaceConfig, moduleId: string): BackendConfig | null => {
  const module = config.modules[moduleId];
  if (!module) return null;
  return config.backends[module.backend] || null;
};

// Validate workspace configuration
export const validateWorkspaceConfig = (config: WorkspaceConfig): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if at least one module is enabled
  const enabledModules = getEnabledModules(config);
  if (enabledModules.length === 0) {
    errors.push('At least one module must be enabled');
  }

  // Check if default module is enabled
  const defaultModule = config.modules[config.defaultModule];
  if (!defaultModule || !defaultModule.enabled) {
    errors.push(`Default module '${config.defaultModule}' is not enabled`);
  }

  // Check backend URLs
  Object.entries(config.backends).forEach(([key, backend]) => {
    if (backend.enabled && !backend.url) {
      errors.push(`Backend '${key}' is enabled but has no URL configured`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

// Global workspace configuration instance
export const workspaceConfig = loadWorkspaceConfig();

export default workspaceConfig;