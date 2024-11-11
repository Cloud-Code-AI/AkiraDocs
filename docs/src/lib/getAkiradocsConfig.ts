import config from '../../akiradocs.config.json';
import { AkiraDocsConfig } from '@/types/AkiraConfigType';

export function getAkiradocsConfig(): AkiraDocsConfig {
    return config;
}