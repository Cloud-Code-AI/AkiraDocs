import config from '../../akiradocs.config.json' assert { type: 'json' };
import { AkiraDocsConfig, SupportedProvider } from '@/types/AkiraConfigType';

export function getAkiradocsConfig(): AkiraDocsConfig {
    // Cast the entire config to AkiraDocsConfig since we know it matches the shape
    return config as AkiraDocsConfig;
}