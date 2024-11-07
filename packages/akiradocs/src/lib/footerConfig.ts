  import { getAkiradocsConfig } from "./getAkiradocsConfig";
  interface SocialLink {
    name: string;
    url: string;
    icon: string;
  }
  
  type FooterConfig = {
    companyName: string;
    socialLinks: SocialLink[];
  };
  declare var require: {
    context(
      directory: string,
      useSubdirectories: boolean,
      regExp: RegExp
    ): any;
  };
  export function getFooterConfig(): FooterConfig {
    // Using require.context to get the config file
    const config = getAkiradocsConfig();
  
    // Return only the header-related config
    return {
        companyName: config.footer?.companyName,
        socialLinks: config.footer?.socialLinks,
    };
  }
  