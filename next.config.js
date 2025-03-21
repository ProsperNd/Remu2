/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'placehold.co', 'firebasestorage.googleapis.com', 'localhost'],
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Add external dependencies that need special handling
    if (isServer) {
      config.externals = [...(config.externals || []), 
        'firebase-admin',
        '@prisma/client',
        'prisma',
        'chart.js',
        'undici'
      ];
    }

    // Handle specific packages that might cause issues
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        http2: false,
        'undici': false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
        'process/browser': require.resolve('process/browser'),
        'firebase-admin': false,
        canvas: false
      };

      // Add module rules for specific file types
      config.module.rules.push({
        test: /node_modules\/undici\/.*\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-proposal-private-methods',
            '@babel/plugin-proposal-class-properties'
          ]
        }
      });
    }

    return config;
  },
  // Transpile specific modules
  transpilePackages: [
    '@heroicons/react',
    '@headlessui/react',
    'react-hot-toast',
    'framer-motion',
    'chart.js',
    'react-chartjs-2',
    'undici'
  ],
  experimental: {
    // Enable modern build optimizations
    optimizeCss: true,
    optimizePackageImports: [
      '@heroicons/react',
      '@headlessui/react',
      'react-icons',
      'date-fns',
      'lodash',
      'chart.js'
    ]
  }
}

module.exports = nextConfig 