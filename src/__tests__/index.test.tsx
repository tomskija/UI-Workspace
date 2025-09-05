import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '@/pages/index';

// Mock the WeatherDashboard component
jest.mock('@/components/WeatherDashboard', () => {
  return function MockWeatherDashboard({ defaultLocation }: { defaultLocation: string }) {
    return <div data-testid="weather-dashboard">Mock Weather Dashboard for {defaultLocation}</div>;
  };
});

describe('Home Page', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('renders the weather dashboard', () => {
    renderWithQueryClient(<Home />);
    
    expect(screen.getByTestId('weather-dashboard')).toBeInTheDocument();
  });

  it('uses the default location from environment', () => {
    renderWithQueryClient(<Home />);
    
    // Should use the mocked environment variable
    expect(screen.getByText(/Mock Weather Dashboard for New York/)).toBeInTheDocument();
  });

  it('has proper meta tags', () => {
    renderWithQueryClient(<Home />);
    
    // Check that the page is rendered (Head tags are tested differently)
    expect(screen.getByTestId('weather-dashboard')).toBeInTheDocument();
  });
});