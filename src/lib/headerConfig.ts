type HeaderConfig = {
  logo?: {
    path: string;
    width: number;
    height: number;
  };
  title?: {
    text: string;
    show: boolean;
  };
};

export function getHeaderConfig(): HeaderConfig {
  // Using require.context to get the config file
  const context = require.context('../../_content', false, /_config\.json$/);
  const configPath = context.keys()[0];
  const config = context(configPath);

  // Return only the header-related config
  return {
    logo: config.logo,
    title: config.title,
  };
}