---
author: Akira Team
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: Internationalization
keywords:
  - Translation Management
  - Content Localization
  - Workflow
---

# Managing Translations

Learn how to effectively manage and maintain translated content in AkiraDocs.

## Translation Workflow

### Automatic Translation
1. Create content in source language
2. Enable auto-translation in config
3. Build/deploy to generate translations
4. Review and refine translations

### Manual Translation
1. Create language-specific directories
2. Copy source content
3. Translate manually
4. Update metadata

## Content Organization

### File Structure
```
_contents/
├── en/
│   └── docs/
│       ├── intro.md
│       └── guide.md
├── es/
│   └── docs/
│       ├── intro.md
│       └── guide.md
└── fr/
    └── docs/
        ├── intro.md
        └── guide.md
```

### Translation Status Tracking
```json
{
  "translationStatus": {
    "es": {
      "completion": "85%",
      "lastUpdated": "2024-11-26",
      "pendingFiles": ["advanced/config.md"]
    }
  }
}
```

## Quality Control

### Review Process
1. AI Translation
2. Human Review
3. Technical Verification
4. Publication

### Version Control
- Track changes across languages
- Maintain synchronization
- Handle updates efficiently
