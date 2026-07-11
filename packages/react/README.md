# @minimaltech/eslint-react

ESLint (flat config) preset for Minimal Technology React apps — [`@minimaltech/eslint-common`](https://www.npmjs.com/package/@minimaltech/eslint-common) plus the React plugin stack.

## What's inside

- Everything from `@minimaltech/eslint-common`
- `eslint-plugin-react` flat recommended (JSX runtime friendly: `react/react-in-jsx-scope` off, `prop-types` off)
- `eslint-plugin-react-hooks` flat recommended — `rules-of-hooks` at **error**, `exhaustive-deps` at warn, plus the React Compiler rule set
- `eslint-plugin-react-refresh` — `only-export-components` at warn (`allowConstantExport`)
- `react/jsx-boolean-value` enforced

## Installation

```bash
bun add -d @minimaltech/eslint-react
bun add -d eslint prettier typescript
```

## Usage

Create `eslint.config.mjs`:

```js
import configs from "@minimaltech/eslint-react";

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

### React version

The preset assumes React 19. On a different major, override it:

```js
{
  settings: { react: { version: "18" } },
}
```

## Requirements

Node.js >= 18, ESLint >= 10.

## License

MIT © Minimal Technology
