import { getAkiradocsConfig } from "./getAkiradocsConfig";
import { Metadata } from "../types/config";

export function getMetadata(): Metadata {
    const config = getAkiradocsConfig();

    return {
        title: config.title ?? "Akira Docs",
        description: config.description ?? "Next-Gen Documentation",
    };
}
