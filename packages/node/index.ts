import tsEslint from "typescript-eslint";
import commonPlugin from "@minimaltech/eslint-common";
import lbEslintRules from "@loopback/eslint-config";

const configs: ReturnType<typeof tsEslint.config> = [
  {
    rules: lbEslintRules.rules,
  },
  ...commonPlugin,
  {
    rules: {
      // OFF
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
];

export = configs;
