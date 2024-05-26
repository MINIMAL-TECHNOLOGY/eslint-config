"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const eslintrc_1 = require("@eslint/eslintrc");
const typescript_eslint_1 = require("typescript-eslint");
const eslint_config_common_1 = __importDefault(require("@minimaltech/eslint-config-common"));
const eslint_plugin_react_refresh_1 = __importDefault(require("eslint-plugin-react-refresh"));
const recommended_js_1 = __importDefault(require("eslint-plugin-react/configs/recommended.js"));
const compat = new eslintrc_1.FlatCompat();
const configs = [
    ...eslint_config_common_1.default,
    ...compat.extends("plugin:storybook/recommended"),
    ...compat.config({
        extends: "plugin:react-hooks/recommended",
        rules: {
            "react-hooks/rules-of-hooks": "warn",
            "react-hooks/exhaustive-deps": "error",
        },
    }),
    {
        ...recommended_js_1.default,
        rules: {
            "react/jsx-boolean-value": "error",
            "react/react-in-jsx-scope": "off",
        },
        settings: { react: { version: "detect" } },
    },
    {
        plugins: {
            "react-refresh": eslint_plugin_react_refresh_1.default,
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
            "@typescript-eslint": typescript_eslint_1.plugin,
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
module.exports = configs;
//# sourceMappingURL=index.js.map