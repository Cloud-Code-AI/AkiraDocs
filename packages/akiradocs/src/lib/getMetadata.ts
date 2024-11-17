import { getAkiradocsConfig } from "./getAkiradocsConfig";
import { Metadata } from "akiradocs-types";

export function getMetadata(): Metadata {
    const config = getAkiradocsConfig();

    return {
        title: config.site.title ?? "Akira Docs",
        description: config.site.description ?? "Next-Gen Documentation",
    };
}
