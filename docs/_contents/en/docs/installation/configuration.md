---
author: Akira Team
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: Installation
keywords:
  - Configuration
  - Settings
  - Setup
---

# Configuration Guide

Complete guide to configuring your AkiraDocs installation.

## Core Configuration

### Site Configuration
Edit `akiradocs.config.json`:

```json
{
    "url": "https://docs.akiradocs.com",
    "site": {
        "title": "Your Docs",
        "description": "Your documentation description"
    },
    "branding": {
        "logo": {
            "path": "/your_logo.svg",
            "width": 120,
            "height": 30,
            "show": true
        },
        "favicon": {
            "path": "/favicon.png",
            "show": true
        }
    }
}
```

### Navigation Setup
```json
{
    "navigation": {
        "header": {
            "items": [
                { "label": "Docs", "href": "/docs", "icon": "/docs.svg" },
                { "label": "API", "href": "/api", "icon": "/api.svg" }
            ]
        }
    }
}
```

## Internationalization

### Language Configuration
```json
{
    "localization": {
        "defaultLocale": "en",
        "fallbackLocale": "en",
        "locales": [
            {
                "code": "en",
                "name": "English",
                "flag": "🇺🇸"
            },
            {
                "code": "es",
                "name": "Español",
                "flag": "🇪🇸"
            },
            {
                "code": "fr",
                "name": "Français",
                "flag": "🇫🇷"
            },
            {
                "code": "de",
                "name": "Deutsch",
                "flag": "🇩🇪"
            }
        ]
    },
     "translation": {
        "auto_translate": true,
        "provider": "anthropic",
        "model": "claude-3-sonnet-20240229",
        "targetLanguages": ["es", "fr", "de"],
        "excludedPaths": ["_meta.json"]
    },
}
```

