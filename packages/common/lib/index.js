"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
const love = __importStar(require("eslint-config-love"));
const prettierPlugin = __importStar(require("eslint-plugin-prettier/recommended"));
const configs = [
    {
        ...love,
        ...prettierPlugin,
        files: ["**/*.{js,jsx,ts,tsx"],
        rules: {
            ...love.rules,
            ...prettierPlugin.rules,
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
            "eslint.config.js",
        ],
    },
];
module.exports = configs;
//# sourceMappingURL=index.js.map