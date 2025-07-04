const webpack = require('webpack');

module.exports = {
  images: {
    domains: [
      'localhost',
      'lh3.googleusercontent.com', // For Google auth avatars
      'avatars.githubusercontent.com', // For GitHub auth
      'avatar.vercel.sh' // For guest user avatars
    ],
    minimumCacheTTL: 60,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      dns: require.resolve('node-libs-browser/mock/dns'), // Polyfill dns module
      tls: false, // Disable tls module in the browser
    };

    return config;
  },
};
