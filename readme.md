# UI Workspace

A modern, modular React/Next.js frontend workspace designed to connect with multiple Python backend services. Currently supports [Weather Forecasting Calculator](https://github.com/tomskija/Weather-Forcasting) with architecture ready for additional backend integrations.

## 🚀 Features

- **Multi-Backend Architecture** - Seamlessly connect to multiple Python backend services
- **Modular Design** - Each backend service gets its own UI module
- **Real-time Data** - Live data feeds from connected backend services
- **Interactive Dashboards** - Beautiful, responsive dashboards for each module
- **Centralized Management** - Single workspace to manage all your backend workflows
- **Client-side Calculations** - Complementary calculations that run in the browser
- **Health Monitoring** - Real-time health checks for all connected backends
- **Extensible Framework** - Easy to add new backend services and modules

## 🛠️ Current Modules

### Weather Module ✅ **Active**
- **Backend**: [Weather-Forecasting Calculator](https://github.com/tomskija/Weather-Forcasting)
- **Features**: Real-time weather data, 7-day forecasts, weather alerts, climate analysis
- **Calculations**: Heat index, wind chill, dew point, comfort analysis

### Future Modules 🔮 **Planned**
- **Finance Module**: Financial analysis and portfolio management
- **ML Module**: Machine learning model training and inference
- **Analytics Module**: Advanced data analytics and reporting

## 🏗️ Architecture

```
UI-Workspace/
├── src/
│   ├── workSpaceCalcs/          # Client-side calculations
│   │   ├── weather/            # Weather-specific calculations
│   │   ├── shared/            # Shared calculation utilities
│   │   └── index.ts           # Calculation manager
│   ├── components/
│   │   ├── shared/            # Reusable UI components
│   │   ├── weather/          # Weather module components
│   │   └── WorkspaceDashboard.tsx  # Main dashboard
│   ├── lib/
│   │   ├── api/              # API clients for backends
│   │   │   ├── manager.ts    # Generic API manager
│   │   │   └── weather.ts    # Weather API client
│   │   └── config/           # Workspace configuration
│   └── pages/
│       ├── weather/          # Weather module pages
│       ├── dashboard/        # Workspace dashboard
│       └── index.tsx         # Main entry point
```

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Running backend services (e.g., Weather-Forecasting on port 8000)
- Docker (optional, for containerized development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tomskija/UI-Workspace.git
cd UI-Workspace
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your backend URLs:
```env
# Workspace configuration
NEXT_PUBLIC_WORKSPACE_NAME=UI-Workspace
NEXT_PUBLIC_ENABLE_MULTI_BACKEND=true

# Weather backend (primary example)
NEXT_PUBLIC_WEATHER_API_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_WEATHER_MODULE=true

# Future backends
# NEXT_PUBLIC_FINANCE_API_URL=http://localhost:8001
# NEXT_PUBLIC_ENABLE_FINANCE_MODULE=false
```

4. **Start development server**
```bash
npm run dev
```

5. **Access the workspace**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Backend Configuration

The workspace uses a centralized configuration system to manage multiple backends:

```typescript
// Example configuration from src/lib/config/workspace.ts
const config = {
  backends: {
    weather: {
      name: "Weather-Forecasting",
      url: "http://localhost:8000",
      enabled: true,
      features: ["forecasting", "alerts", "historical"]
    }
    // Add more backends here
  }
};
```

### Module Management

Enable/disable modules through environment variables:

```env
# Module toggles
NEXT_PUBLIC_ENABLE_WEATHER_MODULE=true
NEXT_PUBLIC_ENABLE_FINANCE_MODULE=false
NEXT_PUBLIC_ENABLE_ML_MODULE=false

# Feature flags
NEXT_PUBLIC_ENABLE_CROSS_MODULE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SHARED_CALCULATIONS=true
```

## 🔧 Configuration

### Backend Configuration

The workspace uses a centralized configuration system to manage multiple backends:

```typescript
// Automatic configuration from environment variables
const config = {
  backends: {
    weather: {
      name: "Weather-Forecasting",
      url: "http://localhost:8000",
      enabled: true,
      features: ["forecasting", "alerts", "historical"]
    }
    // Add more backends here
  }
};
```

### Module Management

Enable/disable modules through environment variables:

```env
# Module toggles
NEXT_PUBLIC_ENABLE_WEATHER_MODULE=true
NEXT_PUBLIC_ENABLE_FINANCE_MODULE=false
NEXT_PUBLIC_ENABLE_ML_MODULE=false

# Feature flags
NEXT_PUBLIC_ENABLE_CROSS_MODULE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SHARED_CALCULATIONS=true
```

## 🚀 Adding New Backend Services

### 1. Create Backend Service
Ensure your Python backend follows the expected API structure:
```python
# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": "..."}

# Module-specific endpoints
@app.get("/your-module/data")
def get_data():
    return {"data": "..."}
```

### 2. Configure Environment
Add your backend to `.env.local`:
```env
NEXT_PUBLIC_YOUR_MODULE_API_URL=http://localhost:8001
NEXT_PUBLIC_ENABLE_YOUR_MODULE=true
```

### 3. Create API Client
Create `src/lib/api/your-module.ts`:
```typescript
import { apiManager } from './manager';

export class YourModuleApiClient {
  private backendKey = 'your-module';
  
  async getData(): Promise<any> {
    const response = await apiManager.get(this.backendKey, '/your-module/data');
    return response.data;
  }
}
```

### 4. Create UI Components
Create your module components in `src/components/your-module/`

### 5. Add Module Configuration
Update `src/lib/config/workspace.ts` with your module definition.

## 🧮 Client-Side Calculations

The workspace includes a powerful calculation system for client-side processing:

```typescript
import { calculate } from '@/workSpaceCalcs';

// Weather calculations
const heatIndex = await calculate({
  module: 'weather',
  type: 'heat_index', 
  data: { temperature: 30, humidity: 80 }
});

// Future: Finance calculations
const portfolioRisk = await calculate({
  module: 'finance',
  type: 'portfolio_risk',
  data: { holdings: [...], timeframe: '1y' }
});
```

## 🐳 Docker Development

### Using Docker Compose
```bash
# Development with hot reload
npm run docker:dev

# Production build
npm run docker:prod
```

### Multi-Backend Stack
```yaml
# docker-compose.yml example
version: '3.8'
services:
  ui-workspace:
    build: .
    ports: ["3000:3000"]
  weather-backend:
    # Your Weather-Forecasting backend
  finance-backend:
    # Your future finance backend
```

## 📊 Monitoring & Health Checks

The workspace continuously monitors all connected backends:

- **Real-time health checks** for all backends
- **Connection status indicators** in the UI  
- **Automatic retry logic** for failed requests
- **Performance monitoring** for API calls

## 🧪 Testing

```bash
# Run all tests
npm test

# Test with coverage
npm run test:coverage

# Test specific module
npm test -- --testPathPattern=weather
```

## 🌐 Deployment

## 🌐 Deployment

### Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Deploy to Vercel** (Recommended)
```bash
npm install -g vercel
vercel --prod
```

3. **Set environment variables** in Vercel dashboard
```env
NEXT_PUBLIC_WORKSPACE_NAME=UI-Workspace
NEXT_PUBLIC_WEATHER_API_URL=https://your-weather-backend.com
NEXT_PUBLIC_ENABLE_WEATHER_MODULE=true
NEXT_PUBLIC_APP_ENV=production
```

### Docker Deployment

```bash
# Build and push to GitHub Container Registry
docker build -t ghcr.io/tomskija/ui-workspace:latest .
docker push ghcr.io/tomskija/ui-workspace:latest

# Deploy to cloud providers:
# - AWS ECS/Fargate
# - Google Cloud Run  
# - Azure Container Instances
# - DigitalOcean App Platform
```

### Multi-Environment Setup
- **Development**: Local backends on different ports
- **Staging**: Staging backend URLs  
- **Production**: Production backend URLs

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/new-module`)
3. **Add your backend integration**
4. **Test your changes** (`npm test`)
5. **Submit a pull request**

### Adding a New Module

1. Create API client in `src/lib/api/`
2. Add components in `src/components/your-module/`
3. Create pages in `src/pages/your-module/`
4. Add calculations in `src/workSpaceCalcs/your-module/`
5. Update workspace configuration
6. Add tests and documentation

## 📈 Roadmap

### Short Term
- ✅ Weather module (completed)
- 🔄 Finance module (in development)
- 🔄 Enhanced error handling
- 🔄 WebSocket support for real-time updates

### Long Term  
- 🔮 ML/AI module for model training and inference
- 🔮 Analytics module for data visualization
- 🔮 Plugin system for third-party integrations
- 🔮 Mobile application companion

## 🔧 API Documentation

### Workspace Endpoints
```bash
GET /api/health              # Overall health check
GET /api/modules             # List enabled modules  
GET /api/backends            # Backend status
POST /api/calculate          # Client-side calculations
```

### Module Integration
Each backend should implement:
- `GET /health` - Health check
- Module-specific endpoints
- CORS headers for frontend access

## ⚡ Performance

- **Bundle size**: Optimized with tree shaking
- **Loading times**: Code splitting by module
- **Caching**: React Query for efficient data fetching
- **Real-time updates**: WebSocket connections where supported

## 🛡️ Security

- **Environment variables** for sensitive configuration
- **CORS validation** for backend connections
- **Input sanitization** for all user inputs
- **Error boundaries** to prevent crashes

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/tomskija/UI-Workspace/issues)
- **Weather Backend**: [Weather-Forcasting Issues](https://github.com/tomskija/Weather-Forcasting/issues)
- **Documentation**: Check module-specific README files
- **Discord**: [Join our Discord](https://discord.gg/your-discord) (if applicable)

## 🔗 Related Repositories

- **[Weather-Forcasting](https://github.com/tomskija/Weather-Forcasting)** - Python weather forecasting backend
- **Future Finance Backend** - Coming soon
- **Future ML Backend** - Coming soon

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Weather data provided by connected backend services
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started Checklist

- [ ] Clone the repository
- [ ] Install Node.js 18+
- [ ] Set up environment variables
- [ ] Start your backend services
- [ ] Run `npm install && npm run dev`
- [ ] Access http://localhost:3000
- [ ] Verify backend connections in the dashboard
- [ ] Explore the weather module
- [ ] Plan your next backend integration!

---

**Ready to scale your Python backends with a professional UI? This workspace grows with your projects! 🌟**# UI Workspace

A modern, modular React/Next.js frontend workspace designed to connect with multiple Python backend services. Currently supports [Weather Forecasting Calculator](https://github.com/tomskija/Weather-Forcasting) with architecture ready for additional backend integrations.

## 🚀 Features

- **Multi-Backend Architecture** - Seamlessly connect to multiple Python backend services
- **Modular Design** - Each backend service gets its own UI module
- **Real-time Data** - Live data feeds from connected backend services
- **Interactive Dashboards** - Beautiful, responsive dashboards for each module
- **Centralized Management** - Single workspace to manage all your backend workflows
- **Client-side Calculations** - Complementary calculations in `workSpaceCalcs/` directory
- **Health Monitoring** - Real-time health checks for all connected backends
- **Extensible Framework** - Easy to add new backend services and modules

## 🛠️ Current Modules

### Weather Module ✅ **Active**
- **Backend**: [Weather-Forcasting Calculator](https://github.com/tomskija/Weather-Forcasting)
- **Features**: Real-time weather data, 7-day forecasts, weather alerts, climate analysis
- **Calculations**: Heat index, wind chill, dew point, comfort analysis

### Future Modules 🔮 **Planned**
- **Finance Module**: Financial analysis and portfolio management
- **ML Module**: Machine learning model training and inference
- **Analytics Module**: Advanced data analytics and reporting

## 🏗️ Architecture

```
UI-Workspace/
├── src/
│   ├── workSpaceCalcs/          # Client-side calculations
│   │   ├── weather/            # Weather-specific calculations
│   │   ├── shared/            # Shared calculation utilities
│   │   └── index.ts           # Calculation manager
│   ├── components/
│   │   ├── shared/            # Reusable UI components
│   │   ├── weather/          # Weather module components
│   │   └── WorkspaceDashboard.tsx  # Main dashboard
│   ├── lib/
│   │   ├── api/              # API clients for backends
│   │   │   ├── manager.ts    # Generic API manager
│   │   │   └── weather.ts    # Weather API client
│   │   └── config/           # Workspace configuration
│   └── pages/
│       ├── weather/          # Weather module pages
│       └── index.tsx         # Main workspace entry
```# Weather Forecasting UI

A modern, responsive React/Next.js frontend for the Weather Forecasting Calculator backend.

## 🚀 Features

- **Real-time Weather Data** - Live weather conditions and forecasts
- **Interactive Dashboard** - Beautiful, responsive weather dashboard
- **Location Search** - Search and switch between locations
- **7-Day Forecast** - Extended weather predictions with charts
- **Weather Alerts** - Important weather warnings and notifications
- **Mobile Responsive** - Works perfectly on all devices
- **Dark Mode** - Beautiful gradient design with glass morphism
- **Performance Optimized** - Fast loading with Next.js optimizations

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and state management
- **Recharts** - Beautiful weather data visualization
- **Lucide Icons** - Modern icon library
- **Axios** - HTTP client for API communication

## 📦 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Running Weather Forecasting Calculator backend

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-username/weather-forecasting-ui.git
cd weather-forecasting-ui
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_ENV=development
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Development

1. **Using Docker Compose**
```bash
# Development with hot reload
docker-compose --profile development up weather-ui-dev

# Production build
docker-compose --profile production up weather-ui-prod
```

2. **Using Docker directly**
```bash
# Build the image
docker build -t weather-ui .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  weather-ui
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect to Vercel**
```bash
npm install -g vercel
vercel login
vercel --prod
```

2. **Set environment variables in Vercel dashboard:**
- `NEXT_PUBLIC_API_URL`: Your backend API URL
- `NEXT_PUBLIC_APP_ENV`: production

3. **Deploy**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Connect repository to Netlify**
2. **Set build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Set environment variables:**
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - `NEXT_PUBLIC_APP_ENV`: production

### Option 3: AWS Amplify

1. **Connect GitHub repository**
2. **Use amplify.yml build specification**
3. **Set environment variables in Amplify console**

### Option 4: Docker on Cloud

1. **Push to GitHub Container Registry**
```bash
# Build and tag
docker build -t ghcr.io/your-username/weather-ui:latest .

# Push to registry
docker push ghcr.io/your-username/weather-ui:latest
```

2. **Deploy to cloud provider:**
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**

## 🔧 Configuration

### Environment Variables

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_WORKSPACE_NAME` | Workspace display name | `UI-Workspace` | No |
| `NEXT_PUBLIC_WEATHER_API_URL` | Weather backend URL | `http://localhost:8000` | Yes* |
| `NEXT_PUBLIC_ENABLE_WEATHER_MODULE` | Enable weather module | `true` | No |
| `NEXT_PUBLIC_ENABLE_MULTI_BACKEND` | Enable multi-backend mode | `true` | No |
| `NEXT_PUBLIC_APP_ENV` | Environment | `development` | No |

*Required if weather module is enabled

### Future Backend Variables
```env
# Add these when you create new backend services
NEXT_PUBLIC_FINANCE_API_URL=http://localhost:8001
NEXT_PUBLIC_ENABLE_FINANCE_MODULE=true

NEXT_PUBLIC_ML_API_URL=http://localhost:8002  
NEXT_PUBLIC_ENABLE_ML_MODULE=true
```

### API Integration

The frontend connects to your Weather Forecasting Calculator backend via REST API:

**Required Backend Endpoints:**
- `GET /weather/current?location={location}` - Current weather
- `GET /weather/forecast?location={location}&days={days}` - Forecast
- `GET /weather/alerts?location={location}` - Weather alerts
- `GET /health` - Health check

### Customization

**Colors and Theming:**
- Edit `tailwind.config.js` for custom colors
- Modify gradient backgrounds in components
- Customize glass morphism effects

**API Client:**
- Update `src/lib/api.ts` for additional endpoints
- Modify types for your data structure
- Add authentication if needed

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📊 Performance

- **Lighthouse Score**: 95+ for Performance, Accessibility, Best Practices, SEO
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Optimized with tree shaking and code splitting
- **Image Optimization**: Next.js automatic image optimization

## 🔒 Security

- **Content Security Policy** - Prevents XSS attacks
- **HTTPS Only** - All production traffic encrypted
- **Environment Variables** - Sensitive data protected
- **Input Sanitization** - User inputs validated and sanitized

## 🌍 Browser Support

- Chrome 70+
- Firefox 70+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 API Documentation

### Weather Dashboard Integration

The UI automatically integrates with your Weather Forecasting Calculator backend:

```typescript
// Example API usage
import { weatherApi } from '@/lib/api';

// Get current weather
const weather = await weatherApi.getCurrentWeather('New York');

// Get 7-day forecast
const forecast = await weatherApi.getForecast('New York', 7);
```

### Component Structure

```
src/
├── components/
│   ├── WeatherDashboard.tsx    # Main dashboard component
│   ├── WeatherCard.tsx         # Weather display card
│   └── ForecastChart.tsx       # Temperature chart
├── lib/
│   ├── api.ts                  # API client and types
│   └── utils.ts                # Utility functions
├── pages/
│   └── index.tsx               # Main page
└── styles/
    └── globals.css             # Global styles
```

## 🚀 Production Deployment Checklist

- [ ] Backend API is deployed and accessible
- [ ] Environment variables are set correctly
- [ ] CORS is configured on backend for your domain
- [ ] SSL certificate is configured
- [ ] Performance monitoring is set up
- [ ] Error tracking is configured (Sentry recommended)
- [ ] CDN is configured for static assets

## 🆘 Troubleshooting

**API Connection Issues:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS configuration on backend
- Ensure backend is running and accessible

**Build Failures:**
- Check Node.js version (18+ required)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Performance Issues:**
- Enable production optimizations
- Check bundle analyzer: `npm run analyze`
- Optimize images and fonts

## 📞 Support

- Create an issue for bugs or feature requests
- Check backend repository for API-related issues
- Review Next.js documentation for framework issues

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.