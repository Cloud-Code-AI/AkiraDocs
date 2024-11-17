import config from '../../akiradocs.config.json';
import { AkiraDocsConfig } from 'akiradocs-types';

export function getAkiradocsConfig(): AkiraDocsConfig {
    return config;
}