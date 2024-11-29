---
title: Quickstart Guide
author: Akira Team
publishDate: 2024-11-10
modifiedDate: 2024-11-10
category: Getting Started
keywords:
  - Akira Docs
  - Documentation
  - AI
---


# Quick Start Guide

Get up and running with AkiraDocs in minutes.

## Quick Deploy

### Option 1: Deploy with Vercel
The fastest way to get started is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCloud-Code-AI%2Fakiradocs-template)

### Option 2: Using CLI
Create a new project using our CLI:

```bash
npx create-akiradocs@latest my-docs
```

## Basic Setup Steps

1. **Clone the Repository** (if not using Quick Deploy)
```bash
git clone https://github.com/your-org/akira-docs-template
cd akira-docs-template
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Start Development Server**
```bash
npm run dev
# or
yarn dev
```

4. Open `http://localhost:3000` in your browser

## Initial Configuration

1. **Update Site Configuration**
Edit `akiradocs.config.json`:
```json
{
  "site": {
    "title": "Your Docs",
    "description": "Your documentation description"
  }
}
```

2. **Configure Translation** (Optional)
```json
{
  "translation": {
    "auto_translate": true,
    "provider": "anthropic",
    "targetLanguages": ["es", "fr", "de"]
  }
}
```
