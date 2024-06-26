# Minimal Technology eslint configuration

This repository contains the shared ESLint configuration used by the Minimal Technology team. It provides a standardized set of linting rules for your JavaScript and TypeScript projects, helping to ensure code quality and consistency across your projects.

## Installation

First of all, ensure that Node.js and pnpm are installed in your system. Then, run the following command to install the package:

```
pnpm add @mt/eslint@github:MINIMAL-TECHNOLOGY/mt-eslint.git --save-dev
```

This command installs this package as a devDependency in your project.

### Setup

This eslint configuration expects some `peerDependencies` to be installed in your project. Please ensure that you have them installed as devDependency.
You can install them using the following command:

- For Loopback:

```bash
pnpm add -D \
  eslint@8.57.0 \
  prettier@3.2.5 \
  typescript@^5.0.0 \
  @loopback/eslint-config@15.0.2 \
  eslint-plugin-prettier@5.1.3 \
  eslint-config-prettier@^9.1.0 \
  eslint-config-love@^48.0.0
```

- For React:

```bash
pnpm add -D \
  eslint@8.57.0 \
  prettier@3.2.5 \
  typescript@^5.0.0 \
  typescript-eslint@^7.11.0 \
  eslint-config-prettier@^9.1.0 \
  eslint-plugin-prettier@5.1.3 \
  eslint-config-love@^48.0.0 \
  eslint-plugin-react@^7.34.0 \
  eslint-plugin-react-hooks@^4.6.2 \
  eslint-plugin-react-refresh@^0.4.5
```

- For NextJS:

```bash
pnpm add -D \
  eslint@8.57.0 \
  prettier@3.2.5 \
  typescript@^5.0.0 \
  typescript-eslint@^7.11.0 \
  eslint-config-prettier@^9.1.0 \
  eslint-plugin-prettier@5.1.3 \
  eslint-config-love@^48.0.0 \
  eslint-plugin-react@^7.34.0 \
  eslint-plugin-react-hooks@^4.6.2 \
  eslint-plugin-react-refresh@^0.4.5 \
  @next/eslint-plugin-next@^14.2.3
```


## Usage

Create a `eslint.config.js` file in your project's root (or update the existing one) with the following content:

- For Loopback:

```javascript
import loopbackConfig from "@mt/eslint/loopback";

export default [...loopbackConfig];
```

- For React:

```javascript
import reactConfig from "@mt/eslint/react";

export default [...reactConfig];
```

- For NextJS:

```javascript
import nextConfig from "@mt/eslint/next";

export default [...nextConfig];
```
