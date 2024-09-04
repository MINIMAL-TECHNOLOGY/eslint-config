import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "../react";

export const configs = [
  ...reactPlugin,
  nextPlugin.configs.recommended,
];
