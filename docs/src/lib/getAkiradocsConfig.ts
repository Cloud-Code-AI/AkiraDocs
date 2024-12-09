import config from '../../akiradocs.config.json' assert { type: 'json' };
import { AkiraDocsConfig } from '@/types/AkiraConfigType';

export function getAkiradocsConfig(): AkiraDocsConfig {
    return config as AkiraDocsConfig;
}