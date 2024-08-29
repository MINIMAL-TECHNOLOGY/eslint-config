import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import {
  plugin as tseslintPlugin,
  parser as tsParser,
} from "typescript-eslint";
import commonPlugin from "../common";

const configs = [
  ...commonPlugin,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslintPlugin,
      react: reactPlugin,
      "react-refresh": { ...reactRefresh },
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
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
    settings: { react: { version: "detect" } },
  },
];

export = configs;
