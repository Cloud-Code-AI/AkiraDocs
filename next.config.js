/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/docs',
        permanent: true, // Set to false if you want temporary redirect (307) instead of permanent (308)
      },
    ];
  },
};

module.exports = nextConfig; 