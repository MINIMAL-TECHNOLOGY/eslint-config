import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import commonPlugin from "../common";

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const configs = [
  ...compat.extends("@loopback/eslint-config"),
  ...commonPlugin,
  {
    rules: {
      "@typescript-eslint/no-constant-condition": [
        "warn",
        {
          checkLoops: false, // Allows constant conditions in loops
          allowConstantLoops: true, // Specifically allows constant loops
        },
      ],

      // OFF
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
];

export = configs;
