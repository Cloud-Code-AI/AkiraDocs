#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ContentService } from './services/ContentService';

async function main() {
    const argv = await yargs(hideBin(process.argv))
        .option('url', {
            alias: 'u',
            type: 'string',
            description: 'Documentation site URL to scrape',
            demandOption: true
        })
        .option('urls', {
            alias: 'l',
            type: 'array',
            description: 'List of specific URLs to scrape'
        })
        .option('type', {
            alias: 't',
            type: 'string',
            description: 'Content type (docs, blogs, etc.)',
            default: 'docs'
        })
        .option('output', {
            alias: 'o',
            type: 'string',
            description: 'Output directory',
            default: '_contents'
        })
        .help()
        .parseAsync();

    if (!argv.url) {
        throw new Error('URL is required');
    }

    const scraper = new ContentService(argv.url, argv.urls as string[] || [], argv.type);
    await scraper.buildMetaStructure(argv.url, argv.output);
    await scraper.saveMetaJson();
}

main().catch(console.error);