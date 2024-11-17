import { getAkiradocsConfig } from "./getAkiradocsConfig";
import { HeaderConfig } from "akiradocs-types";


export function getHeaderConfig(): HeaderConfig {
  const config = getAkiradocsConfig();

  return {
    logo: config.branding.logo,
    title: config.site.title,
    showSearch: true,
    searchPlaceholder: config.navigation.header.searchPlaceholder,
    navItems: config.navigation.header.items,
    socialLinks: config.footer?.socialLinks,
    languages: config.localization,
    currentLocale: config.localization.defaultLocale,
  };
}
