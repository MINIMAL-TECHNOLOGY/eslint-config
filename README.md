# Minimal Technology eslint configuration

This repository contains the shared ESLint configuration used by the Minimal Technology team. It provides a standardized set of linting rules for your JavaScript and TypeScript projects, helping to ensure code quality and consistency across your projects.

## Installation

First of all, ensure that Node.js and pnpm are installed in your system. Then, run the following command to install the package:

```
pnpm add @mt/eslint@github:vietanhvo/mt-eslint.git --save-dev
```

This command installs this package as a devDependency in your project.

### Setup

This eslint configuration expects some `peerDependencies` to be installed in your project. Please ensure that you have them installed as devDependency.
You can install them using the following command:

- For backend:

```bash
pnpm add -D \
  eslint@>=8.0.0 \
  prettier@>=3.0.0 \
  typescript@^5.0.0 \
  @loopback/eslint-config@^15.0.0 \
  eslint-config-standard-with-typescript@^43.0.1 \
  eslint-plugin-import@^2.25.2 \
  eslint-plugin-n@^15.0.0 \
  eslint-plugin-promise@^6.0.0
```

- For frontend:

```bash
pnpm add -D \
  eslint@>=8.0.0 \
  prettier@>=3.0.0 \
  typescript@^5.0.0 \
  @typescript-eslint/eslint-plugin@^6.4.0 \
  eslint-config-prettier@^9.1.0 \
  eslint-config-standard-with-typescript@^43.0.1 \
  eslint-plugin-import@^2.25.2 \
  eslint-plugin-n@^15.0.0 \
  eslint-plugin-promise@^6.0.0 \
  eslint-plugin-react@^7.34.0 \
  eslint-plugin-react-hooks@^4.6.0 \
  eslint-plugin-react-refresh@^0.4.5 \
  eslint-plugin-storybook@^0.8.0
```

## Usage

Create a `.eslintrc.cjs` file in your project's root (or update the existing one) with the following content:

- For backend:

```javascript
module.exports = {
  extends: [require.resolve("@mt/eslint/packages/be-config")],
};
```

- For frontend:

```javascript
module.exports = {
  extends: [require.resolve("@mt/eslint/packages/fe-config")],
};
```
