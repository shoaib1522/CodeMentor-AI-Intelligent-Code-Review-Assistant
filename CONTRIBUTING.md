# Contributing to CodeMentor AI

Thank you for your interest in contributing to CodeMentor AI! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful and professional. We are committed to providing a welcoming and inclusive environment.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Setup

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Code Style

### Python
- Follow PEP 8
- Use type hints
- Write docstrings for functions

### TypeScript/React
- Use ESLint configuration provided
- Follow React best practices
- Use functional components with hooks

## Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore, build, ci

Examples:
```
feat: Add SQL injection vulnerability detection
fix: Fix SSE streaming format for proper event handling
docs: Update README with API documentation
```

## Pull Request Process

1. Update README.md with any new features
2. Ensure all tests pass
3. Add tests for new features
4. Request review from maintainers
5. Address feedback and iterate

## Issues and Bugs

- Check existing issues before creating new ones
- Provide detailed reproduction steps for bugs
- Include error messages and stack traces
- Describe expected vs actual behavior

## Feature Requests

- Describe the use case
- Explain why it's needed
- Provide examples if applicable

## Testing

Write tests for all new features:

```bash
# Backend
cd backend
python -m pytest tests/

# Frontend
cd frontend
npm test
```

## Documentation

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying configuration
- Creating new components

## Code Review

All contributions require review before merging. Be open to feedback and iterate.

## Questions?

Open an issue with the "question" label or contact the maintainers.

Thank you for contributing! 🚀
