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
  
  export type Locale = {
    code: string;
    name: string;
    flag: string;
  };
  
  type Localization = {
    defaultLocale: string;
    locales: Locale[];
    fallbackLocale: string;
  };
  
  type Site = {
    title: string;
    description: string;
    url: string;
  };
  
  type Branding = {
    logo: Logo;
    favicon: Favicon;
  };
  
  type Navigation = {
    header: {
      title: Title;
      searchPlaceholder: string;
      items: NavItem[];
    };
  };

  type Features = {
    textToSpeech: boolean;
  };


type SupportedProvider = 'openai' | 'anthropic' | 'google' | 'azure'

type RewriteSettings = {
  model?: string;
  temperature?: number;
  azureDeploymentName?: string;
}

type Rewrite = {
  provider: SupportedProvider;
  settings?: RewriteSettings;
}
  
  type AkiraDocsConfig = {
    site: Site;
    branding: Branding;
    navigation: Navigation;
    footer: {
      companyName: string;
      socialLinks: SocialLink[];
    };
    localization: Localization;
    features: Features;
    rewrite?: Rewrite;
  };
  
  export type { AkiraDocsConfig, SupportedProvider };