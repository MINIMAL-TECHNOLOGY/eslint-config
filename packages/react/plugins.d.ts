declare module "eslint-plugin-react-refresh" {
  import { type TSESLint } from "@typescript-eslint/utils";
  const plugin: TSESLint.Linter.Plugin & {
    configs: Record<string, TSESLint.FlatConfig.Config>;
  };
  export = plugin;
}

declare module "eslint-plugin-react";
declare module "eslint-plugin-react-hooks";
