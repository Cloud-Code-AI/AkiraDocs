---
author: Akira Team
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: Installation
keywords:
  - Installation
  - Setup
  - Deployment
---

# Detailed Installation Guide

Complete guide to installing AkiraDocs in different environments.

## Prerequisites

Ensure your system meets the [requirements](../getting-started/requirements.md) before proceeding.

## Installation Methods

### 1. Local Development Setup

1. **Create New Project**
```bash
npx create-akiradocs@latest my-docs-site
cd my-docs-site
```

2. **Install Dependencies**
Dependencies are automatically installed during project creation. If you need to reinstall:
```bash
npm install
```

3. **Create Environment File**
The environment file is created automatically. You can modify it at `.env.local`

4. **Start Development Server** 
```bash
npm run dev
```

5. **Update AkiraDocs**
To update an existing installation to the latest version:
```bash
npx create-akiradocs@latest update
```

### 3. Cloud Platform Deployment

#### Vercel
1. Fork the repository
2. Connect to Vercel
3. Configure environment variables
4. Deploy

#### Other Platforms
- AWS Amplify (Coming Soon)
- Netlify (Coming Soon)
- Digital Ocean (Coming Soon)
- Custom server (Coming Soon)

## Post-Installation Steps

1. **Verify Installation**
```bash
npm run build
npm run start
```

2. **Configure Git Integration**
```bash
git remote add origin your-repository-url
```

3. **Setup Content Directory**
```bash
mkdir -p docs/_contents/en
```

## Environment-Specific Configurations

### Development
```env
NODE_ENV=development
DEBUG=true
```

### Production
```env
NODE_ENV=production
DEBUG=false
```

### Testing
```env
NODE_ENV=test
TEST_MODE=true
```
