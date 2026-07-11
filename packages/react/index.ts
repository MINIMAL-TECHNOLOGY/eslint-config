import commonPlugin from "@minimaltech/eslint-common";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";

const configs = [
  // Both plugins ship flat configs natively — no FlatCompat needed
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs.flat.recommended,
  ...commonPlugin,
  {
    plugins: {
      "react-refresh": reactRefreshPlugin,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    settings: {
      // "detect" crashes on ESLint 10 (eslint-plugin-react 7.37 still calls
      // the removed context.getFilename()). Pin the current React major;
      // consumers on other versions can override settings.react.version.
      react: { version: "19" },
    },
    rules: {
      "no-debugger": "warn",

      // React
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-boolean-value": "error",

      // React Hooks: rules-of-hooks violations crash React at runtime — keep
      // it error; exhaustive-deps is a heuristic — warn (plugin defaults)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    ignores: ["**/vite.config.*"],
  },
];

export = configs;
