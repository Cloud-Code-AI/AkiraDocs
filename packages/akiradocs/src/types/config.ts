interface NavItem {
    label: string;
    href: string;
    show?: boolean;
  }
  
  interface SocialLink {
    name: string;
    url: string;
    icon: string;
  }
  
  interface Logo {
    path: string;
    width: number;
    height: number;
    show?: boolean;
  }
  
  
  interface DescriptionConfig {
    text: string;
    show: boolean;
  }
  
  export interface HeaderConfig {
    logo?: Logo;
    title?: string;
    showSearch?: boolean;
    searchPlaceholder?: string;
    navItems?: NavItem[];
    socialLinks?: SocialLink[];
    languages?: {
      defaultLocale: string;
      locales: {
        code: string;
        name: string;
        flag: string;
      }[];
    };
    currentLocale?: string;
    currentType?: string;
  }
  
  export interface FooterConfig {
    companyName: string;
    socialLinks: SocialLink[];
  }
  
  export interface SearchConfig {
    logo?: Logo;
    title?: string;
    showTitle?: boolean;
    description?: string;
  }
  
  export interface Metadata {
    title?: string;
    description?: string;
  }