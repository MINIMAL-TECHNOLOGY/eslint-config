import { TSESLint } from "@typescript-eslint/utils";
import { FlatCompat } from "@eslint/eslintrc";
import { plugin as tseslint } from "typescript-eslint";
import commonPlugin from "@minimaltech/eslint-config-common";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react/configs/recommended.js";

const compat = new FlatCompat();

const configs: TSESLint.FlatConfig.ConfigArray = [
  ...commonPlugin,
  ...compat.extends("plugin:storybook/recommended"),
  ...compat.config({
    extends: "plugin:react-hooks/recommended",
    rules: {
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "error",
    },
  }),
  {
    ...reactPlugin,
    rules: {
      "react/jsx-boolean-value": "error",
      "react/react-in-jsx-scope": "off",
    },
    settings: { react: { version: "detect" } },
  },
  {
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "off",
        { allowConstantExport: true },
      ],
    },
  },
  {
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
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
  },
];

export = configs;
