import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import reactPlugin from "@minimaltech/eslint-react";

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const configs = [
  compat.extends("@next/eslint-plugin-next").configs.recommended,
  ...reactPlugin,
  ];

export = configs
