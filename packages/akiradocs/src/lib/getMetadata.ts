import { getAkiradocsConfig } from "./getAkiradocsConfig";

type Metadata = {
    title?: string,
    description?: string
};

declare var require: {
    context(
      directory: string,
      useSubdirectories: boolean,
      regExp: RegExp
    ): any;
  };

export function getMetadata(): Metadata {
    const config = getAkiradocsConfig();

    return {
        title: config.title ?? "Akira Docs",
        description: config.description ?? "Next-Gen Documentation",
    };
}
