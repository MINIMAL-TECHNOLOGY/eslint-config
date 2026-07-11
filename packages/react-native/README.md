# @minimaltech/eslint-react-native

ESLint (flat config) preset for Minimal Technology React Native / Expo apps — `eslint-config-expo` plus [`@minimaltech/eslint-react`](https://www.npmjs.com/package/@minimaltech/eslint-react).

## What's inside

- `eslint-config-expo/flat` (Expo's recommended setup, including `eslint-plugin-import`)
- Everything from `@minimaltech/eslint-react` (which includes `@minimaltech/eslint-common`)
- RN-friendly relaxations: `import/default`, `import/namespace`, default/named export policing and `@typescript-eslint/no-require-imports` off
- `scripts/` and `assets/` ignored

## Installation

```bash
bun add -d @minimaltech/eslint-react-native
bun add -d eslint prettier typescript
```

## Usage

Create `eslint.config.mjs`:

```js
import configs from "@minimaltech/eslint-react-native";

export default [
  ...configs,
  {
    // project-specific overrides
  },
];
```

Lint:

```bash
eslint --report-unused-disable-directives .
```

## Requirements

Node.js >= 18, ESLint >= 10, Expo SDK with `eslint-config-expo` >= 57.

> **Bun users:** `eslint-config-expo` pulls in `unrs-resolver`, whose postinstall script Bun blocks by default. Linting works regardless; to silence the install warning add `"trustedDependencies": ["unrs-resolver"]` to your `package.json`.

## License

MIT © Minimal Technology
