import { getAkiradocsConfig } from "./getAkiradocsConfig";
import { HeaderConfig } from "../types/config";
export function getHeaderConfig(): HeaderConfig {
  const config = getAkiradocsConfig();
  const navItems = [...config.navigation.header.items];

  // Check if API spec exists
  // if (folderExists('en/api')) {
  //   navItems.push({
  //     label: "API Reference",
  //     href: "/apiReference",
  //     icon: "/api.svg",
  //     show: true
  //   });
  // }

  return {
    logo: config.branding.logo,
    title: config.site.title,
    showSearch: true,
    navItems: navItems,
    socialLinks: config.footer?.socialLinks,
    languages: config.localization,
    currentLocale: config.localization.defaultLocale,
  };
}
