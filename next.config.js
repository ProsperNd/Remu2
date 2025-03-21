/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'placehold.co'],
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Add external dependencies that need special handling
    if (isServer) {
      config.externals = [...(config.externals || []), 
        'firebase-admin',
        '@prisma/client',
        'prisma'
      ];
    }

    // Handle specific packages that might cause issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert/'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        'firebase-admin': false
      };
    }

    return config;
  },
  // Transpile specific modules
  transpilePackages: [
    '@heroicons/react',
    '@headlessui/react',
    'react-hot-toast',
    'framer-motion'
  ],
  experimental: {
    // Enable modern build optimizations
    optimizeCss: true,
    optimizePackageImports: [
      '@heroicons/react',
      '@headlessui/react',
      'react-icons',
      'date-fns',
      'lodash'
    ]
  }
}

module.exports = nextConfig 