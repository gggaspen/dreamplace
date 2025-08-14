/**
 * Webpack Configuration Helpers
 * Utilities for optimizing code splitting and bundle analysis
 */

import type { NextConfig } from 'next';

export interface CodeSplittingConfig {
  enableSplitChunks?: boolean;
  chunkSizeWarning?: number;
  maxChunks?: number;
  vendorChunkStrategy?: 'single' | 'multiple' | 'auto';
}

export function createWebpackConfig(config: CodeSplittingConfig = {}): NextConfig['webpack'] {
  const {
    enableSplitChunks = true,
    chunkSizeWarning = 250000, // 250KB
    maxChunks = 50,
    vendorChunkStrategy = 'auto'
  } = config;

  return (webpackConfig, { buildId, dev, isServer }) => {
    // Only apply optimizations in production
    if (!dev && !isServer && enableSplitChunks) {
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: maxChunks,
          maxAsyncRequests: maxChunks,
          cacheGroups: {
            // Vendor chunk strategy
            vendor: vendorChunkStrategy !== 'auto' ? {
              test: /[\\/]node_modules[\\/]/,
              name: vendorChunkStrategy === 'single' ? 'vendor' : false,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            } : undefined,

            // Framework chunks (React, Next.js, etc.)
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              name: 'framework',
              chunks: 'all',
              priority: 20,
              reuseExistingChunk: true,
              enforce: true
            },

            // UI library chunks
            ui: {
              test: /[\\/]node_modules[\\/](@chakra-ui|framer-motion|react-spring)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 15,
              reuseExistingChunk: true
            },

            // Utility libraries
            utils: {
              test: /[\\/]node_modules[\\/](lodash|date-fns|ramda)[\\/]/,
              name: 'utils',
              chunks: 'all',
              priority: 12,
              reuseExistingChunk: true
            },

            // Authentication libraries
            auth: {
              test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
              name: 'auth',
              chunks: 'all',
              priority: 12,
              reuseExistingChunk: true
            },

            // Default chunk for remaining modules
            default: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true
            }
          }
        }
      };

      // Performance hints
      webpackConfig.performance = {
        ...webpackConfig.performance,
        maxAssetSize: chunkSizeWarning,
        maxEntrypointSize: chunkSizeWarning * 2,
        hints: 'warning'
      };
    }

    // Bundle analyzer (optional)
    if (process.env.ANALYZE === 'true') {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
      webpackConfig.plugins = webpackConfig.plugins || [];
      webpackConfig.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: `../analysis/bundle-analysis-${isServer ? 'server' : 'client'}.html`
        })
      );
    }

    return webpackConfig;
  };
}

// Utility for creating chunk names based on route patterns
export function createChunkNameMapping(): Record<string, string> {
  return {
    // Authentication routes
    'pages/login': 'auth-login',
    'pages/register': 'auth-register',
    'pages/forgot-password': 'auth-forgot-password',

    // User routes
    'pages/dashboard': 'user-dashboard',
    'pages/profile': 'user-profile',
    'pages/settings': 'user-settings',

    // Admin routes
    'pages/admin': 'admin-dashboard',
    'pages/admin/users': 'admin-users',
    'pages/admin/events': 'admin-events',
    'pages/admin/settings': 'admin-settings',

    // Artist routes
    'pages/artist': 'artist-dashboard',
    'pages/artist/profile': 'artist-profile',
    'pages/artist/events': 'artist-events',

    // Feature routes
    'pages/events': 'events',
    'pages/artists': 'artists',
    'pages/analytics': 'analytics',
    'pages/reports': 'reports'
  };
}

// Helper to generate route-based magic comments for dynamic imports
export function createRouteImport(routePath: string, chunkName?: string): string {
  const finalChunkName = chunkName || routePath.replace(/\//g, '-').replace(/^-/, '');
  return `/* webpackChunkName: "${finalChunkName}" */`;
}

// Performance monitoring utilities
export interface BundleMetrics {
  totalBundleSize: number;
  chunkCount: number;
  largestChunk: { name: string; size: number };
  duplicateModules: string[];
}

export function analyzeBundleMetrics(stats: any): BundleMetrics {
  const chunks = stats.chunks || [];
  const assets = stats.assets || [];
  
  const totalBundleSize = assets.reduce((total: number, asset: any) => total + asset.size, 0);
  const chunkCount = chunks.length;
  
  const largestChunk = chunks.reduce(
    (largest: any, chunk: any) => {
      const chunkSize = chunk.files?.reduce((size: number, file: string) => {
        const asset = assets.find((a: any) => a.name === file);
        return size + (asset?.size || 0);
      }, 0) || 0;
      
      return chunkSize > largest.size ? { name: chunk.name, size: chunkSize } : largest;
    },
    { name: '', size: 0 }
  );

  // Simple duplicate detection (would need more sophisticated logic in practice)
  const duplicateModules: string[] = [];
  const moduleMap = new Map<string, number>();
  
  chunks.forEach((chunk: any) => {
    chunk.modules?.forEach((module: any) => {
      const count = moduleMap.get(module.name) || 0;
      moduleMap.set(module.name, count + 1);
      if (count === 1) {
        duplicateModules.push(module.name);
      }
    });
  });

  return {
    totalBundleSize,
    chunkCount,
    largestChunk,
    duplicateModules
  };
}