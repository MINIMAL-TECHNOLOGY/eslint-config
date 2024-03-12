module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "@loopback/eslint-config",
    "standard-with-typescript",
    "plugin:prettier/recommended",
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
  rules: {},
};
