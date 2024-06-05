"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const common_1 = __importDefault(require("../common"));
const eslint_plugin_react_1 = __importDefault(require("eslint-plugin-react"));
const eslint_plugin_react_hooks_1 = __importDefault(require("eslint-plugin-react-hooks"));
const eslint_plugin_react_refresh_1 = __importDefault(require("eslint-plugin-react-refresh"));
const typescript_eslint_1 = require("typescript-eslint");
const configs = [
    ...common_1.default,
    {
        files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
        plugins: {
            "@typescript-eslint": typescript_eslint_1.plugin,
            react: eslint_plugin_react_1.default,
            "react-refresh": { ...eslint_plugin_react_refresh_1.default },
            "react-hooks": eslint_plugin_react_hooks_1.default,
        },
        rules: {
            ...eslint_plugin_react_hooks_1.default.configs.recommended.rules,
            ...eslint_plugin_react_1.default.configs.recommended.rules,
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
module.exports = configs;
//# sourceMappingURL=index.js.map