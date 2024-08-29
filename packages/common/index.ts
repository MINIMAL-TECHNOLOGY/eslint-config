import love from "eslint-config-love";
import prettierPlugin from "eslint-plugin-prettier/recommended";

const configs = [
  love,
  prettierPlugin,
  {
    files: ["**/*.js", "**/*.ts"],
    rules: {
      "prefer-promise-reject-errors": "off",

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-invalid-this": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-extraneous-class": "off",

      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          prefix: ["T"],
        },
      ],

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
