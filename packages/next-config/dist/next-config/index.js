"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const eslint_plugin_next_1 = __importDefault(require("@next/eslint-plugin-next"));
const react_config_1 = __importDefault(require("../react-config"));
const configs = [
    ...react_config_1.default,
    {
        plugins: {
            "@next/next": eslint_plugin_next_1.default,
        },
        rules: {
            ...eslint_plugin_next_1.default.configs.recommended.rules,
            ...eslint_plugin_next_1.default.configs["core-web-vitals"].rules,
        },
    },
];
module.exports = configs;
//# sourceMappingURL=index.js.map