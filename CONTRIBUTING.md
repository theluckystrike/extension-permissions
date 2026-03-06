# Contributing to extension-permissions

Thanks for considering a contribution. This document covers the basics.

GETTING STARTED

1. Fork the repo and clone your fork
2. Run npm install to set up dependencies
3. Create a branch for your change

DEVELOPMENT

Build the project with TypeScript.

```bash
npm run build
```

Run tests.

```bash
npm test
```

Lint the source.

```bash
npm run lint
```

Watch mode for development.

```bash
npm run dev
```

PULL REQUESTS

- Keep PRs focused on a single change
- Add tests if you are introducing new functionality
- Make sure npm test and npm run lint pass before submitting
- Write clear commit messages that explain the reasoning behind the change

REPORTING ISSUES

Open an issue on GitHub with a clear description of the problem. Include steps to reproduce if applicable. If you have a fix ready, feel free to open a PR directly.

CODE STYLE

- TypeScript strict mode is enabled
- Use static methods on classes unless instance state is needed
- Keep functions small and focused
- Prefer async/await over raw promises

LICENSE

By contributing you agree that your contributions will be licensed under the MIT license that covers this project.
