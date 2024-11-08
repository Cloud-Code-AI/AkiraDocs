  import { getAkiradocsConfig } from "./getAkiradocsConfig";
  import { FooterConfig } from '../types/config';

  export function getFooterConfig(): FooterConfig {
    // Using require.context to get the config file
    const config = getAkiradocsConfig();
  
    // Return only the header-related config
    return {
        companyName: config.footer?.companyName,
        socialLinks: config.footer?.socialLinks,
    };
  }
  