import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import reactPlugin from "@minimaltech/eslint-react";

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const configs = [
  ...compat.extends("plugin:@next/eslint-plugin-next/recommended"),
  ...reactPlugin,
  {
    ignores: ["**/.next/", "**/next.config.*"],
  },
].filter((conf) => Object.keys(conf).length);

export = configs;
