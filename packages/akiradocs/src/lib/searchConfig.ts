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

declare var require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): any;
};

export function getSearchConfig(): SearchConfig {
    const context = require.context('../../_contents', false, /_config\.json$/);
    const configPath = context.keys()[0];
    const config = context(configPath);

    return {
        logo: config.search?.logo,
        title: config.search?.title,
        description: config.search?.description,
    };
}
