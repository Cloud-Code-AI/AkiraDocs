// Basic sitemap generator example
import { writeFileSync, readFileSync } from 'fs';
import { globSync } from 'glob';

// Read config file and parse JSON
const config = JSON.parse(readFileSync('./akiradocs.config.json', 'utf8'));
const BASE_URL = config.site.url;  // Get URL from config

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