type Logo = {
    path: string;
    width: number;
    height: number;
    show: boolean;
  };
  
  type Favicon = {
    path: string;
    show: boolean;
  };
  
  type Title = {
    text: string;
    show: boolean;
  };
  
  type NavItem = {
    label: string;
    href: string;
    icon: string;
    show: boolean;
  };
  
  type SocialLink = {
    name: string;
    url: string;
    icon: string;
  };
  
  type Locale = {
    code: string;
    name: string;
    flag: string;
  };
  
  type Languages = {
    defaultLocale: string;
    locales: Locale[];
    fallbackLocale: string;
  };
  
  type AkiraDocsConfig = {
    title: string;
    description: string;
    header: {
      logo: Logo;
      favicon: Favicon;
      title: Title;
      searchPlaceholder: string;
      navItems: NavItem[];
    };
    footer: {
      companyName: string;
      socialLinks: SocialLink[];
    };
    languages: Languages;
  };
  
  export type { AkiraDocsConfig };