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
  const context = require.context('../../_contents', false, /_config\.json$/);
  const configPath = context.keys()[0];
  const config = context(configPath);

  // Filter out AI Search from nav items if disabled
  const filteredNavItems = config.header?.navItems?.filter(item => {
    if (item.href === '/aiSearch') {
      return config.aiSearch === true;
    }
    return true;
  });

  return {
    logo: config.header?.logo,
    title: config.header?.title,
    showSearch: config.header?.showSearch,
    searchPlaceholder: config.header?.searchPlaceholder,
    navItems: filteredNavItems,
    socialLinks: config.header?.socialLinks,
  };
}
