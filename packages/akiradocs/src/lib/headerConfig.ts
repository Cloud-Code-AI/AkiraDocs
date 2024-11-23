import { getAkiradocsConfig } from "./getAkiradocsConfig";
import { HeaderConfig } from "../types/config";
import { folderExists } from "./content";

export function getHeaderConfig(): HeaderConfig {
  const config = getAkiradocsConfig();
  const navItems = [...config.navigation.header.items];

  // Check if API spec exists
  if (folderExists('en/api')) {
    navItems.push({
      label: "API Reference",
      href: "/apiReference",
      icon: "/api.svg",
      show: true
    });
  }

  return {
    logo: config.branding.logo,
    title: config.site.title,
    showSearch: true,
    searchPlaceholder: config.navigation.header.searchPlaceholder,
    navItems: navItems,
    socialLinks: config.footer?.socialLinks,
    languages: config.localization,
    currentLocale: config.localization.defaultLocale,
  };
}
