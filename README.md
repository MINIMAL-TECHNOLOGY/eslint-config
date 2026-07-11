# Minimal Technology — ESLint configurations

Shared ESLint (flat config) presets used by the Minimal Technology team. One install gives you a consistent, strict, TypeScript-first linting setup across all projects.

## Packages

| Package | Use for | Built on |
| --- | --- | --- |
| [`@minimaltech/eslint-common`](packages/common) | Any JS/TS project | `eslint`, `typescript-eslint`, `prettier` |
| [`@minimaltech/eslint-node`](packages/node) | Node.js / LoopBack services | common + `eslint-plugin-n` + LoopBack strict rules |
| [`@minimaltech/eslint-react`](packages/react) | React apps (Vite, CRA, …) | common + `react`, `react-hooks`, `react-refresh` |
| [`@minimaltech/eslint-next`](packages/next) | Next.js apps | react + `@next/eslint-plugin-next` |
| [`@minimaltech/eslint-react-native`](packages/react-native) | React Native / Expo apps | react + `eslint-config-expo` |

## Requirements

- Node.js >= 18
- ESLint >= 10 (installed in your project)
- Bun (or any package manager — examples below use Bun)

## Installation

```bash
# pick the package that matches your project type
bun add -d @minimaltech/eslint-node
bun add -d eslint prettier typescript
```

## Usage

Create `eslint.config.mjs` in your project root:

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

## Development (this repo)

```bash
bun install          # install workspace dependencies
bun run compile      # build all packages (topological)
```

Releases are dispatched per module via `scripts/release.sh` (locally: `bun run release:<module> <patch|minor|major|pre*>`) or the GitHub *Dispatch NPM Release* workflow. Pre-release build modes publish under the `next` dist-tag.

## License

MIT © Minimal Technology
