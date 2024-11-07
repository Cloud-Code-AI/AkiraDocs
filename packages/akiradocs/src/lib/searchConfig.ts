import { getAkiradocsConfig } from "./getAkiradocsConfig";

type SearchConfig = {
    logo?: {
        path: string;
        width: number;
        height: number;
        show: boolean;
    };
    title?: {
        text: string;
        show: boolean;
    };
    description?: {
        text: string;
        show: boolean;
    };
};


export function getSearchConfig(): SearchConfig {
    const config = getAkiradocsConfig();
    return {
        logo: config.search?.logo,
        title: config.search?.title,
        description: config.search?.description,
    };
}
