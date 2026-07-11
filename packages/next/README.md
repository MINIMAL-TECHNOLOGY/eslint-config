# @minimaltech/eslint-next

ESLint (flat config) preset for Minimal Technology Next.js apps — [`@minimaltech/eslint-react`](https://www.npmjs.com/package/@minimaltech/eslint-react) plus the official Next.js plugin.

## What's inside

- Everything from `@minimaltech/eslint-react` (which includes `@minimaltech/eslint-common`)
- `@next/eslint-plugin-next` recommended (flat config, plugin v16+)
- `.next/` build output and `next.config.*` ignored

## Installation

```bash
bun add -d @minimaltech/eslint-next
bun add -d eslint prettier typescript
```

## Usage

Create `eslint.config.mjs`:

```js
import configs from "@minimaltech/eslint-next";

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

Node.js >= 18, ESLint >= 10, Next.js >= 16 (plugin ships flat configs only).

## License

MIT © Minimal Technology
