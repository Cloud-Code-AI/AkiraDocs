import { getAkiradocsConfig } from "./getAkiradocsConfig";
import { NavItem } from "../types/navigation";
import { HeaderConfig } from "../types/config";


export function getHeaderConfig(): HeaderConfig {
  const config = getAkiradocsConfig();
  const languages = config.languages;
  // Filter out AI Search from nav items if disabled
  const filteredNavItems = config.header?.navItems?.filter((item: NavItem) => {
    if (item.path === '/aiSearch') {
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
    languages: languages,
    currentLocale: config.languages?.defaultLocale,
  };
}
