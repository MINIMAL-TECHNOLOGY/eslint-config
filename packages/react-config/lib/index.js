"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const eslintrc_1 = require("@eslint/eslintrc");
const eslint_plugin_react_hooks_1 = __importDefault(require("eslint-plugin-react-hooks"));
const eslint_plugin_react_refresh_1 = __importDefault(require("eslint-plugin-react-refresh"));
const recommended_js_1 = __importDefault(require("eslint-plugin-react/configs/recommended.js"));
const mt_eslint_config_common_1 = __importDefault(require("mt-eslint-config-common"));
const compat = new eslintrc_1.FlatCompat();
const configs = {
    ...mt_eslint_config_common_1.default,
    ...compat.extends("plugin:react-hooks/recommended"),
    plugins: {
        "react-refresh": eslint_plugin_react_refresh_1.default,
        react: recommended_js_1.default,
    },
    rules: {
        ...eslint_plugin_react_hooks_1.default.configs.recommended.rules,
        ...mt_eslint_config_common_1.default.rules,
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
module.exports = configs;
//# sourceMappingURL=index.js.map
