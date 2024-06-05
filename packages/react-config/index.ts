import commonPlugin from "@mt/eslint-common";
import { TSESLint } from "@typescript-eslint/utils";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { plugin as tseslintPlugin } from "typescript-eslint";

const configs: TSESLint.FlatConfig.ConfigArray = [
  ...commonPlugin,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslintPlugin,
      react: reactPlugin,
      "react-refresh": { ...reactRefresh },
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
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
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
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
  },
];

export = configs;
