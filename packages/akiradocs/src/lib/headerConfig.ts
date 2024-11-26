import { getAkiradocsConfig } from "./getAkiradocsConfig";
import { HeaderConfig } from "../types/config";
import { useTranslation } from "@/hooks/useTranslation";
export function getHeaderConfig(): HeaderConfig {
  const config = getAkiradocsConfig();
  const { t } = useTranslation();
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
    searchPlaceholder: t('common.labels.search'),
    navItems: navItems,
    socialLinks: config.footer?.socialLinks,
    languages: config.localization,
    currentLocale: config.localization.defaultLocale,
  };
}
