/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.json$/,
        type: 'json',
      })
      config.module.rules.push({
        test: /\.md$/,
        type: 'md',
      })
      return config
    },
  };

export default nextConfig;
