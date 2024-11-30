// Basic sitemap generator example
import { writeFileSync, readFileSync } from 'fs';
import { globSync } from 'glob';
import path from 'path';

// Read config file
const config = JSON.parse(readFileSync('./akiradocs.config.json', 'utf8'));
let BASE_URL = config.url || '';

// Ensure BASE_URL has proper https:// or http:// prefix
if (!BASE_URL.startsWith('http://') && !BASE_URL.startsWith('https://')) {
  BASE_URL = `https://${BASE_URL}`;
}

const pages = globSync('compiled/**/*.json')
  .map(file => {
    const route = file
      .replace('compiled/', '')
      .replace('.json', '')
      .replace(/\/index$/, '');
    return `${BASE_URL}/${route}`;
  });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(url => `
    <url>
      <loc>${url}</loc>
    </url>
  `).join('')}
</urlset>`;

writeFileSync('public/sitemap.xml', sitemap);
console.log('Sitemap generated successfully'); 