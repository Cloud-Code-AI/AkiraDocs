---
author: Akira Team
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: Internationalization
keywords:
  - i18n
  - Setup
  - Languages
---

# Setting Up Internationalization

Configure AkiraDocs for multiple languages with AI-powered translation support.

## Quick Setup

### Basic Configuration
Add language settings to `akiradocs.config.json`:

```json
{
  "localization": {
    "defaultLocale": "en",
    "fallbackLocale": "en",
    "locales": [
      {
        "code": "en",
        "name": "English",
        "flag": "�🇸"
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
      }
    ]
  },
  "translation": {
    "auto_translate": true,
    "provider": "anthropic",
    "targetLanguages": ["es", "fr", "de"],
    "excludedPaths": ["_meta.json"]
  }
}
```

### Directory Structure
```
docs/
├── _contents/
│   ├── en/           # Source language
│   │   └── docs/
│   ├── es/           # Spanish translation
│   │   └── docs/
│   └── fr/           # French translation
│       └── docs/
```

## Configuration Options

### Language Settings
- `defaultLocale`: Primary content language
- `fallbackLocale`: Fallback when translation missing
- `locales`: Available language configurations

### Translation Settings
- `auto_translate`: Enable/disable automatic translation
- `provider`: AI translation provider
- `targetLanguages`: Languages to translate into
- `excludedPaths`: Files to skip during translation
