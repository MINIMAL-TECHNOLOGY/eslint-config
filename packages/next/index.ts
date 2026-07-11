import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "@minimaltech/eslint-react";

const configs = [
  // @next/eslint-plugin-next >=16 ships flat configs directly
  nextPlugin.configs.recommended,
  ...reactPlugin,
  {
    ignores: ["**/.next/", "**/next.config.*"],
  },
];

export = configs;
