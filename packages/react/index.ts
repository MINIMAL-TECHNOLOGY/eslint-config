import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import commonPlugin from "@minimaltech/eslint-common";
import reactRefreshPlugin from "eslint-plugin-react-refresh";

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const configs = [
  ...commonPlugin,
  ...compat.extends("eslint-plugin-react/recommended"),
  compat.extends("eslint-plugin-react-hooks").configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
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
