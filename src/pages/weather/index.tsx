import WeatherDashboard from '@/components/weather/WeatherDashboard';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { workspaceConfig } from '@/lib/config/workspace';

export default function WeatherModule() {
  const defaultLocation = process.env.NEXT_PUBLIC_WEATHER_DEFAULT_LOCATION || 'New York';

  return (
    <>
      <Head>
        <title>Weather Module - {workspaceConfig.name}</title>
        <meta 
          name="description" 
          content="Advanced weather forecasting and climate analysis module. Real-time weather data, forecasts, and alerts." 
        />
        <meta name="keywords" content="weather, forecast, weather alerts, temperature, humidity, precipitation, climate analysis" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        {/* Module Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Weather Module</h1>
                <p className="text-white/80 text-sm">Connected to {workspaceConfig.backends.weather.name}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Weather Dashboard */}
        <WeatherDashboard defaultLocation={defaultLocation} />
      </div>
    </>
  );
}