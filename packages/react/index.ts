import commonPlugin from "@miminaltech/eslint-common";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";

const configs = [
  ...commonPlugin,
  reactPlugin.configs.recommended,
  reactHooksPlugin.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
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

export = configs;
