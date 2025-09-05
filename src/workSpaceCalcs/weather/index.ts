// Weather-specific calculations for client-side processing
// Complementary to the Weather-Forecasting backend Calculator.py

import { CalculationResult, CalculationInput, ModuleCalculations } from '../index';

// Weather calculation types
interface WeatherData {
  temperature: number; // Celsius
  humidity: number; // Percentage
  pressure: number; // hPa
  windSpeed: number; // m/s
  windDirection?: number; // degrees
}

interface TemperatureConversionInput {
  temperature: number;
  fromUnit: 'celsius' | 'fahrenheit' | 'kelvin';
  toUnit: 'celsius' | 'fahrenheit' | 'kelvin';
}

interface HeatIndexInput {
  temperature: number; // Celsius
  humidity: number; // Percentage
}

interface WindChillInput {
  temperature: number; // Celsius
  windSpeed: number; // m/s
}

interface DewPointInput {
  temperature: number; // Celsius
  humidity: number; // Percentage
}

// Weather calculations implementation
class WeatherCalculations implements ModuleCalculations {
  
  async calculate(input: CalculationInput): Promise<CalculationResult> {
    const startTime = Date.now();
    
    try {
      let result: any;
      
      switch (input.type) {
        case 'temperature_conversion':
          result = this.convertTemperature(input.data as TemperatureConversionInput);
          break;
          
        case 'heat_index':
          result = this.calculateHeatIndex(input.data as HeatIndexInput);
          break;
          
        case 'wind_chill':
          result = this.calculateWindChill(input.data as WindChillInput);
          break;
          
        case 'dew_point':
          result = this.calculateDewPoint(input.data as DewPointInput);
          break;
          
        case 'comfort_index':
          result = this.calculateComfortIndex(input.data as WeatherData);
          break;
          
        case 'weather_summary':
          result = this.generateWeatherSummary(input.data as WeatherData);
          break;
          
        case 'pressure_trend':
          result = this.analyzePressureTrend(input.data);
          break;
          
        default:
          throw new Error(`Unsupported calculation type: ${input.type}`);
      }

      return {
        success: true,
        data: result,
        metadata: {
          calculationType: input.type,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Calculation failed',
        metadata: {
          calculationType: input.type,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  validateInput(input: CalculationInput): boolean {
    if (!input.data || input.module !== 'weather') return false;
    
    switch (input.type) {
      case 'temperature_conversion':
        const tempConv = input.data as TemperatureConversionInput;
        return typeof tempConv.temperature === 'number' &&
               ['celsius', 'fahrenheit', 'kelvin'].includes(tempConv.fromUnit) &&
               ['celsius', 'fahrenheit', 'kelvin'].includes(tempConv.toUnit);
               
      case 'heat_index':
        const heatIndex = input.data as HeatIndexInput;
        return typeof heatIndex.temperature === 'number' &&
               typeof heatIndex.humidity === 'number' &&
               heatIndex.humidity >= 0 && heatIndex.humidity <= 100;
               
      case 'wind_chill':
        const windChill = input.data as WindChillInput;
        return typeof windChill.temperature === 'number' &&
               typeof windChill.windSpeed === 'number' &&
               windChill.windSpeed >= 0;
               
      case 'dew_point':
        const dewPoint = input.data as DewPointInput;
        return typeof dewPoint.temperature === 'number' &&
               typeof dewPoint.humidity === 'number' &&
               dewPoint.humidity >= 0 && dewPoint.humidity <= 100;
               
      case 'comfort_index':
      case 'weather_summary':
        const weather = input.data as WeatherData;
        return typeof weather.temperature === 'number' &&
               typeof weather.humidity === 'number' &&
               typeof weather.pressure === 'number' &&
               typeof weather.windSpeed === 'number';
               
      case 'pressure_trend':
        return Array.isArray(input.data) && input.data.length > 1;
        
      default:
        return false;
    }
  }

  getSupportedCalculations(): string[] {
    return [
      'temperature_conversion',
      'heat_index',
      'wind_chill', 
      'dew_point',
      'comfort_index',
      'weather_summary',
      'pressure_trend'
    ];
  }

  // Temperature conversion utilities
  private convertTemperature(input: TemperatureConversionInput): { convertedTemperature: number; unit: string } {
    const { temperature, fromUnit, toUnit } = input;
    
    // First convert to Celsius
    let celsius: number;
    switch (fromUnit) {
      case 'celsius':
        celsius = temperature;
        break;
      case 'fahrenheit':
        celsius = (temperature - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = temperature - 273.15;
        break;
    }
    
    // Then convert from Celsius to target unit
    let result: number;
    switch (toUnit) {
      case 'celsius':
        result = celsius;
        break;
      case 'fahrenheit':
        result = (celsius * 9/5) + 32;
        break;
      case 'kelvin':
        result = celsius + 273.15;
        break;
    }
    
    return {
      convertedTemperature: Math.round(result * 100) / 100,
      unit: toUnit
    };
  }

  // Heat index calculation (feels-like temperature in hot weather)
  private calculateHeatIndex(input: HeatIndexInput): { heatIndex: number; description: string } {
    const { temperature, humidity } = input;
    
    // Convert to Fahrenheit for calculation
    const tempF = (temperature * 9/5) + 32;
    
    if (tempF < 80) {
      return {
        heatIndex: temperature,
        description: 'Heat index not applicable (temperature too low)'
      };
    }
    
    // Heat Index formula (in Fahrenheit)
    const hi = -42.379 + 
               2.04901523 * tempF +
               10.14333127 * humidity -
               0.22475541 * tempF * humidity -
               0.00683783 * tempF * tempF -
               0.05481717 * humidity * humidity +
               0.00122874 * tempF * tempF * humidity +
               0.00085282 * tempF * humidity * humidity -
               0.00000199 * tempF * tempF * humidity * humidity;
    
    // Convert back to Celsius
    const heatIndexC = (hi - 32) * 5/9;
    
    let description: string;
    if (hi < 80) description = 'No heat stress';
    else if (hi < 90) description = 'Caution: possible fatigue';
    else if (hi < 105) description = 'Extreme caution: heat cramps possible';
    else if (hi < 130) description = 'Danger: heat exhaustion likely';
    else description = 'Extreme danger: heat stroke imminent';
    
    return {
      heatIndex: Math.round(heatIndexC * 10) / 10,
      description
    };
  }

  // Wind chill calculation (feels-like temperature in cold, windy weather)
  private calculateWindChill(input: WindChillInput): { windChill: number; description: string } {
    const { temperature, windSpeed } = input;
    
    // Convert wind speed to km/h for calculation
    const windSpeedKmh = windSpeed * 3.6;
    
    if (temperature > 10 || windSpeedKmh < 4.8) {
      return {
        windChill: temperature,
        description: 'Wind chill not applicable'
      };
    }
    
    // Wind chill formula (Environment Canada)
    const windChill = 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeedKmh, 0.16) + 0.3965 * temperature * Math.pow(windSpeedKmh, 0.16);
    
    let description: string;
    if (windChill > -10) description = 'Low risk';
    else if (windChill > -28) description = 'Moderate risk of frostbite';
    else if (windChill > -40) description = 'High risk of frostbite';
    else description = 'Very high risk of frostbite';
    
    return {
      windChill: Math.round(windChill * 10) / 10,
      description
    };
  }

  // Dew point calculation
  private calculateDewPoint(input: DewPointInput): { dewPoint: number; description: string } {
    const { temperature, humidity } = input;
    
    // Magnus formula approximation
    const a = 17.27;
    const b = 237.7;
    
    const alpha = (a * temperature) / (b + temperature) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    
    let description: string;
    const comfort = temperature - dewPoint;
    if (comfort > 15) description = 'Very dry, low humidity';
    else if (comfort > 10) description = 'Comfortable humidity';
    else if (comfort > 5) description = 'Slightly humid';
    else if (comfort > 2) description = 'Humid and uncomfortable';
    else description = 'Very humid and oppressive';
    
    return {
      dewPoint: Math.round(dewPoint * 10) / 10,
      description
    };
  }

  // Comfort index based on multiple factors
  private calculateComfortIndex(data: WeatherData): { comfortIndex: number; description: string; factors: any } {
    const { temperature, humidity, windSpeed } = data;
    
    let score = 50; // Base comfort score
    
    // Temperature comfort (optimal around 20-22°C)
    const tempDiff = Math.abs(temperature - 21);
    if (tempDiff < 2) score += 20;
    else if (tempDiff < 5) score += 10;
    else if (tempDiff < 10) score -= 10;
    else score -= 20;
    
    // Humidity comfort (optimal around 45-55%)
    const humidityDiff = Math.abs(humidity - 50);
    if (humidityDiff < 10) score += 15;
    else if (humidityDiff < 20) score += 5;
    else if (humidityDiff < 30) score -= 5;
    else score -= 15;
    
    // Wind comfort (light breeze is pleasant)
    if (windSpeed > 0.5 && windSpeed < 3) score += 10;
    else if (windSpeed < 0.5) score -= 5;
    else if (windSpeed > 8) score -= 15;
    
    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score));
    
    let description: string;
    if (score >= 80) description = 'Excellent weather conditions';
    else if (score >= 60) description = 'Good weather conditions';
    else if (score >= 40) description = 'Fair weather conditions';
    else if (score >= 20) description = 'Poor weather conditions';
    else description = 'Very poor weather conditions';
    
    return {
      comfortIndex: Math.round(score),
      description,
      factors: {
        temperature: temperature,
        humidity: humidity,
        windSpeed: windSpeed,
        temperatureScore: Math.max(0, Math.min(40, 40 - tempDiff * 2)),
        humidityScore: Math.max(0, Math.min(30, 30 - humidityDiff)),
        windScore: windSpeed > 0.5 && windSpeed < 3 ? 10 : windSpeed > 8 ? -15 : -5
      }
    };
  }

  // Generate a comprehensive weather summary
  private generateWeatherSummary(data: WeatherData): { summary: string; recommendations: string[]; alerts: string[] } {
    const { temperature, humidity, pressure, windSpeed } = data;
    
    const recommendations: string[] = [];
    const alerts: string[] = [];
    
    // Temperature recommendations
    if (temperature < 0) {
      recommendations.push('Dress in layers and cover exposed skin');
      alerts.push('Freezing temperatures - risk of frostbite');
    } else if (temperature < 10) {
      recommendations.push('Wear warm clothing and jacket');
    } else if (temperature > 30) {
      recommendations.push('Stay hydrated and seek shade');
      if (temperature > 35) {
        alerts.push('Very hot weather - heat exhaustion possible');
      }
    }
    
    // Humidity recommendations
    if (humidity > 80) {
      recommendations.push('High humidity may cause discomfort');
    } else if (humidity < 30) {
      recommendations.push('Low humidity - stay hydrated');
    }
    
    // Wind recommendations
    if (windSpeed > 10) {
      recommendations.push('Strong winds - secure loose objects');
      alerts.push('High wind speeds');
    }
    
    // Pressure analysis
    if (pressure < 1000) {
      recommendations.push('Low pressure may indicate weather changes');
    } else if (pressure > 1020) {
      recommendations.push('High pressure usually indicates stable weather');
    }
    
    const summary = `Temperature: ${temperature}°C, Humidity: ${humidity}%, Wind: ${windSpeed} m/s, Pressure: ${pressure} hPa`;
    
    return { summary, recommendations, alerts };
  }

  // Analyze pressure trend from historical data
  private analyzePressureTrend(pressureData: number[]): { trend: string; prediction: string; strength: number } {
    if (pressureData.length < 2) {
      return { trend: 'insufficient data', prediction: 'Cannot determine trend', strength: 0 };
    }
    
    // Calculate trend
    const recent = pressureData.slice(-3);
    const earlier = pressureData.slice(-6, -3);
    
    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const earlierAvg = earlier.length > 0 ? earlier.reduce((a, b) => a + b) / earlier.length : recentAvg;
    
    const change = recentAvg - earlierAvg;
    const strength = Math.abs(change);
    
    let trend: string;
    let prediction: string;
    
    if (Math.abs(change) < 1) {
      trend = 'stable';
      prediction = 'Weather conditions likely to remain stable';
    } else if (change > 0) {
      trend = 'rising';
      prediction = change > 3 ? 'Rapidly improving weather expected' : 'Generally improving weather expected';
    } else {
      trend = 'falling';
      prediction = change < -3 ? 'Rapidly deteriorating weather possible' : 'Weather may deteriorate';
    }
    
    return { trend, prediction, strength: Math.round(strength * 10) / 10 };
  }
}

// Export singleton instance
export const weatherCalculations = new WeatherCalculations();
export default weatherCalculations;