# create-akiradocs

Create Akira Docs documentation sites with one command.

## Usage 
```bash
npx create-akiradocs mydocs
```

## Features

- 📝 Block-based content editing
- 🎨 Customizable themes
- 🔍 AI-powered search
- 📱 Responsive design
- ⚡ Next.js based
- 🎯 SEO optimized

## Requirements

- Node.js 16 or later

## Creating a Project

1. Create a new project:
   ```bash
   npx create-akiradocs@latest my-docs
   ```

2. Navigate to the project:
   ```bash
   cd my-docs
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Updating a Project

To update an existing Akira Docs site to the latest version:

```bash
npx update-akiradocs
```

This will update your project while preserving your content and configuration files.
```

Now users can update their existing Akira Docs sites using:
```bash
npx update-akiradocs
```

This implementation:
1. Preserves user content by ignoring `_contents`, `contents`, and `akiradocs.config.json`
2. Updates all other files with the latest template
3. Provides a simple command-line interface
4. Shows progress with a spinner and clear success/error messages
5. Maintains the same code style and structure as the existing codebase

The update command will copy the latest template files while preserving user-specific content and configuration files.

## Documentation

For detailed documentation, visit [docs.akiradocs.com](https://docs.akiradocs.com)

## License

MIT