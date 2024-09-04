import reactRecommended from "eslint-plugin-react";
import reactHooksRecommended from "eslint-plugin-react-hooks";

import { parser as tsParser } from "typescript-eslint";
import commonPlugin from "../common";

const configs = [
  ...commonPlugin,
  reactRecommended.configs.recommended,
  reactHooksRecommended.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: ['react', 'react-refresh', 'react-hooks'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
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

      "@typescript-eslint/ban-types": "off",
    },
  },
];

console.log(configs)

export = configs;
