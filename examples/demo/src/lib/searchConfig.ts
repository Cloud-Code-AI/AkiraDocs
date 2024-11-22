import { getAkiradocsConfig } from "./getAkiradocsConfig";
import { SearchConfig } from "../types/config";

export function getSearchConfig(): SearchConfig {
    const config = getAkiradocsConfig();
    return {
        logo: config.branding.logo,
        title: config.site.title,
        showTitle: config.navigation.header.title.show,
        description: config.site.description,
    };
}
