import WeatherDashboard from '@/components/WeatherDashboard';
import Head from 'next/head';

export default function Home() {
  const defaultLocation = process.env.NEXT_PUBLIC_DEFAULT_LOCATION || 'New York';

  return (
    <>
      <Head>
        <title>Weather Dashboard - Real-time Weather Forecasting</title>
        <meta 
          name="description" 
          content="Get accurate weather forecasts, real-time conditions, and weather alerts. Modern weather dashboard powered by advanced forecasting algorithms." 
        />
        <meta name="keywords" content="weather, forecast, weather alerts, temperature, humidity, precipitation" />
        
        {/* Open Graph tags for social media */}
        <meta property="og:title" content="Weather Dashboard - Real-time Weather Forecasting" />
        <meta property="og:description" content="Get accurate weather forecasts and real-time conditions with our modern weather dashboard." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://weather-forecasting-ui.vercel.app" />
        <meta property="og:image" content="/weather-og-image.png" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Weather Dashboard" />
        <meta name="twitter:description" content="Real-time weather forecasting with beautiful, responsive design" />
        <meta name="twitter:image" content="/weather-twitter-image.png" />
        
        {/* Additional meta tags */}
        <meta name="author" content="Weather Forecasting Team" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://weather-forecasting-ui.vercel.app" />
      </Head>

      <main className="min-h-screen">
        <WeatherDashboard defaultLocation={defaultLocation} />
      </main>
    </>
  );
}