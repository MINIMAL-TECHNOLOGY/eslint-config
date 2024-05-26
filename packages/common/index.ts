import { TSESLint } from "@typescript-eslint/utils";
import love from "eslint-config-love";
import prettierPlugin from "eslint-plugin-prettier/recommended";

const configs: TSESLint.FlatConfig.ConfigArray = [
  {
    ...love,
    files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
    rules: {
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/return-await": "off",
      "prefer-promise-reject-errors": "off",
      "@typescript-eslint/no-extraneous-class": "off",
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
    ignores: ["node_modules/*", "build/*", "dist/*", "eslint.config.js"],
  },
  prettierPlugin,
];

export = configs;
