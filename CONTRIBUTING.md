# Contributing to AkiraDocs

First off, thank you for considering contributing to AkiraDocs! It's people like you that make AkiraDocs such a great tool.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/akiradocs.git
   cd akiradocs
   ```

2. **Set Up Development Environment**
   ```bash
   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Process

### Project Structure
```
akiradocs/
├── components/        # React components
├── pages/            # Next.js pages
├── styles/           # CSS/styling files
├── lib/              # Utility functions
├── public/           # Static assets
└── tests/            # Test files
```

### Key Areas for Contribution

1. **Dynamic UI Components**
   - Enhance existing components
   - Create new interactive elements
   - Improve accessibility

2. **In-App Editor**
   - Editor features and improvements
   - Real-time preview enhancements
   - Content validation

3. **Documentation**
   - Technical documentation
   - User guides
   - API documentation

4. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

## 📝 Pull Request Process

1. **Before Starting**
   - Check existing issues and PRs
   - Discuss major changes in an issue first
   - Update documentation as needed

2. **Making Changes**
   - Write clear, descriptive commit messages
   - Keep changes focused and atomic
   - Add tests for new features

3. **Submitting PR**
   - Fill out the PR template completely
   - Link related issues
   - Add screenshots for UI changes

4. **PR Review**
   - Address review comments
   - Keep discussions constructive
   - Be patient during review process

## 🎨 Style Guidelines

### Code Style

- Use TypeScript for new components
- Follow existing code formatting
- Use meaningful variable/function names
- Comment complex logic

### JavaScript/TypeScript
```typescript
// Good
const getUserData = async (userId: string): Promise<UserData> => {
  try {
    return await fetchUser(userId);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Avoid
const getData = async (id) => {
  return await fetch(id);
}
```

### React Components
```typescript
// Good
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

// Avoid
const Button = (props) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

### CSS/Styling
- Use Tailwind CSS classes when possible
- Follow BEM naming convention for custom CSS
- Maintain responsive design principles

## 👥 Community

### Getting Help
- Join our [Discord](https://discord.gg/6qfmtSUMdb)
- Check our [Documentation](https://docs.akiradocs.ai)
- Ask in GitHub Discussions

### Communication Channels
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: General questions and discussions
- Discord: Real-time chat and community interaction

## 🎉 Recognition

Contributors are recognized in several ways:
- Listed in our [CONTRIBUTORS.md](CONTRIBUTORS.md)
- Mentioned in release notes
- Featured on our website

## ⚖️ License

By contributing to AkiraDocs, you agree that your contributions will be licensed under its MIT License.

---

Remember: The best way to contribute is to start small and grow with the project. Don't hesitate to ask questions!