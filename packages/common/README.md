# @minimaltech/eslint-common

Base ESLint (flat config) preset for Minimal Technology projects — the foundation every other `@minimaltech/eslint-*` package builds on. Use it directly for plain JavaScript/TypeScript projects.

## What's inside

- `eslint` recommended + `typescript-eslint` recommended
- Prettier integration (`eslint-plugin-prettier/recommended`, applied last)
- Type-aware parsing via `projectService` — no hardcoded `tsconfig.json` path
- House naming conventions (`@typescript-eslint/naming-convention`):
  - interfaces `IPascalCase`, type aliases `TName` / `NameType` / …
  - boolean variables carry a verb prefix (`isReady`, `hasItems`, `canEdit`, …); `SCREAMING_CASE` constants and destructured names are exempt
  - quoted keys (`"Content-Type"`) exempt everywhere; `snake_case` allowed in object literals (API payloads)
- Sensible strictness: unused vars warn with `_` escape hatch, `curly` enforced, `lodash` root imports banned

## Installation

```bash
bun add -d @minimaltech/eslint-common
bun add -d eslint prettier typescript
```

## Usage

Create `eslint.config.mjs`:

```js
import configs from "@minimaltech/eslint-common";

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
