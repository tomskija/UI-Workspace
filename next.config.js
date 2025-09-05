/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Output standalone for Docker deployment
  output: 'standalone',
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_DEFAULT_LOCATION: process.env.NEXT_PUBLIC_DEFAULT_LOCATION,
  },
  
  // Image optimization settings
  images: {
    domains: [
      'api.weather-forecasting.app', 
      'openweathermap.org',
      'weatherapi.com',
      'localhost'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // API routes configuration - proxy to backend
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    return [
      {
        source: '/api/weather/:path*',
        destination: `${apiUrl}/weather/:path*`,
      },
      {
        source: '/api/forecast/:path*',
        destination: `${apiUrl}/forecast/:path*`,
      },
      {
        source: '/api/health',
        destination: `${apiUrl}/health`,
      }
    ];
  },
  
  // CORS headers for API integration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Webpack configuration for optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom webpack configurations here
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Ignore node_modules for client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // TypeScript configuration
  typescript: {
    // Ignore build errors during development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // ESLint configuration
  eslint: {
    // Ignore ESLint during builds in development
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
    dirs: ['src'],
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;