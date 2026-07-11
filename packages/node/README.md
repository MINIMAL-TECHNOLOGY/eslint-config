# @minimaltech/eslint-node

ESLint (flat config) preset for Minimal Technology Node.js services — [`@minimaltech/eslint-common`](https://www.npmjs.com/package/@minimaltech/eslint-common) plus the LoopBack-derived strict rule set.

## What's inside

- Everything from `@minimaltech/eslint-common`
- LoopBack strict rules (override the common defaults):
  - type-aware safety at **error**: `no-floating-promises`, `await-thenable`, `no-misused-promises` control, `prefer-nullish-coalescing`, `prefer-optional-chain`, `return-await`
  - `no-explicit-any`, `no-shadow`, `no-use-before-define` at **error**
  - LoopBack naming conventions (strict `camelCase` default, `PascalCase` types, `Mixin$` factory functions, …)
- `eslint-plugin-n` with `n/prefer-node-protocol` enforced

## Installation

```bash
bun add -d @minimaltech/eslint-node
bun add -d eslint prettier typescript
```

## Usage

Create `eslint.config.mjs`:

```js
import configs from "@minimaltech/eslint-node";

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

Node.js >= 18, ESLint >= 10.

## License

MIT © Minimal Technology
