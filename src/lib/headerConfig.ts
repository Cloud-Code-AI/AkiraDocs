interface NavItem {
  label: string;
  href: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

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
  showSearch?: boolean;
  searchPlaceholder?: string;
  navItems?: NavItem[];
  socialLinks?: SocialLink[];
};

export function getHeaderConfig(): HeaderConfig {
  // Using require.context to get the config file
  const context = require.context('../../_contents', false, /_config\.json$/);
  const configPath = context.keys()[0];
  const config = context(configPath);

  // Return only the header-related config
  return {
    logo: config.header?.logo,
    title: config.header?.title,
    showSearch: config.header?.showSearch,
    searchPlaceholder: config.header?.searchPlaceholder,
    navItems: config.header?.navItems,
    socialLinks: config.header?.socialLinks,
  };
}
