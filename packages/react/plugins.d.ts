declare module "eslint-plugin-react-refresh" {
  import { type TSESLint } from "@typescript-eslint/utils";
  const plugin: TSESLint.Linter.Plugin;
  export = plugin;
}

declare module "eslint-plugin-react/configs/recommended.js" {
  import { type TSESLint } from "@typescript-eslint/utils";
  const plugin: TSESLint.Linter.Plugin;
  export = plugin;
}

declare module "@eslint/eslintrc";
declare module "eslint-plugin-react-hooks";
declare module "eslint-plugin-react";
