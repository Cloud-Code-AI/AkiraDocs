/** @type {import('next').NextConfig} */
// import MillionLint from "@million/lint";

const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.json$/,
        type: 'json',
      })
      return config
    },
    // i18n: {
    //   locales: ['en', 'es', 'fr', 'de'],
    //   defaultLocale: 'en',
    //   localeDetection: false
    // },
  };

export default nextConfig;
// export default MillionLint.next({ rsc: true })(nextConfig);
