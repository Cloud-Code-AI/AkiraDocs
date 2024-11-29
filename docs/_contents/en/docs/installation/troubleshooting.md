---
author: Akira Team
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: Installation
keywords:
  - Troubleshooting
  - Issues
  - Solutions
---

# Troubleshooting Guide

Common issues and their solutions when setting up AkiraDocs.

## Common Installation Issues

### Node.js Version Mismatch

**Problem**: Error about Node.js version compatibility
```bash
Error: The engine "node" is incompatible with this module
```

**Solution**:
1. Check your Node.js version:
```bash
node --version
```
2. Install the correct version (16.x or higher)
3. Use nvm to manage Node.js versions:
```bash
nvm install 20
nvm use 20
```

### Dependencies Installation Failed

**Problem**: npm install fails with errors

**Solution**:
1. Clear npm cache:
```bash
npm cache clean --force
```
2. Delete node_modules and package-lock.json:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Build Issues

### Build Fails

**Problem**: `npm run build` fails

**Solution**:
1. Check for TypeScript errors:
```bash
npm run type-check
```
2. Verify environment variables are set correctly
3. Clear next.js cache:
```bash
rm -rf .next
```

### Static Export Issues

**Problem**: Static export fails with dynamic routes

**Solution**:
1. Configure `next.config.js`:
```js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true
  }
}
```

## Translation Issues

### AI Translation Not Working

**Problem**: Automatic translation fails

**Solution**:
1. Verify API keys are set correctly
2. Check translation configuration:
```json
{
  "translation": {
    "auto_translate": true,
    "provider": "anthropic",
    "targetLanguages": ["es", "fr", "de"]
  }
}
```

## Content Issues

### Content Not Updating

**Problem**: Changes to content files not reflecting

**Solution**:
Content changes are built on build time. If you are using the local development server, you need to restart the server after making changes.
1. Clear the cache:
```bash
npm run clean
```
2. Restart the development server
3. Check file permissions

## Deployment Issues

### Vercel Deployment Failed

**Problem**: Deployment to Vercel fails

**Solution**:
1. Check build logs
2. Verify environment variables are set in Vercel dashboard
3. Ensure all dependencies are listed in package.json

## Getting Help

If you're still experiencing issues:

1. Check our [GitHub Issues](https://github.com/Cloud-Code-AI/Akiradocs/issues)
2. Join our [Discord Community](https://discord.gg/zvYZukgeH2)
3. Contact [Support](mailto:saurav.panda@akiradocs.ai)
