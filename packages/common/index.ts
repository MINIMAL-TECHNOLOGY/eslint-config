import prettierPlugin from "eslint-plugin-prettier/recommended";

const configs = [
  prettierPlugin,
  {
    files: ["**/*.js", "**/*.ts"],
    rules: {
      // WARN
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": [
        "warn",
        {
          checkThenables: false,
          ignoreVoid: true, // Allows ignoring promises with void
          ignoreIIFE: true, // Allows ignoring immediately-invoked function expressions
        },
      ],
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
              "^(T|Type|Any|Promise|Number|String|Object|Value)[A-Z][a-zA-Z0-9]*|[A-Z][a-zA-Z0-9]*(Type|Promise|Number|String|Object|Value|Like)$",
            match: true,
          },
        },
        {
          selector: "default",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "memberLike",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variableLike",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: [
            "is",
            "should",
            "has",
            "use",
            "can",
            "did",
            "will",
            "do",
            "b",
            "require",
            "auto",
            "enable",
            "disable",
            "activate",
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
                "Please import 'nameFunc' from 'lodash/nameFunc' instead of lodash",
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
      "**/build/",
      "**/dist/",
      "**/release/",
      "**/.next/",
      "**/eslint.config.*",
      "**/.eslintrc.*",
      "**/.prettierrc.*",
    ],
  },
];

export = configs;
