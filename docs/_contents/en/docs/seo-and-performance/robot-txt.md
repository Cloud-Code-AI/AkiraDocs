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

Guide to customizing and managing your robots.txt file in AkiraDocs.

## Default Configuration

### Basic robots.txt
```txt
User-agent: *
Allow: /
Sitemap: https://yourdocs.com/sitemap.xml

# Private sections
Disallow: /admin/
Disallow: /private/
```

## Customization

### Configuration Options
```json
{
  "seo": {
    "robots": {
      "enabled": true,
      "autoGenerate": true,
      "custom": {
        "disallow": ["/internal/", "/draft/"],
        "allow": ["/public/"],
        "crawlDelay": 10
      }
    }
  }
}
```
