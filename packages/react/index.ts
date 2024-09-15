import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import commonPlugin from "@minimaltech/eslint-common";
import tsEslint from "typescript-eslint";

import * as reactRefreshPlugin from "eslint-plugin-react-refresh";

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const configs = [
  ...tsEslint.configs.recommended,
  ...compat.extends("plugin:eslint-plugin-react/recommended"),
  ...compat.extends("plugin:eslint-plugin-react-hooks/recommended"),
  ...commonPlugin,
  {
    plugins: {
      "react-refresh": reactRefreshPlugin,
    },
    rules: {
      "react-refresh/only-export-components": [
        "off",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-debugger": "off",
      "no-shadow": "off",
      "no-undef": "off",

      // React
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-boolean-value": "error",

      // React Hooks
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "error",

      // TS
      "@typescript-eslint/ban-types": "off",
    },
  },
  {
    ignores: ["**/vite.config.*"],
  },
];

export = configs;
