import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";

const VALID_NAMING_TYPES = [
  "RootState",
  "AppState",
  "AppDispatch",
  "Dispatcher",
  "Prop",
  "Props",
].join("|");

const configs = defineConfig([
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  // prettier last so it can disable any conflicting stylistic rules
  prettierRecommended,
  {
    files: [
      "**/*.js",
      "**/*.cjs",
      "**/*.mjs",
      "**/*.jsx",
      "**/*.ts",
      "**/*.cts",
      "**/*.mts",
      "**/*.tsx",
    ],
    languageOptions: {
      parserOptions: {
        // projectService discovers the consumer's tsconfig automatically;
        // allowDefaultProject covers root-level scripts/config files that
        // live outside it (jest.config.js, prettier.config.mjs, …)
        projectService: {
          allowDefaultProject: ["*.js", "*.cjs", "*.mjs", ".*.js"],
        },
      },
    },
    rules: {
      // WARN
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-shadow": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          custom: {
            regex:
              "^(T|Type|Any|Promise|Number|String|Object|Value)[A-Z][a-zA-Z0-9]*|[A-Z][a-zA-Z0-9]*(Type|Promise|Number|String|Object|Value|Like|Prop|Props)$",
            match: true,
          },
          filter: {
            regex: `^(${VALID_NAMING_TYPES})$`,
            match: false,
          },
        },
        {
          selector: "default",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allowSingleOrDouble",
        },
        {
          selector: "memberLike",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allowSingleOrDouble",
        },
        {
          selector: "variableLike",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allowSingleOrDouble",
        },
        // Destructured names come from external APIs and can't be renamed
        // freely — exempt them. The boolean entry repeats `types` because the
        // rule ranks type-bearing configs above modifier-only ones.
        {
          selector: "variable",
          modifiers: ["destructured"],
          types: ["boolean"],
          format: null,
        },
        {
          selector: "variable",
          modifiers: ["destructured"],
          format: null,
        },
        // SCREAMING_CASE boolean constants (IS_PROD, DEBUG) are idiomatic —
        // let them through before the prefix requirement below.
        {
          selector: "variable",
          types: ["boolean"],
          format: ["UPPER_CASE"],
          filter: { regex: "^[A-Z][A-Z0-9_]*$", match: true },
        },
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          // NOTE: keep longest-first within any shared stem (does>do,
          // require>re, needs>need, …) — the rule trims the FIRST prefix
          // that matches and then format-checks the remainder.
          prefix: [
            "deactivated",
            "deactivate",
            "activated",
            "activate",
            "disabled",
            "disable",
            "enabled",
            "enable",
            "require",
            "success",
            "should",
            "ignore",
            "allow",
            "could",
            "error",
            "force",
            "needs",
            "auto",
            "does",
            "hide",
            "must",
            "need",
            "show",
            "were",
            "will",
            "with",
            "are",
            "can",
            "did",
            "had",
            "has",
            "use",
            "was",
            "do",
            "is",
            "re",
            "rs",
            "b",
          ],
        },
        // Names that require quotes ("Content-Type", "X-Custom", "GET /users")
        // are exempt everywhere they can appear, not just in object literals.
        {
          selector: [
            "objectLiteralProperty",
            "objectLiteralMethod",
            "typeProperty",
            "typeMethod",
            "classProperty",
            "classMethod",
            "enumMember",
          ],
          format: null,
          modifiers: ["requiresQuotes"],
        },
        // API payloads commonly use snake_case keys — allow them in object
        // literals only (interfaces/classes keep the stricter formats).
        {
          selector: "objectLiteralProperty",
          format: ["camelCase", "PascalCase", "UPPER_CASE", "snake_case"],
        },
      ],

      // OFF
      // NOTE: typescript-eslint only disables these for TS files — keep the
      // explicit offs so plain .js files get the same treatment
      "no-constant-condition": "off",
      "no-undef": "off",
      "no-unused-vars": "off",

      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-invalid-this": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-require-imports": "off",

      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/explicit-function-return-type": "off",

      // ERROR
      // typescript-eslint enables these for TS files only — set them here so
      // plain .js files are held to the same standard
      "prefer-const": "error",
      "no-var": "error",
      curly: ["error", "all"],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message:
                "Please import 'fn' from 'lodash/fn' instead of * from lodash | Ex: import get from 'lodash/get'",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      "**/node_modules/",
      "**/*.d.ts",
      "**/build/",
      "**/dist/",
      "**/release/",
      "**/babel.config.*",
      "**/.babelrc.*",
      "**/eslint.config.*",
      "**/.eslintrc.*",
      "**/.prettierrc.*",
    ],
  },
]);

export = configs;
