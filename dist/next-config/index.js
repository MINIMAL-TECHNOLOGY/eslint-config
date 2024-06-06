"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const react_config_1 = __importDefault(require("../react-config"));
const eslint_plugin_next_1 = __importDefault(require("@next/eslint-plugin-next"));
const configs = [
    ...react_config_1.default,
    {
        ...eslint_plugin_next_1.default.configs["core-web-vitals"],
    },
];
module.exports = configs;
//# sourceMappingURL=index.js.map