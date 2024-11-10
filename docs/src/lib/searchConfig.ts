import { getAkiradocsConfig } from "./getAkiradocsConfig";
import { SearchConfig } from "../types/config";

export function getSearchConfig(): SearchConfig {
    const config = getAkiradocsConfig();
    return {
        logo: config.search?.logo,
        title: config.search?.title,
        description: config.search?.description,
    };
}
