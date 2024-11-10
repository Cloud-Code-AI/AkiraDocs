/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.json$/,
        type: 'json',
      })
      return config
    },
    async rewrites() {
      return process.env.NODE_ENV === 'production'
        ? []
        : [
            { source: '/api/files', destination: '/api/files' },
            { source: '/editor/:slug*', destination: '/editor/[...slug]' },
          ];
    },
  };

export default nextConfig;
