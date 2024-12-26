/** @type {import('next').NextConfig} */
// import MillionLint from "@million/lint";

const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.json$/,
        type: 'json',
      });
      config.resolve.alias = {
        ...config.resolve.alias,
        "sharp$": false,
        "onnxruntime-node$": false,
      }
      return config
    },
    experimental: {
      esmExternals: true // Enable ES modules
    },
    // i18n: {
    //   locales: ['en', 'es', 'fr', 'de'],
    //   defaultLocale: 'en',
    //   localeDetection: false
    // },
  };

export default nextConfig;
// export default MillionLint.next({ rsc: true })(nextConfig);
