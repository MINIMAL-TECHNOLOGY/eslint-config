import eslint from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import tsEslint from "typescript-eslint";

const VALID_NAMING_TYPES = [
  "RootState",
  "AppState",
  "AppDispatch",
  "Dispatcher",
  "Prop",
  "Props",
].join("|");

const configs: ReturnType<typeof tsEslint.config> = [
  eslint.configs.recommended,
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
        project: "./tsconfig.json",
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
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: [
            "b",
            "do",
            "is",
            "has",
            "use",
            "can",
            "did",
            "auto",
            "will",
            "with",
            "force",
            "should",
            "error",
            "success",
            "require",
            "re",
            "rs",
            "enabled",
            "enable",
            "disabled",
            "disable",
            "activated",
            "activate",
            "deactivated",
            "deactivate",
          ],
        },
        {
          selector: "property",
          format: ["PascalCase"],
          filter: { regex: "[-]", match: true },
        },
        {
          selector: ["objectLiteralProperty", "objectLiteralMethod"],
          format: null,
          modifiers: ["requiresQuotes"],
        },
      ],

      // OFF
      "prefer-promise-reject-errors": "off",
      "no-constant-condition": "off",
      "no-undef": "off",
      "no-unused-vars": "off",

      "@typescript-eslint/no-constant-condition": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-invalid-this": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-extraneous-class": "off",

      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/explicit-function-return-type": "off",

      // ERROR
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
      "prefer-const": [
        "error",
        {
          destructuring: "any",
          ignoreReadBeforeAssign: false,
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
];

export = configs;
