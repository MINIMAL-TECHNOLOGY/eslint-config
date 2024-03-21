module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    "love",
    "plugin:react/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
  ],
  ignorePatterns: ["build", ".eslintrc.cjs", "*.d.ts"],
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
  plugins: ["react", "@typescript-eslint", "react-refresh"],
  rules: {
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/return-await": "off",
    "prefer-promise-reject-errors": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-shadow": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "interface", format: ["PascalCase"], prefix: ["I"] },
    ],
    curly: ["error", "all"],
    "no-debugger": "off",
    "no-shadow": "off",
    "no-undef": "off",
    "react-hooks/rules-of-hooks": "warn",
    "react-hooks/exhaustive-deps": "error",
    "react-refresh/only-export-components": [
      "off",
      { allowConstantExport: true },
    ],
    "react/jsx-boolean-value": "error",
    "react/react-in-jsx-scope": "off",
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
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "interface", format: ["PascalCase"], prefix: ["I"] },
      {
        selector: "typeAlias",
        format: ["PascalCase"],
        prefix: ["T"],
        filter: { regex: "^(RootState|AppDispatch)$", match: false },
      },
    ],
    semi: "off",
  },
  settings: { react: { version: "detect" } },
};
