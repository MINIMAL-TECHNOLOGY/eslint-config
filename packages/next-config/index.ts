import reactPlugin from "../react-config";
import { TSESLint } from "@typescript-eslint/utils";
import nextPlugin from "@next/eslint-plugin-next";

const configs: TSESLint.FlatConfig.ConfigArray = [
  ...reactPlugin,
  {
    ...nextPlugin.configs["core-web-vitals"],
  },
];

export = configs;
