import reactPlugin from '@minimaltech/eslint-react';
import tsEslint from "typescript-eslint";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const normalizeExpoConfigs = () => {
  const compat = new FlatCompat({
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
  });

  const rs: ReturnType<typeof tsEslint.config>= []
  const expoConfs = compat.extends("eslint-config-expo");
  for (const conf of expoConfs) {
    if (!conf?.plugins?.['@typescript-eslint']) {
      rs.push(conf);
      continue;
    }

    delete conf.plugins['@typescript-eslint'];
    if (!Object.keys(conf.plugins).length){
      delete conf.plugins;
    }

    rs.push(conf);
  }

  return rs;
}

// ------------------------------------------------------------
const configs = [
  ...normalizeExpoConfigs(),
  ...reactPlugin,
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: ['scripts/**/*', 'assets/**/*'],
  },
];

export = configs;
