import WorkspaceDashboard from '@/components/WorkspaceDashboard';
import Head from 'next/head';
import { workspaceConfig } from '@/lib/config/workspace';

export default function Home() {
  return (
    <>
      <Head>
        <title>{workspaceConfig.name} - Multi-Backend UI Workspace</title>
        <meta 
          name="description" 
          content="Generic UI workspace for multiple Python backend services. Modular, scalable, and extensible interface for data processing, analytics, and computation." 
        />
        <meta name="keywords" content="ui workspace, multi backend, python apis, modular ui, data processing, analytics, machine learning" />
        
        {/* Open Graph tags for social media */}
        <meta property="og:title" content={`${workspaceConfig.name} - Multi-Backend UI Workspace`} />
        <meta property="og:description" content="Generic UI workspace for multiple Python backend services with modular, scalable interface." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ui-workspace-tomskija.vercel.app" />
        <meta property="og:image" content="/workspace-og-image.png" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${workspaceConfig.name} - Multi-Backend Workspace`} />
        <meta name="twitter:description" content="Modular UI workspace for multiple Python backend services" />
        <meta name="twitter:image" content="/workspace-twitter-image.png" />
        
        {/* Additional meta tags */}
        <meta name="author" content="Tom Skija" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ui-workspace-tomskija.vercel.app" />
      </Head>

      <main className="min-h-screen">
        <WorkspaceDashboard />
      </main>
    </>
  );
}
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