#!/usr/bin/env node

// Backend health check script for UI Workspace
// Usage: npm run workspace:health

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const BACKENDS = {
  weather: {
    name: 'Weather-Forecasting',
    url: process.env.NEXT_PUBLIC_WEATHER_API_URL || 'http://localhost:8000',
    enabled: process.env.NEXT_PUBLIC_ENABLE_WEATHER_MODULE === 'true',
    timeout: 30000
  },
  finance: {
    name: 'Financial-Analysis', 
    url: process.env.NEXT_PUBLIC_FINANCE_API_URL || 'http://localhost:8001',
    enabled: process.env.NEXT_PUBLIC_ENABLE_FINANCE_MODULE === 'true',
    timeout: 30000
  },
  ml: {
    name: 'ML-Processing',
    url: process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8002', 
    enabled: process.env.NEXT_PUBLIC_ENABLE_ML_MODULE === 'true',
    timeout: 30000
  },
  analytics: {
    name: 'Data-Analytics',
    url: process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:8003',
    enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_MODULE === 'true', 
    timeout: 30000
  }
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

// Check health of a single backend
async function checkBackendHealth(backendKey, backend) {
  if (!backend.enabled) {
    return {
      status: 'disabled',
      message: 'Module disabled in configuration',
      responseTime: 0
    };
  }

  const startTime = Date.now();
  
  try {
    const response = await axios.get(`${backend.url}/health`, {
      timeout: backend.timeout,
      headers: {
        'User-Agent': 'UI-Workspace-Health-Check/1.0'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: response.data.status === 'healthy' ? 'healthy' : 'unhealthy',
      message: `${backend.name} is responding`,
      responseTime,
      version: response.data.version,
      timestamp: response.data.timestamp,
      statusCode: response.status
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error.code === 'ECONNREFUSED') {
      return {
        status: 'unreachable',
        message: `Cannot connect to ${backend.name} at ${backend.url}`,
        responseTime,
        error: 'Connection refused - service may not be running'
      };
    } else if (error.code === 'ETIMEDOUT') {
      return {
        status: 'timeout',
        message: `${backend.name} request timed out`,
        responseTime,
        error: 'Request timeout - service may be overloaded'
      };
    } else {
      return {
        status: 'error',
        message: `${backend.name} health check failed`,
        responseTime,
        error: error.message,
        statusCode: error.response?.status
      };
    }
  }
}

// Main health check function
async function checkAllBackends() {
  console.log(`${colors.cyan}🔍 UI Workspace Backend Health Check${colors.reset}`);
  console.log(`${colors.white}================================================${colors.reset}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const results = {};
  const promises = Object.entries(BACKENDS).map(async ([key, backend]) => {
    const result = await checkBackendHealth(key, backend);
    results[key] = { ...backend, ...result };
    return { key, result };
  });

  const healthResults = await Promise.all(promises);
  
  // Display results
  let healthyCount = 0;
  let enabledCount = 0;
  
  for (const { key, result } of healthResults) {
    const backend = BACKENDS[key];
    
    if (!backend.enabled) {
      console.log(`${colors.yellow}⚪ ${backend.name}${colors.reset}`);
      console.log(`   Status: Disabled`);
      console.log(`   URL: ${backend.url}`);
    } else {
      enabledCount++;
      
      if (result.status === 'healthy') {
        healthyCount++;
        console.log(`${colors.green}✅ ${backend.name}${colors.reset}`);
        console.log(`   Status: Healthy (${result.responseTime}ms)`);
        console.log(`   URL: ${backend.url}`);
        if (result.version) console.log(`   Version: ${result.version}`);
      } else {
        console.log(`${colors.red}❌ ${backend.name}${colors.reset}`);
        console.log(`   Status: ${result.status.toUpperCase()} (${result.responseTime}ms)`);
        console.log(`   URL: ${backend.url}`);
        console.log(`   Error: ${result.error || result.message}`);
      }
    }
    console.log('');
  }

  // Summary
  console.log(`${colors.white}================================================${colors.reset}`);
  console.log(`${colors.cyan}📊 Summary${colors.reset}`);
  console.log(`Enabled Backends: ${enabledCount}`);
  console.log(`Healthy Backends: ${healthyCount}`);
  console.log(`Success Rate: ${enabledCount > 0 ? Math.round((healthyCount / enabledCount) * 100) : 0}%`);
  
  if (healthyCount === enabledCount && enabledCount > 0) {
    console.log(`${colors.green}🎉 All enabled backends are healthy!${colors.reset}`);
  } else if (healthyCount > 0) {
    console.log(`${colors.yellow}⚠️  Some backends are unhealthy or unreachable${colors.reset}`);
  } else {
    console.log(`${colors.red}🚨 No healthy backends found${colors.reset}`);
  }

  // Save results to file for UI consumption
  const outputPath = path.join(__dirname, '..', 'public', 'health-status.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: Object.keys(BACKENDS).length,
      enabled: enabledCount,
      healthy: healthyCount,
      successRate: enabledCount > 0 ? Math.round((healthyCount / enabledCount) * 100) : 0
    },
    backends: results
  }, null, 2));

  console.log(`\n${colors.blue}💾 Health status saved to: public/health-status.json${colors.reset}`);
  
  // Exit with appropriate code
  process.exit(healthyCount === enabledCount ? 0 : 1);
}

// Run health check
if (require.main === module) {
  checkAllBackends().catch(error => {
    console.error(`${colors.red}❌ Health check script failed:${colors.reset}`, error.message);
    process.exit(1);
  });
}