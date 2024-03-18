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
    semi: "off",
  },
  settings: { react: { version: "detect" } },
};
