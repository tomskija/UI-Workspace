// Workspace Calculations Manager
// Central hub for client-side calculations across all backend modules

import { weatherCalculations } from './weather';
// Future imports:
// import { financeCalculations } from './finance';
// import { mlCalculations } from './ml';
// import { analyticsCalculations } from './analytics';

// Shared calculation types
export interface CalculationResult<T = any> {
  success: boolean;
  data: T;
  error?: string;
  metadata?: {
    calculationType: string;
    timestamp: string;
    processingTime?: number;
  };
}

export interface CalculationInput {
  type: string;
  module: string;
  data: any;
  options?: any;
}

// Base calculation interface that all modules should implement
export interface ModuleCalculations {
  calculate(input: CalculationInput): Promise<CalculationResult>;
  validateInput(input: CalculationInput): boolean;
  getSupportedCalculations(): string[];
}

// Workspace calculation manager
export class WorkspaceCalculationsManager {
  private modules: Map<string, ModuleCalculations> = new Map();

  constructor() {
    this.initializeModules();
  }

  // Initialize all available calculation modules
  private initializeModules(): void {
    // Register weather calculations
    this.modules.set('weather', weatherCalculations);
    
    // Future modules will be registered here:
    // this.modules.set('finance', financeCalculations);
    // this.modules.set('ml', mlCalculations);
    // this.modules.set('analytics', analyticsCalculations);
  }

  // Execute calculation for a specific module
  async calculate(input: CalculationInput): Promise<CalculationResult> {
    const startTime = Date.now();
    
    try {
      const module = this.modules.get(input.module);
      if (!module) {
        return {
          success: false,
          data: null,
          error: `Module '${input.module}' not found`,
          metadata: {
            calculationType: input.type,
            timestamp: new Date().toISOString(),
            processingTime: Date.now() - startTime
          }
        };
      }

      // Validate input
      if (!module.validateInput(input)) {
        return {
          success: false,
          data: null,
          error: `Invalid input for calculation '${input.type}' in module '${input.module}'`,
          metadata: {
            calculationType: input.type,
            timestamp: new Date().toISOString(),
            processingTime: Date.now() - startTime
          }
        };
      }

      // Execute calculation
      const result = await module.calculate(input);
      
      // Add processing time to metadata
      if (result.metadata) {
        result.metadata.processingTime = Date.now() - startTime;
      }

      return result;
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          calculationType: input.type,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  // Get all available calculations across modules
  getAllCalculations(): Record<string, string[]> {
    const calculations: Record<string, string[]> = {};
    
    this.modules.forEach((module, moduleName) => {
      calculations[moduleName] = module.getSupportedCalculations();
    });

    return calculations;
  }

  // Get calculations for a specific module
  getModuleCalculations(moduleName: string): string[] {
    const module = this.modules.get(moduleName);
    return module ? module.getSupportedCalculations() : [];
  }

  // Check if a calculation is supported
  isCalculationSupported(moduleName: string, calculationType: string): boolean {
    const module = this.modules.get(moduleName);
    if (!module) return false;
    
    return module.getSupportedCalculations().includes(calculationType);
  }

  // Batch calculations (useful for processing multiple calculations)
  async batchCalculate(inputs: CalculationInput[]): Promise<CalculationResult[]> {
    const results = await Promise.allSettled(
      inputs.map(input => this.calculate(input))
    );

    return results.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          data: null,
          error: result.reason?.message || 'Batch calculation failed',
          metadata: {
            calculationType: 'batch',
            timestamp: new Date().toISOString()
          }
        };
      }
    });
  }

  // Cross-module calculations (if enabled in workspace config)
  async crossModuleCalculate(
    primaryModule: string,
    secondaryModule: string,
    calculation: string,
    data: any
  ): Promise<CalculationResult> {
    // This would implement cross-module calculations
    // For example, using ML predictions on weather data
    throw new Error('Cross-module calculations not yet implemented');
  }

  // Register a new calculation module (for future extensibility)
  registerModule(name: string, module: ModuleCalculations): void {
    this.modules.set(name, module);
  }

  // Get available modules
  getAvailableModules(): string[] {
    return Array.from(this.modules.keys());
  }
}

// Singleton instance
export const workspaceCalculations = new WorkspaceCalculationsManager();

// Convenience functions for direct access
export const calculate = (input: CalculationInput) => workspaceCalculations.calculate(input);
export const getAllCalculations = () => workspaceCalculations.getAllCalculations();
export const getModuleCalculations = (moduleName: string) => workspaceCalculations.getModuleCalculations(moduleName);

export default workspaceCalculations;