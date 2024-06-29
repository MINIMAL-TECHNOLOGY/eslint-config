"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const eslint_config_love_1 = __importDefault(require("eslint-config-love"));
const recommended_1 = __importDefault(require("eslint-plugin-prettier/recommended"));
const configs = [
    {
        ...recommended_1.default,
        ...eslint_config_love_1.default,
        plugins: { ...eslint_config_love_1.default.plugins, ...recommended_1.default.plugins },
        files: ["**/*.js", "**/*.ts"],
        rules: {
            ...eslint_config_love_1.default.rules,
            ...recommended_1.default.rules,
            "@typescript-eslint/no-invalid-void-type": "off",
            "@typescript-eslint/prefer-nullish-coalescing": "off",
            "@typescript-eslint/no-confusing-void-expression": "off",
            "prefer-promise-reject-errors": "off",
            "@typescript-eslint/no-extraneous-class": "off",
            "@typescript-eslint/strict-boolean-expressions": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
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
            ],
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "lodash",
                            message: "Please import 'nameFunc' from 'lodash/nameFunc' instead of lodash",
                        },
                    ],
                },
            ],
        },
    },
    {
        ignores: [
            "**/node_modules/",
            "**/build/",
            "**/dist/",
            "**/.next/",
            "**/eslint.config.*",
        ],
    },
];
module.exports = configs;
//# sourceMappingURL=index.js.map