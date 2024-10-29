# AkiraDocs

<div align="center">

🚀 A modern, AI-powered documentation platform with dynamic UI and in-app editing capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

## ✨ Features

### Core Features
- 📝 **In-App Content Editor**: Edit documentation directly in the browser with real-time preview
- 🎨 **Dynamic UI Components**: Interactive components that bring your documentation to life
- 🤖 **AI-Powered Assistance**: Smart suggestions and content improvements
- 🎯 **Live Preview**: See changes instantly as you edit
- 📱 **Responsive Design**: Perfect viewing experience across all devices

### Coming Soon
- 🔄 **Version Control**: Built-in documentation versioning
- 👥 **Multi-User Collaboration**: Real-time collaborative editing
- 🔍 **Smart Search**: AI-enhanced documentation search
- 🎨 **Theme Studio**: Visual theme customization interface
- 🔌 **Plugin System**: Extend functionality with custom plugins
- 📊 **Analytics Dashboard**: Track documentation usage and engagement
- 🌐 **Internationalization**: Built-in translation management

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/akiradocs.git

# Navigate to project
cd akiradocs

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your documentation site.

## 📖 Documentation

For detailed documentation, visit our [official docs](https://docs.akiradocs.com).

## 🛠️ Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Content**: MDX
- **Database**: [Your DB choice]
- **AI Integration**: [AI Platform]

## 🤝 Contributing

We love our contributors! Check out our [Contributing Guide](CONTRIBUTING.md) to get started.

### Development Process
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

AkiraDocs is [MIT licensed](LICENSE).

## 💖 Support

If you find AkiraDocs helpful, please consider:
- Starring the repository
- Sharing it with others
- Contributing to the project

## 🔗 Links

- [Website](https://akiradocs.com)
- [Documentation](https://docs.akiradocs.com)
- [GitHub](https://github.com/yourusername/akiradocs)
- [Discord Community](https://discord.gg/akiradocs)

## Content Migration

### Migrating Existing Content

You can easily migrate content from existing blogs or documentation sites using our built-in scraper utility. The scraper will:
- Download and process your content
- Extract structured data including title, description, and content blocks
- Download and organize associated images
- Generate a `_meta.json` file for navigation
- Save content in the proper format for this platform

#### Usage

Run the scraper using `tsx`:

```bash
tsx src/utils/scraper.ts [options]

Options:
  -l, --urls   Array of specific URLs to scrape
  -t, --type   Content type (e.g., 'articles', 'docs')
```

#### Example

To migrate a single blog post:

```bash
tsx src/utils/scraper.ts \
  -l https://blogs.cloudcode.ai/posts/UnderstandingQ4GGUFModelCompression \
  -t articles 
```

This will:
1. Scrape the specified blog post
2. Save the content to `_contents/articles/`
3. Download images to `public/images/`
4. Update the meta file at `_contents/articles/_meta.json`

#### Multiple URLs

You can scrape multiple URLs by passing them as a space-separated list:

```bash
tsx src/utils/scraper.ts \
  -l "https://blogs.cloudcode.ai/post1 https://blogs.cloudcode.ai/post2" \
  -t articles
```

The scraped content will maintain its original structure while being converted to the platform's format, making it ready to use immediately.

---

<div align="center">
Made with ❤️ by the Cloud Code AI Team
</div>
