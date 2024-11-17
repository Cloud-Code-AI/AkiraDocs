# Contributing to AkiraDocs

Thank you for considering contributing to AkiraDocs! This document will guide you through the contribution process.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Legal Requirements](#legal-requirements)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)
- [Contributing Process](#contributing-process)
- [Community and Support](#community-and-support)

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). All contributors are expected to uphold these guidelines.

## Legal Requirements

### Licensing Structure
This project uses a dual-license model:

1. **MIT License**
   - Applies to all code NOT in folders named 'enterprise' or prefixed with 'enterprise-'
   - Allows free use, modification, and distribution
   - Your contributions to MIT-licensed portions will be licensed under MIT

2. **Commercial License**
   - Applies to all code in folders named 'enterprise' or prefixed with 'enterprise-'
   - Owned by Cloud Code AI Inc.
   - See LICENSE-ENTERPRISE.md for terms
   - Contributions to enterprise portions require additional agreements

Directory Structure:
```
*/enterprise/* -> Commercial License
*/enterprise-*/* -> Commercial License
All other directories -> MIT License
```

For licensing questions, contact licensing@akiradocs.ai

### Contribution License Agreement (CLA)
- All contributors must sign our CLA at [cla-akiradocs](https://gist.github.com/sauravpanda/e2277e2c7be0c677922bde6328d2ad57)
- We offer Individual CLA
- The CLA is required regardless of contribution size
- For corporate contributions, have your legal representative reach out to licensing@akiradocs.ai

## Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/akiradocs.git
   cd akiradocs
   ```

2. **Setup Environment**
   ```bash
   pnpm install
   pnpm compile
   pnpm update --recursive --workspace
   pnpm run dev
   ```

3. **Create Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Project Structure
```
akiradocs/
├── components/     # React components
├── pages/         # Next.js pages
├── styles/        # CSS files
├── lib/           # Utilities
├── public/        # Static assets
└── tests/         # Test files
```

### Coding Standards

#### TypeScript/React
```typescript
// Component Example
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-primary"
    >
      {label}
    </button>
  );
};
```

#### Style Guidelines
- Use TypeScript for new components
- Follow existing code formatting
- Use Tailwind CSS where possible
- Write meaningful variable/function names
- Add comments for complex logic

## Contributing Process

1. **Before Starting**
   - Check existing issues and PRs
   - Discuss major changes in an issue
   - Ensure CLA is signed

2. **Development**
   - Write clear commit messages
   - Add necessary tests
   - Update documentation
   - Follow style guidelines

3. **Pull Request**
   - Fill out PR template
   - Link related issues
   - Add screenshots for UI changes
   - Be responsive to review comments

## Community and Support

- Join our [Discord](https://discord.gg/6qfmtSUMdb)
- Read our [Documentation](https://docs.akiradocs.ai)
- Use GitHub Discussions for questions
- Report bugs via GitHub Issues

---

Contributors are recognized in [CONTRIBUTORS.md](CONTRIBUTORS.md) and release notes.