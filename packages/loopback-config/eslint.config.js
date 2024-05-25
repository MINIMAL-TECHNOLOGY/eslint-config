import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import commonPlugin from "common";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __filename,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...commonPlugin,
  ...compat.extends("@loopback/eslint-config"),
  {
    rules: {
      // BASE RULES
      curly: ["error", "all"],
      "prefer-const": [
        "error",
        {
          destructuring: "any",
          ignoreReadBeforeAssign: false,
        },
      ],

      // OFF
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-constant-condition": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-this-alias": "off",
      // WARN
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "warn",

      // ERROR
      "@typescript-eslint/return-await": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
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
          prefix: ["is", "should", "has", "can", "did", "will"],
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
    },
  },
];
