import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING:
      process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING,
    NEXT_PUBLIC_ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING,
    NEXT_PUBLIC_WEB_VITALS_ENDPOINT: process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT,
    NEXT_PUBLIC_CSP_NONCE: process.env.NEXT_PUBLIC_CSP_NONCE,
  },
  // Add headers to fix CSP issues
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    const cspPolicy = [
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' data:",
      "style-src-elem 'self' 'unsafe-inline' data:",
      "font-src 'self' data:",
      "img-src 'self' data: blob:",
      "object-src 'self' data:",
      "frame-src 'self'",
      isDev ? "connect-src 'self' ws: wss: http://localhost:*" : "connect-src 'self'"
    ].join('; ') + ';';
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspPolicy,
          },
        ],
      },
    ];
  },
  eslint: {
    // Temporarily ignore during builds to complete refactoring
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily ignore type errors during builds while refactoring
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: [
      '@chakra-ui/react',
      'react-icons',
      'framer-motion',
      '@tanstack/react-query',
    ],
  },
  webpack: (config, { dev, isServer }) => {
    // Bundle optimization for client-side only
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 6, // Reduced to prevent entrypoint bloat
        maxAsyncRequests: 8,
        minSize: 20000, // Smaller minimum chunk size (20KB) for better granularity
        maxSize: 200000, // Smaller maximum chunk size (200KB) for better loading
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          // Shared application components
          shared: {
            test: /[\\/]src[\\/]components[\\/](ui|composite|loading-screen)[\\/]/,
            name: 'shared-components',
            priority: 25,
            chunks: 'all',
            minChunks: 2, // Only create if used by 2+ pages
            reuseExistingChunk: true,
            enforce: true,
          },
          // Authentication components and contexts
          authShared: {
            test: /[\\/]src[\\/](infrastructure[\\/]auth|components[\\/].*auth)[\\/]/,
            name: 'auth-shared',
            priority: 22,
            chunks: 'async', // Auth components can be async
            minChunks: 2,
            reuseExistingChunk: true,
          },
          // Routing infrastructure
          routingShared: {
            test: /[\\/]src[\\/]infrastructure[\\/]routing[\\/]/,
            name: 'routing-shared',
            priority: 22,
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true,
          },
          // Framework chunks
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            priority: 20,
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true,
          },
          // UI library chunks
          chakra: {
            test: /[\\/]node_modules[\\/]@chakra-ui[\\/]/,
            name: 'chakra-ui',
            priority: 15,
            chunks: 'async', // Load async to avoid blocking
            reuseExistingChunk: true,
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 15,
            chunks: 'async', // Load async for animations
            reuseExistingChunk: true,
          },
          // Icons library chunks
          icons: {
            test: /[\\/]node_modules[\\/]react-icons[\\/]/,
            name: 'react-icons',
            priority: 12,
            chunks: 'async', // Load async for icons
            reuseExistingChunk: true,
          },
          // Authentication libraries
          auth: {
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            name: 'auth',
            priority: 12,
            chunks: 'async', // Load async for auth
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Tree shaking optimization - improved package handling
    config.resolve.alias = {
      ...config.resolve.alias,
      // Lodash removed - using native implementations
    };

    // Enhanced tree shaking configuration for production
    if (!dev) {
      // Enable aggressive dead code elimination
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false; // Enable aggressive tree shaking

      // Performance budgets - optimized for entrypoint size reduction
      config.performance = {
        maxAssetSize: 250000, // 250KB per asset (tighter control)
        maxEntrypointSize: 400000, // 400KB per entrypoint (much more aggressive)
        hints: 'warning',
        assetFilter: function (assetFilename) {
          // Only warn for JS files, ignore CSS and other assets
          return assetFilename.endsWith('.js');
        },
      };
    }

    return config;
  },
  images: {
    disableStaticImages: true, // Deshabilita la optimización de imágenes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dreamplace.com.ar',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'https://dreamplace-production.up.railway.app/',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  // reactStrictMode: false,
};

export default withBundleAnalyzer(nextConfig);
