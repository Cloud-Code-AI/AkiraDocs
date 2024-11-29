---
author: Akira Team
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: Internationalization
keywords:
  - AI Translation
  - Automation
  - Language Processing
---

# AI-Powered Translation

Guide to using AkiraDocs' AI translation capabilities.

## Setup

### Configuration
```json
{
  "translation": {
    "auto_translate": true,
    "provider": "anthropic",
    "model": "claude-3-sonnet-20240229",
    "targetLanguages": ["es", "fr", "de"],
    "excludedPaths": ["_meta.json"]
  }
}
```

### API Setup
```env
ANTHROPIC_API_KEY=your_api_key
```

## Features

### Automatic Translation
- Content translation during build
- Context-aware translations
- Technical term preservation
- Format maintenance

