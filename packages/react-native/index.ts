import reactPlugin from '@minimaltech/eslint-react';

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const configs = [
  ...compat.extends("eslint-config-expo"),
  ...reactPlugin,
  {
    ignores: ['scripts/**/*', 'assets/**/*'],
  },
];

export = configs;
