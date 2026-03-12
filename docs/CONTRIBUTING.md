# Contributing to Dungeon Casino Rogue

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🎯 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd RogLuck

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📋 Project Structure

```
src/
├── components/
│   ├── combat/       # Combat-related components
│   ├── effects/      # Visual effects (damage numbers, particles)
│   ├── game/         # Core game components (FloorMap, Shop, etc.)
│   ├── gambling/     # Gambling mini-game components
│   ├── layout/       # Layout components (HUD, Menu, etc.)
│   ├── meta/         # Meta progression components
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── store/            # Zustand stores (game, meta, deck)
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and game logic
```

## 🛠 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions (camelCase for variables/functions, PascalCase for components/types)
- Use functional components with React hooks
- Keep components small and focused on a single responsibility

### Component Structure
```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic

  return (
    // JSX
  );
};
```

### State Management
- Use Zustand stores for global state
- Use local useState for component-specific state
- Keep store actions small and composable

### Testing
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📝 Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build/config changes

### Examples
```
feat(gambling): add Roulette mini-game
fix(combat): resolve HP calculation error
docs(readme): update installation instructions
refactor(store): simplify gameStore actions
```

## 🎮 Adding New Features

### Adding a New Gambling Game
1. Create game logic in `src/utils/gambling-logic/<game>.ts`
2. Create component in `src/components/gambling/<Game>/<Game>Game.tsx`
3. Add to `GamblingEncounter.tsx` switch statement
4. Update documentation

### Adding a New Card
1. Add card definition to `CARD_DATABASE` in `src/types/cards.ts`
2. Implement card effect in `src/utils/card-effects.ts`
3. Test in-game balance

### Adding a New Character
1. Add character to `CHARACTER_CLASSES` in `src/types/characters.ts`
2. Update character select screen
3. Balance starting stats

## 🐛 Reporting Issues

### Bug Report Template
- **Description**: Clear description of the bug
- **Reproduction**: Steps to reproduce
- **Expected**: Expected behavior
- **Actual**: Actual behavior
- **Environment**: Browser, OS, version

### Feature Request Template
- **Problem**: What problem does this solve?
- **Solution**: Proposed solution
- **Alternatives**: Alternative solutions considered
- **Context**: Additional context

## 🚀 Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### PR Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added where necessary
- [ ] Tests added/updated
- [ ] Documentation updated

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## 💬 Questions?

Feel free to open an issue for questions. We're happy to help!
