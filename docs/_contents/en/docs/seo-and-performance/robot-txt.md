---
author: Akira Team
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: SEO & Performance
keywords:
  - SEO
  - Robots.txt
  - Crawling
---

# Robots.txt Configuration

The robots.txt file is automatically generated during the build process and can be found in the `public` folder of your project.

## Default Configuration

### Basic robots.txt
```txt
User-agent: *
Allow: /
Sitemap: https://docs.akiradocs.com/sitemap.xml

# Private sections
Disallow: /admin/
Disallow: /private/
```
