"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const eslintrc_1 = require("@eslint/eslintrc");
const js_1 = __importDefault(require("@eslint/js"));
const common_1 = __importDefault(require("../common"));
const compat = new eslintrc_1.FlatCompat({
    recommendedConfig: js_1.default.configs.recommended,
    allConfig: js_1.default.configs.all,
});
const configs = [
    ...compat.extends("@loopback/eslint-config"),
    common_1.default,
    {
        rules: {
            // BASE RULES
            curly: ["error", "all"],
            "prefer-const": [
                "error",
                {
                    destructuring: "any",
                    ignoreReadBeforeAssign: false,
                },
            ],
            // OFF
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-constant-condition": "off",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-this-alias": "off",
            // WARN
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-floating-promises": "warn",
            // ERROR
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
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
                },
                {
                    selector: "default",
                    format: ["camelCase", "PascalCase"],
                    leadingUnderscore: "allow",
                    trailingUnderscore: "allow",
                },
                {
                    selector: "memberLike",
                    format: ["camelCase", "PascalCase", "UPPER_CASE"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "variableLike",
                    format: ["camelCase", "PascalCase", "UPPER_CASE"],
                    leadingUnderscore: "allow",
                    trailingUnderscore: "allow",
                },
                {
                    selector: "variable",
                    types: ["boolean"],
                    format: ["PascalCase"],
                    prefix: ["is", "should", "has", "can", "did", "will"],
                },
                {
                    selector: "property",
                    format: ["PascalCase"],
                    filter: { regex: "[-]", match: true },
                },
                {
                    selector: ["objectLiteralProperty", "objectLiteralMethod"],
                    format: null,
                    modifiers: ["requiresQuotes"],
                },
            ],
        },
    },
];
module.exports = configs;
//# sourceMappingURL=index.js.map