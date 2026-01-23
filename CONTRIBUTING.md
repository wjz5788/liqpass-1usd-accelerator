# Contributing to LiqPass

Thank you for your interest in contributing to LiqPass! We welcome contributions from the community to help improve our project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How to Contribute

There are many ways to contribute to LiqPass:

- Reporting bugs
- Suggesting new features
- Writing or improving documentation
- Writing tests
- Submitting pull requests with bug fixes or new features
- Reviewing pull requests

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+ or yarn 1.22+ or pnpm 8+
- Git 2.30+
- PostgreSQL 14+ (for backend development)
- Foundry (for smart contract development)

### Setting Up the Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/liqpass.git
   cd liqpass
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the backend**
   ```bash
   cd apps/liqpass-backend
   npm install
   cp .env.example .env
   ```

4. **Set up the contracts**
   ```bash
   cd ../../contracts
   forge install
   ```

## Pull Request Process

1. **Fork the repository** on GitHub.
2. **Create a feature branch** from the main branch.
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and ensure they follow the code style guidelines.
4. **Write tests** for any new functionality.
5. **Update documentation** if you've changed anything that needs to be documented.
6. **Commit your changes** with a descriptive commit message following the [Conventional Commits](https://www.conventionalcommits.org/) format.
   ```bash
   git commit -m "feat: add new feature"
   ```
7. **Push your branch** to your forked repository.
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a pull request** from your feature branch to the main branch of the original repository.
9. **Wait for review** from the maintainers. They may ask for changes before merging.

## Code Style

### Frontend

- Use TypeScript for all code
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use ESLint and Prettier for code formatting
- Use TailwindCSS for styling

### Backend

- Use TypeScript for all code
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use ESLint and Prettier for code formatting
- Use PostgreSQL for database

### Smart Contracts

- Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.20/style-guide.html)
- Use Foundry for development
- Use OpenZeppelin contracts for common patterns

## Testing

### Frontend Tests

- Write unit tests using Vitest
- Write integration tests using Testing Library
- Run tests with:
  ```bash
  npm run test
  ```

### Backend Tests

- Write unit tests using Jest or Vitest
- Write integration tests for API endpoints
- Run tests with:
  ```bash
  cd apps/liqpass-backend
  npm run test
  ```

### Smart Contract Tests

- Write tests using Foundry
- Run tests with:
  ```bash
  cd contracts
  forge test
  ```

## Documentation

- Update the README.md file if you've changed anything that affects getting started
- Update the docs/ directory if you've added new features or changed existing functionality
- Use clear and concise language
- Include examples where appropriate

## Reporting Issues

When reporting issues, please include:

- A clear and descriptive title
- A detailed description of the issue
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots or error messages if applicable
- Your environment (OS, browser, Node.js version, etc.)

## Feature Requests

When requesting new features, please include:

- A clear and descriptive title
- A detailed description of the feature
- The motivation for the feature
- Any relevant examples or mockups
- How the feature would benefit the project

Thank you for your contributions to LiqPass!