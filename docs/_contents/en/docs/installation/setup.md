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

1. **Clone the Repository**
```bash
git clone https://github.com/your-org/akira-docs-template
cd akira-docs-template
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create Environment File**
```bash
cp .env.example .env.local
```

4. **Configure Environment Variables**
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_SITE_URL=your_site_url
```

### 2. Docker Installation

1. **Pull the Docker Image**
```bash
docker pull akiradocs/akiradocs:latest
```

2. **Run the Container**
```bash
docker run -p 3000:3000 akiradocs/akiradocs:latest
```

### 3. Cloud Platform Deployment

#### Vercel
1. Fork the repository
2. Connect to Vercel
3. Configure environment variables
4. Deploy

#### Other Platforms
- AWS Amplify
- Netlify
- Digital Ocean
- Custom server

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

## Next Steps
- [Configuration Guide](./configuration.md)
- [Troubleshooting](./troubleshooting.md)