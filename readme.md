# UI Workspace

A modern, modular React/Next.js frontend workspace designed to connect with multiple Python backend services. Currently supports [Weather Forecasting Calculator](https://github.com/tomskija/Weather-Forcasting) with architecture ready for additional backend integrations.

## 🚀 Features

- **Multi-Backend Architecture** - Connect to multiple Python backend services
- **Modular Design** - Each backend service gets its own UI module
- **Real-time Data** - Live data feeds from connected backend services  
- **Interactive Dashboards** - Beautiful, responsive dashboards for each module
- **Centralized Management** - Single workspace to manage all your backend workflows
- **Client-side Calculations** - Complementary calculations in `workSpaceCalcs/` directory
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

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Running [Weather-Forecasting Calculator](https://github.com/tomskija/Weather-Forcasting) backend
- Docker (optional)

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

Edit `.env.local`:
```env
# Workspace configuration
NEXT_PUBLIC_WORKSPACE_NAME=UI-Workspace
NEXT_PUBLIC_ENABLE_MULTI_BACKEND=true

# Weather backend
NEXT_PUBLIC_WEATHER_API_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_WEATHER_MODULE=true
```

4. **Start development server**
```bash
npm run dev
```

5. **Access the workspace**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

```
UI-Workspace/
├── src/
│   ├── workSpaceCalcs/          # Client-side calculations
│   │   ├── weather/            # Weather-specific calculations
│   │   ├── shared/            # Shared calculation utilities
│   │   └── index.ts           # Calculation manager
│   ├── components/
│   │   ├── WorkspaceDashboard.tsx  # Main workspace dashboard
│   │   ├── weather/          # Weather module components
│   │   └── shared/           # Reusable UI components
│   ├── lib/
│   │   ├── api/              # API clients for backends
│   │   │   ├── manager.ts    # Generic API manager
│   │   │   └── weather.ts    # Weather API client
│   │   └── config/           # Workspace configuration
│   └── pages/
│       ├── weather/          # Weather module pages
│       └── index.tsx         # Main workspace entry
```

## 🔧 Adding New Backend Services

### 1. Configure Environment
Add your backend to `.env.local`:
```env
NEXT_PUBLIC_YOUR_MODULE_API_URL=http://localhost:8001
NEXT_PUBLIC_ENABLE_YOUR_MODULE=true
```

### 2. Create API Client
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

### 3. Update Workspace Config
Add your module to `src/lib/config/workspace.ts`

### 4. Create UI Components  
Add components in `src/components/your-module/`

## 🐳 Docker Development

```bash
# Development with hot reload
npm run docker:dev

# Production build  
npm run docker:prod
```

## 🧮 Client-Side Calculations

```typescript
import { calculate } from '@/workSpaceCalcs';

// Weather calculations
const heatIndex = await calculate({
  module: 'weather',
  type: 'heat_index',
  data: { temperature: 30, humidity: 80 }
});
```

## 📊 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_WORKSPACE_NAME` | Workspace display name | `UI-Workspace` | No |
| `NEXT_PUBLIC_WEATHER_API_URL` | Weather backend URL | `http://localhost:8000` | Yes* |
| `NEXT_PUBLIC_ENABLE_WEATHER_MODULE` | Enable weather module | `true` | No |
| `NEXT_PUBLIC_ENABLE_MULTI_BACKEND` | Multi-backend mode | `true` | No |

*Required if weather module is enabled

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard:
```env
NEXT_PUBLIC_WEATHER_API_URL=https://your-weather-backend.com
NEXT_PUBLIC_WORKSPACE_NAME=UI-Workspace
```

### Docker Deployment
```bash
docker build -t ghcr.io/tomskija/ui-workspace:latest .
docker push ghcr.io/tomskija/ui-workspace:latest
```

## 🧪 Testing

```bash
npm test                    # Run tests
npm run test:coverage       # Coverage report  
npm run type-check         # TypeScript validation
npm run workspace:health   # Check backend connections
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-module`)
3. Add your backend integration
4. Test your changes
5. Submit a pull request

## 📈 Roadmap

- ✅ Weather module (completed)
- 🔄 Finance module (planned)
- 🔄 ML/AI module (planned)  
- 🔄 Analytics module (planned)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/tomskija/UI-Workspace/issues)
- **Weather Backend**: [Weather-Forcasting Issues](https://github.com/tomskija/Weather-Forcasting/issues)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Ready to scale your Python backends with a professional UI workspace! 🌟**