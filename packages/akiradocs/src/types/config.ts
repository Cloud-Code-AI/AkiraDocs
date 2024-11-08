interface NavItem {
    label: string;
    href: string;
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
  
  interface TitleConfig {
    text: string;
    show: boolean;
  }
  
  interface DescriptionConfig {
    text: string;
    show: boolean;
  }
  
  export interface HeaderConfig {
    logo?: Logo;
    title?: TitleConfig;
    showSearch?: boolean;
    searchPlaceholder?: string;
    navItems?: NavItem[];
    socialLinks?: SocialLink[];
  }
  
  export interface FooterConfig {
    companyName: string;
    socialLinks: SocialLink[];
  }
  
  export interface SearchConfig {
    logo?: Logo;
    title?: TitleConfig;
    description?: DescriptionConfig;
  }
  
  export interface Metadata {
    title?: string;
    description?: string;
  }