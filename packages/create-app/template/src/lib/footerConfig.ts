interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

type FooterConfig = {
  companyName: string;
  socialLinks: SocialLink[];
  madeWithLove: {
    show: boolean;
    team: string;
  };
};
declare let require: {
  context(directory: string, useSubdirectories: boolean, regExp: RegExp): any;
};
export function getFooterConfig(): FooterConfig {
  // Using require.context to get the config file
  const context = require.context('../../_contents', false, /_config\.json$/);
  const configPath = context.keys()[0];
  const config = context(configPath);

  // Return only the header-related config
  return {
    companyName: config.footer?.companyName,
    socialLinks: config.footer?.socialLinks,
    madeWithLove: config.footer?.madeWithLove,
  };
}
