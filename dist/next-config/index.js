"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const eslintrc_1 = require("@eslint/eslintrc");
const js_1 = __importDefault(require("@eslint/js"));
const react_config_1 = __importDefault(require("../react-config"));
const compat = new eslintrc_1.FlatCompat({
    recommendedConfig: js_1.default.configs.recommended,
    allConfig: js_1.default.configs.all,
});
const configs = [
    ...react_config_1.default,
    ...compat.extends("plugin:@next/next/core-web-vitals"),
];
module.exports = configs;
//# sourceMappingURL=index.js.map