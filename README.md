# AkiraDocs

**Smart documentation platform with AI at its core**  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
  [![Demo Live](https://img.shields.io/badge/Demo-Live-color.svg)](https://demo.akiradocs.ai)  
  [![Join Waitlist](https://img.shields.io/badge/Join-Waitlist-orange.svg)](https://forms.gle/KunU4BGhToH4NJ1t7)  

## 🚀 Get Started
To create a new AkiraDocs project using the OSS template, run:

```bash
npx create-akiradocs <optional folder name>
```

## 🎯 Why Choose AkiraDocs?
- **For Developers**:
  - Keep your existing Markdown/Git workflow
  - Full Markdown/MDX support
  - Easy custom component development

- **For Content Teams**:
  - User-friendly WYSIWYG editor
  - Real-time previews, no coding required

- **For Enterprises**:
  - SSO/SAML integration
  - Audit logs and custom deployment options

## 😟 Common Documentation Challenges
- Keeping documentation in sync across teams
- Managing multiple versions of documents
- Needing better analytics for documentation usage

## 🎭 Use Cases
- **Developer Documentation**: API references, SDK guides, implementation examples.
- **Product Documentation**: User guides, release notes, tutorials.
- **Enterprise Knowledge**: Internal wikis, process documentation.

## 🚀 Migrate Existing Docs (Coming Soon)
Easily bring your documentation from various sources:

```bash
npx akiradocs-migrate import --from=source --to=mydocs

 Supported sources:
 ✓ Markdown/MDX files 
 ✓ GitBook 
 ✓ Docusaurus 
 ✓ ReadTheDocs 
 ✓ Confluence 
 ✓ Notion 
```

## 📄 SEO Optimized by Default
Every page is automatically optimized for search engines:
- SEO-friendly URLs and auto-generated meta tags
- Mobile-first indexing and fast performance

## ✍️ Modern Block-Based Editor
Create documentation with ease:
- Rich text blocks, images, diagrams, and code blocks
- Collapsible sections and reusable content blocks

## 🌐 Multi-Language Support (Coming Soon)
Reach a global audience with:
- AI-powered translation suggestions
- Side-by-side translation editor

## 💪 Setup and Translate
Set up environment variables for translation:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Configure target languages in `akiradocs.config.json`:

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

Run the translation command:

```bash
npm run translate
```

## 📄 Licensing
- **MIT License**: Free for open source and personal projects.
- **Commercial License**: Available for enterprise features.

## 🤝 Join Our Community
- [Discord Community](https://discord.gg/zvYZukgeH2)
- [GitHub Discussions](https://github.com/akiradocs/discussions)
- [Documentation](https://docs.akiradocs.com)
- [Join the Waitlist](https://forms.gle/KunU4BGhToH4NJ1t7) → Early access to upcoming features  

---

  [Get Started](https://docs.akiradocs.ai/quickstart) •  
  [Live Demo](https://demo.akiradocs.ai) •  
  [Enterprise Trial](https://akiradocs.com/enterprise) (Coming Q1 2025)  
