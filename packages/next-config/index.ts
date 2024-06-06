import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { TSESLint } from "@typescript-eslint/utils";
import reactPlugin from "../react-config";

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const configs: TSESLint.FlatConfig.ConfigArray = [
  ...reactPlugin,
  ...compat.extends("plugin:@next/next/core-web-vitals"),
];

export = configs;
