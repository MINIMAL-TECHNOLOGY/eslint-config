import { FlatCompat } from "@eslint/eslintrc";
import { TSESLint } from "@typescript-eslint/utils";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react/configs/recommended.js";
import commonPlugin from "mt-eslint-config-common";

const compat = new FlatCompat();

const configs: TSESLint.FlatConfig.Config = {
  ...commonPlugin,
  ...compat.extends("plugin:react-hooks/recommended"),
  plugins: {
    "react-refresh": reactRefresh,
    react: reactPlugin,
  },
  rules: {
    ...reactHooksPlugin.configs.recommended.rules,
    ...commonPlugin.rules,
    "react-hooks/rules-of-hooks": "warn",
    "react-hooks/exhaustive-deps": "error",
    "react-refresh/only-export-components": [
      "off",
      { allowConstantExport: true },
    ],
    "react/jsx-boolean-value": "error",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-shadow": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    curly: ["error", "all"],
    "no-debugger": "off",
    "no-shadow": "off",
    "no-undef": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "typeAlias",
        format: ["PascalCase"],
        prefix: ["T"],
        filter: { regex: "^(RootState|AppDispatch)$", match: false },
      },
    ],
    semi: "off",
  },
  settings: { react: { version: "detect" } },
};

export = configs;
