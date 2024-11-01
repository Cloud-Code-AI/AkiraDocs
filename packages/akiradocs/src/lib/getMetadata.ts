type Metadata = {
    title?: string,
    description?: string
};

export function getMetadata(): Metadata {
    const context = require.context('../../_contents', false, /_config\.json$/);
    const configPath = context.keys()[0];
    const config = context(configPath);

    return {
        title: config.title ?? "Akira Docs",
        description: config.description ?? "Next-Gen Documentation",
    };
}
