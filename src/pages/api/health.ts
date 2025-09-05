import { NextApiRequest, NextApiResponse } from 'next';
import { weatherApi } from '@/lib/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if backend is accessible
    const backendHealth = await weatherApi.healthCheck();
    
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      frontend: {
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
      },
      backend: {
        status: backendHealth.status,
        url: process.env.NEXT_PUBLIC_API_URL,
        timestamp: backendHealth.timestamp,
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      frontend: {
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
      },
      backend: {
        status: 'unreachable',
        url: process.env.NEXT_PUBLIC_API_URL,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}