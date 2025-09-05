'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { weatherApi, weatherQueries } from '../../lib/api/weather';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Droplets, 
  Wind, 
  Eye,
  AlertTriangle,
  MapPin,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface WeatherDashboardProps {
  defaultLocation?: string;
  showBackButton?: boolean;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ 
  defaultLocation = 'New York',
  showBackButton = false
}) => {
  const [location, setLocation] = useState(defaultLocation);
  const [searchInput, setSearchInput] = useState('');

  // Weather data queries using the new API structure
  const { 
    data: currentWeather, 
    isLoading: currentLoading, 
    error: currentError,
    refetch: refetchCurrent
  } = useQuery(weatherQueries.currentWeather(location));

  const { 
    data: forecast, 
    isLoading: forecastLoading 
  } = useQuery(weatherQueries.forecast(location, 7));

  const { 
    data: alerts, 
    isLoading: alertsLoading 
  } = useQuery(weatherQueries.alerts(location));

  // Backend health check
  const { data: healthCheck, isLoading: healthLoading } = useQuery(weatherQueries.health());

  // Weather icon mapping
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="w-8 h-8 text-gray-500" />;
    } else if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
      return <Sun className="w-8 h-8 text-yellow-500" />;
    }
    return <Sun className="w-8 h-8 text-yellow-500" />;
  };

  // Handle location search
  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(searchInput.trim());
      setSearchInput('');
    }
  };

  // Format temperature chart data
  const chartData = forecast?.forecast?.slice(0, 7).map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    high: day.high,
    low: day.low,
  })) || [];

  // Backend connection error
  if (currentError && !currentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
            Weather Backend Unavailable
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Unable to connect to the weather forecasting backend. Please check if the backend service is running.
          </p>
          <div className="text-center space-y-2">
            <button
              onClick={() => refetchCurrent()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
            {showBackButton && (
              <Link href="/" className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Back to Workspace
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Backend Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Weather Forecasting</h1>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${healthCheck ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-white/80 text-sm">
                  {healthLoading ? 'Checking backend...' : healthCheck ? 'Backend Online' : 'Backend Offline'}
                </span>
              </div>
            </div>
            
            {/* Location Search */}
            <form onSubmit={handleLocationSearch} className="flex items-center space-x-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search location..."
                  className="pl-10 pr-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <button
                type="submit"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Search
              </button>
              <button
                onClick={() => refetchCurrent()}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white p-2 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Weather Alerts */}
        {alerts && alerts.length > 0 && (
          <div className="mb-8">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-red-800 font-semibold">Weather Alerts</h3>
              </div>
              {alerts.map((alert) => (
                <div key={alert.id} className="mt-2">
                  <p className="text-red-700 font-medium">{alert.title}</p>
                  <p className="text-red-600 text-sm">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              {currentLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-white/20 rounded mb-4"></div>
                  <div className="h-24 bg-white/20 rounded"></div>
                </div>
              ) : currentWeather ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {currentWeather.location.city}
                      </h2>
                      <p className="text-white/80">
                        {new Date().toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    {getWeatherIcon(currentWeather.current.conditions)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-4xl font-bold text-white mb-2">
                        {Math.round(currentWeather.current.temperature)}°C
                      </div>
                      <p className="text-white/80 capitalize">
                        {currentWeather.current.conditions}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-white/80">
                        <Droplets className="w-4 h-4 mr-2" />
                        <span>Humidity: {currentWeather.current.humidity}%</span>
                      </div>
                      <div className="flex items-center text-white/80">
                        <Wind className="w-4 h-4 mr-2" />
                        <span>Wind: {currentWeather.current.wind_speed} m/s</span>
                      </div>
                      <div className="flex items-center text-white/80">
                        <Eye className="w-4 h-4 mr-2" />
                        <span>Pressure: {currentWeather.current.pressure} hPa</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Temperature Chart */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">7-Day Forecast</h3>
            {forecastLoading ? (
              <div className="animate-pulse h-48 bg-white/20 rounded"></div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'white', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'white', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      border: 'none', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="high" 
                    stroke="#fbbf24" 
                    strokeWidth={3}
                    dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="low" 
                    stroke="#60a5fa" 
                    strokeWidth={3}
                    dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Weekly Forecast */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Weekly Forecast</h3>
          {forecastLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-16 bg-white/20 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {forecast?.forecast?.map((day, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-white/80 text-sm mb-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.conditions)}
                  </div>
                  <div className="text-white font-semibold mb-1">
                    {Math.round(day.high)}°
                  </div>
                  <div className="text-white/60 text-sm">
                    {Math.round(day.low)}°
                  </div>
                  <div className="text-white/60 text-xs mt-1">
                    {day.precipitation_chance}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;