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

### Advanced Rules
```txt
# Custom crawl rate
User-agent: Googlebot
Crawl-delay: 10

# Allow specific bot
User-agent: Bingbot
Allow: /public/
Disallow: /private/

# Block specific bot
User-agent: BadBot
Disallow: /
```

## Best Practices

1. **Access Control**
   - Block sensitive content
   - Allow public content
   - Manage crawl rates

2. **Performance**
   - Optimize crawl budget
   - Prevent unnecessary indexing
   - Monitor bot behavior

3. **Maintenance**
   - Regular updates
   - Verify syntax
   - Test configuration