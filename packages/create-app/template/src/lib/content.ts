import { initializeContent } from 'akiradocs-core'

declare let require: {
  context(directory: string, useSubdirectories: boolean, regExp: RegExp): any;
};

const contentContext = require.context('../../_contents/', true, /\.(json|md)$/)
const config = contentContext('./_config.json')

// Initialize the content system
initializeContent(contentContext, config)

export { contentContext, config } 