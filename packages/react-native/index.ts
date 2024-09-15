import reactConfs from '@minimaltech/eslint-react';
import tsEslint from "typescript-eslint";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const normalizeReactConfs = () => {
  const rs: ReturnType<typeof tsEslint.config>= []
  for (const conf of reactConfs) {
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

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
const expoConfs = compat.extends("eslint-config-expo");

// ------------------------------------------------------------
const configs = [
  ...expoConfs,
  ...normalizeReactConfs(),
  {
    rules: {
      'import/default': 'off',
      'import/namespace': 'off',
      'import/no-default-export': 'off',
      'import/no-named-export': 'off',

      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: ['scripts/**/*', 'assets/**/*'],
  },
].filter(conf => Object.keys(conf).length);

export = configs;
