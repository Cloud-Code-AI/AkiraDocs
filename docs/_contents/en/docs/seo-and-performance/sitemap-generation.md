---
author: Akira Team
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: SEO & Performance
keywords:
  - SEO
  - Sitemap
  - XML
---

# Automatic Sitemap Generation

Learn how AkiraDocs automatically generates and manages your documentation sitemap.

## Overview

AkiraDocs automatically generates a sitemap.xml file during the build process, ensuring search engines can efficiently crawl your documentation.

## Generated Sitemap Structure

### Example Output
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdocs.com/</loc>
    <lastmod>2024-11-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdocs.com/docs/getting-started</loc>
    <lastmod>2024-11-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```
