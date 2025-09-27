# Nelson-GPT Developer Guide

Welcome to the Nelson-GPT development team! This guide will help you get up to speed with the codebase and development workflow.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Architecture](#architecture)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Git
- Docker (optional, for containerized development)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/nelson-gpt.git
   cd nelson-gpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Local: http://localhost:3000
   - Network: http://[your-ip]:3000

## 📁 Project Structure

```
nelson-gpt/
├── public/                 # Static assets and PWA files
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   ├── splash.html       # Custom splash screen
│   └── *.png             # Icons and images
├── src/
│   ├── components/       # Reusable React components
│   │   ├── Layout.tsx    # Main app layout
│   │   ├── Sidebar.tsx   # Navigation sidebar
│   │   ├── ChatInput.tsx # Message input component
│   │   └── ChatMessage.tsx # Message display component
│   ├── pages/           # Page components
│   │   ├── ChatPage.tsx # Main chat interface
│   │   ├── LoginPage.tsx # Authentication page
│   │   └── SettingsPage.tsx # User settings
│   ├── stores/          # Zustand state management
│   │   ├── chatStore.ts # Chat state and actions
│   │   ├── authStore.ts # Authentication state
│   │   ├── themeStore.ts # Theme preferences
│   │   └── settingsStore.ts # User settings
│   ├── services/        # External API integrations
│   │   └── aiService.ts # Mistral AI integration
│   ├── lib/             # Utility libraries
│   │   └── supabase.ts  # Supabase client
│   ├── hooks/           # Custom React hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMedicalSearch.ts
│   ├── utils/           # Utility functions
│   │   ├── formatters.ts # Date, time, and text formatting
│   │   ├── validators.ts # Input validation
│   │   └── constants.ts # Application constants
│   ├── types/           # TypeScript type definitions
│   │   ├── chat.ts     # Chat-related types
│   │   ├── medical.ts  # Medical data types
│   │   ├── auth.ts     # Authentication types
│   │   └── ui.ts       # UI component types
│   ├── constants/       # Application constants
│   └── test/           # Test configuration and utilities
├── .github/workflows/  # CI/CD pipelines
├── docker/             # Docker configuration
├── docs/              # Documentation
└── scripts/           # Build and deployment scripts
```

## 🔄 Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint code |
| `npm run lint:fix` | Fix linting issues |
| `npm run type-check` | Check TypeScript types |
| `npm run format` | Format code with Prettier |
| `npm run docker:build` | Build Docker image |
| `npm run docker:dev` | Run development in Docker |

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new medical search functionality"
   ```

3. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

## 🏗️ Architecture

### State Management

We use [Zustand](https://zustand-demo.pmnd.rs/) for state management:

```typescript
// Example store structure
interface ChatStore {
  // State
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
  
  // Actions
  createConversation: (title?: string) => Conversation
  addMessage: (conversationId: string, message: Message) => void
  // ... more actions
}
```

### Component Architecture

- **Pages**: Top-level route components
- **Components**: Reusable UI components
- **Hooks**: Custom React hooks for shared logic
- **Stores**: Global state management
- **Services**: External API integrations

### Styling

We use Tailwind CSS with custom design tokens:

```css
/* Custom color palette for ChatGPT-like interface */
:root {
  --gpt-bg-light: #ffffff;
  --gpt-bg-dark: #212121;
  --gpt-primary: #10a37f;
  /* ... more variables */
}
```

### PWA Features

- **Service Worker**: Handles caching and offline functionality
- **Manifest**: Defines app metadata and installation behavior
- **Splash Screen**: Custom loading screen with medical branding

## 🧪 Testing

### Test Structure

```
src/
├── __tests__/          # Test files
│   ├── components/     # Component tests
│   ├── utils/         # Utility function tests
│   ├── stores/        # Store tests
│   └── hooks/         # Hook tests
└── test/
    ├── setup.ts       # Test configuration
    └── mocks/         # Test mocks
```

### Testing Guidelines

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interactions
3. **Coverage**: Maintain >80% test coverage
4. **Medical Content**: Validate medical information accuracy

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test formatters.test.ts
```

## 🚢 Deployment

### Environments

- **Development**: Local development server
- **Staging**: Pre-production testing environment
- **Production**: Live application

### Docker Deployment

```bash
# Build production image
docker build -t nelson-gpt .

# Run with Docker Compose
docker-compose --profile production up
```

### CI/CD Pipeline

Our GitHub Actions pipeline includes:

1. **Code Quality**: Linting, type checking, testing
2. **Security**: Dependency scanning, vulnerability checks  
3. **Build**: Multi-platform Docker image builds
4. **Deploy**: Automated deployment to staging/production
5. **Monitoring**: Performance monitoring with Lighthouse

## 🤝 Contributing

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation as needed

### Medical Content Guidelines

When working with medical content:

1. **Accuracy**: Verify all medical information
2. **Citations**: Include proper medical references
3. **Disclaimers**: Always include appropriate medical disclaimers
4. **Review**: Have medical content reviewed by healthcare professionals

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and update documentation
5. Submit a pull request
6. Address review feedback
7. Merge after approval

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Medical content is accurate
- [ ] Security considerations addressed
- [ ] Performance impact considered
- [ ] Accessibility requirements met

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Nelson Textbook of Pediatrics](https://www.elsevier.com/books/nelson-textbook-of-pediatrics/kliegman/978-0-323-52950-1)

## 🆘 Getting Help

- **Technical Issues**: Create an issue on GitHub
- **Medical Questions**: Consult with medical advisors
- **Security Concerns**: Email security@nelson-gpt.com
- **General Questions**: Join our Discord community

---

## ⚠️ Medical Disclaimer

This application is designed for healthcare professionals and provides educational information. It should not replace professional medical judgment or direct patient care. Always consult with qualified healthcare professionals for medical decisions.

---

**Happy coding! 🚀**