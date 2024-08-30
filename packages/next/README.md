# Minimal Technology eslint configuration

This repository contains the shared ESLint configuration used by the Minimal Technology team. It provides a standardized set of linting rules for your JavaScript and TypeScript projects, helping to ensure code quality and consistency across your projects.

## Installation

First of all, ensure that Node.js and pnpm are installed in your system. Then, run the following command to install the package:

This command installs this package as a devDependency in your project.

### Setup

This eslint configuration expects some `peerDependencies` to be installed in your project. Please ensure that you have them installed as devDependency.
You can install them using the following command:

```bash
pnpm add -D \
  eslint@8.57.0 \
  prettier@3.2.5 \
  typescript@^5.0.0 \
  typescript-eslint@^7.11.0 \
  eslint-config-prettier@^9.1.0 \
  eslint-plugin-prettier@5.1.3 \
  eslint-plugin-react@^7.34.0 \
  eslint-plugin-react-hooks@^4.6.2 \
  eslint-plugin-react-refresh@^0.4.5 \
  @next/eslint-plugin-next@^14.2.3
```

## Usage

Create a `eslint.config.*` file in your project's root (or update the existing one) with the following content:

```ts
import confs from "@minimaltech/eslint-next";

const configs = [
  ...confs,
  {
    // extra configs
  },
];

export default configs;
```
