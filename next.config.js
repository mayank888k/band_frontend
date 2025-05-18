/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  swcMinify: true,
  // Performance optimizations
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
    // Remove console statements in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Improve dev server startup time
  onDemandEntries: {
    // Keep pages in memory for longer to reduce rebuilding frequency
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Enable Fast Refresh
      config.experiments = { 
        ...config.experiments, 
        topLevelAwait: true 
      };
    }
    
    // Fix buildHttp configuration if it exists
    if (config.experiments && config.experiments.buildHttp) {
      config.experiments.buildHttp = {
        allowedUris: [/^https?:\/\//]
      };
    }
    
    // Reduce bundle size
    if (!dev) {
      config.optimization.minimize = true;
      // Add additional optimizations for production
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 80000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
  // Optimize output
  output: 'standalone',
};

module.exports = nextConfig;