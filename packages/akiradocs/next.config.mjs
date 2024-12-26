/** @type {import('next').NextConfig} */
// import MillionLint from "@million/lint";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

      config.resolve.alias['@huggingface/transformers'] = path.resolve(__dirname, 'node_modules/@huggingface/transformers');

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
