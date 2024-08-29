import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "../react";

export const configs = [
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
