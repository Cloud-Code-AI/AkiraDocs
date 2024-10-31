# AkiraDocs Template

<div align="center">

🚀 A modern, AI-powered documentation platform frontend with dynamic UI and in-app editing capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

## ✨ Features

### Core Features
- 📝 **In-App Content Editor**: Edit documentation directly in the browser with real-time preview
- 🎨 **Dynamic UI Components**: Interactive components that bring your documentation to life
- 🎯 **Live Preview**: See changes instantly as you edit
- 📱 **Responsive Design**: Perfect viewing experience across all devices
- 🔗 **Backend Integration**: Seamless integration with AkiraDocs Backend for advanced features [Coming Soon]

### Coming Soon
- 🔄 **Version Control**: Built-in documentation versioning
- 👥 **Multi-User Collaboration**: Real-time collaborative editing
- 🎨 **Theme Studio**: Visual theme customization interface
- 🔌 **Plugin System**: Extend functionality with custom plugins

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm or yarn
- AkiraDocs Backend (for full functionality)

### Installation

```bash
# Clone the template repository
git clone https://github.com/yourusername/akiradocs.git

# Navigate to project
cd akiradocs

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your backend API URL

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your documentation site.

## 📖 Project Structure

```
akiradocs/
├── _contents/               # Example documentation
├── src/
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   │   ├── content/        # Content-related components
│   │   └── ui/            # UI components
│   ├── lib/               # Frontend utilities
│   ├── types/             # Frontend type definitions
│   └── config/           # Frontend configuration
├── public/
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Content**: MDX
- **Backend Integration**: REST API with TypeScript interfaces

## 🔗 Backend Integration [Optional]

This is a standalone template like nextradocs but if you want to enable more features you can use our backend repo.
This template is designed to work with [AkiraDocs Backend](https://github.com/Cloud-Code-AI/akiradocs-backend) for full functionality. The integration includes:

- Smart content recommendations
- Automated content summarization
- Question-answering capabilities
- Document similarity analysis
- Pre-configured API interfaces
- Type-safe API communication
- Analytics integration
- Search functionality

### Environment Variables [OPTIONAL]

Required environment variables for backend integration:

```
NEXT_PUBLIC_API_URL=http://localhost:8000  # Your backend API URL
```

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

- [Website](https://akiradocs.ai)
- [Documentation](https://docs.akiradocs.ai)
- [Backend Repository](https://github.com/Cloud-Code-AI/akiradocs-backend)
- [Discord Community](https://discord.gg/6qfmtSUMdb)

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

---

<div align="center">
Made with ❤️ by the Cloud Code AI Team
</div>