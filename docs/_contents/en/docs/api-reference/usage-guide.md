---
author: Akira Team
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: API Reference
keywords:
  - API
  - Documentation
  - Integration
---

# API Documentation Guide

Learn how to generate comprehensive API documentation using AkiraDocs.

## Quick Start

### Upload API Spec
1. Place your OpenAPI/Swagger spec in:
```
_contents/{language_code}/api/apiSpec.json
```

2. AkiraDocs automatically generates documentation.

### Example API Spec
```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Sample API",
    "version": "1.0.0"
  },
  "paths": {
    "/users": {
      "get": {
        "summary": "Get users",
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    }
  }
}
```

## Generated Documentation

### Automatic Features
- Interactive API explorer
- Code samples in multiple languages
- Request/response examples
- Authentication documentation

### Example Output
```javascript
// Example: Get Users
const response = await fetch('https://api.example.com/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});

const users = await response.json();
```

## Customization

### Theme Options
```json
{
  "api": {
    "docs": {
      "theme": "dark",
      "syntaxHighlight": true,
      "showExamples": true
    }
  }
}
```

### Language Selection
```json
{
  "api": {
    "examples": {
      "languages": ["javascript", "python", "curl"]
    }
  }
}
```