module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["@loopback/eslint-config", "love", "plugin:prettier/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // BASE RULES
    curly: ["error", "all"],
    "no-constant-condition": "off",
    "no-unused-vars": "off",
    "prefer-const": [
      "error",
      {
        destructuring: "any",
        ignoreReadBeforeAssign: false,
      },
    ],

    // OFF
    "@typescript-eslint/no-invalid-void-type": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/return-await": "off",
    "prefer-promise-reject-errors": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-constant-condition": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/explicit-function-return-type": "off",

    // WARN
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-floating-promises": "warn",

    // ERROR
    "@typescript-eslint/return-await": "error",
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
        selector: "interface",
        format: ["PascalCase"],
        prefix: ["I"],
      },
      {
        selector: "typeAlias",
        format: ["PascalCase"],
        prefix: ["T"],
      },
      {
        selector: ["objectLiteralProperty", "objectLiteralMethod"],
        format: null,
        modifiers: ["requiresQuotes"],
      },
    ],
  },
};
