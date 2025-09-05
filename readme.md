# Weather Forecasting UI Workspace

A modern, responsive React/Next.js frontend for the [Weather Forecasting Calculator](https://github.com/tomskija/Weather-Forcasting) backend. This UI provides an intuitive dashboard for real-time weather data, forecasts, and analytics.

## 🚀 Features

- **Real-time Weather Data** - Live weather conditions and forecasts from the Python backend
- **Interactive Dashboard** - Beautiful, responsive weather dashboard with charts and visualizations
- **Location Search** - Search and switch between global locations
- **7-Day Forecast** - Extended weather predictions with interactive charts
- **Weather Alerts** - Important weather warnings and notifications from the backend
-# Weather Forecasting UI

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

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_ENV` | Environment | `development` |

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