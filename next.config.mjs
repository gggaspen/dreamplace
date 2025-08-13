import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING,
    NEXT_PUBLIC_ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING,
    NEXT_PUBLIC_WEB_VITALS_ENDPOINT: process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT,
    NEXT_PUBLIC_CSP_NONCE: process.env.NEXT_PUBLIC_CSP_NONCE,
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
    optimizePackageImports: ["@chakra-ui/react"],
  },
  webpack: (config, { dev }) => {
    // Bundle optimization
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all',
        },
        chakra: {
          test: /[\\/]node_modules[\\/]@chakra-ui[\\/]/,
          name: 'chakra-ui',
          priority: 10,
          chunks: 'all',
        },
        framer: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: 'framer-motion',
          priority: 10,
          chunks: 'all',
        },
      },
    };

    // Tree shaking optimization
    config.resolve.alias = {
      ...config.resolve.alias,
      'lodash': 'lodash-es',
    };

    // Compression and minification for production
    if (!dev) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Performance budgets
      config.performance = {
        maxAssetSize: 250000, // 250KB
        maxEntrypointSize: 500000, // 500KB
        hints: 'warning',
      };
    }

    return config;
  },
  images: {
    disableStaticImages: true, // Deshabilita la optimización de imágenes
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dreamplace.com.ar",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "https://dreamplace-production.up.railway.app/",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
  // reactStrictMode: false,
};

export default withBundleAnalyzer(nextConfig);
