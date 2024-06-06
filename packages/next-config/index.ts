import nextPlugin from "@next/eslint-plugin-next";
import { TSESLint } from "@typescript-eslint/utils";
import reactPlugin from "../react-config";

const configs: TSESLint.FlatConfig.ConfigArray = [
  ...reactPlugin,
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];

export = configs;
