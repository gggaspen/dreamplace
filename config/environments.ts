export interface EnvironmentConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    analytics: boolean;
    performanceMonitoring: boolean;
    errorReporting: boolean;
  };
  performance: {
    bundleAnalysis: boolean;
    webVitalsEndpoint?: string;
  };
  security: {
    cspNonce?: string;
  };
}

const development: EnvironmentConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337',
    timeout: 10000,
  },
  features: {
    analytics: false,
    performanceMonitoring: true,
    errorReporting: true,
  },
  performance: {
    bundleAnalysis: process.env.ANALYZE === 'true',
    webVitalsEndpoint: process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT,
  },
  security: {
    cspNonce: process.env.NEXT_PUBLIC_CSP_NONCE,
  },
};

const production: EnvironmentConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 5000,
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    performanceMonitoring: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
    errorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
  },
  performance: {
    bundleAnalysis: false,
    webVitalsEndpoint: process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT,
  },
  security: {
    cspNonce: process.env.NEXT_PUBLIC_CSP_NONCE,
  },
};

const testing: EnvironmentConfig = {
  api: {
    baseUrl: 'http://localhost:3001',
    timeout: 5000,
  },
  features: {
    analytics: false,
    performanceMonitoring: false,
    errorReporting: false,
  },
  performance: {
    bundleAnalysis: false,
  },
  security: {},
};

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return production;
    case 'test':
      return testing;
    default:
      return development;
  }
};

export const env = getEnvironmentConfig();
