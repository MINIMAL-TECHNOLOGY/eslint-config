import commonPlugin from "@minimaltech/eslint-common";
import nodePlugin from "eslint-plugin-n";
import { defineConfig } from "eslint/config";
import { loopbackRules } from "./loopback-rules";

// Order matters: common provides the base, LB strict rules override it.
const configs = defineConfig([
  ...commonPlugin,
  ...loopbackRules,
  {
    plugins: { n: nodePlugin },
    rules: {
      "n/prefer-node-protocol": ["error"],

      // OFF
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
]);

export = configs;
