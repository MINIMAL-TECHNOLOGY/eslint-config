import reactConfs from "@minimaltech/eslint-react";
import expoConfs from "eslint-config-expo/flat";
import tsEslint from "typescript-eslint";

// expo already registers its own @typescript-eslint plugin instance; drop ours
// from the react configs so flat config doesn't see two plugin definitions.
// Copy the config objects instead of mutating the shared module exports.
const normalizeReactConfs = () => {
  const rs: ReturnType<typeof tsEslint.config> = [];
  for (const conf of reactConfs) {
    if (!conf?.plugins?.["@typescript-eslint"]) {
      rs.push(conf);
      continue;
    }

    const { "@typescript-eslint": _tsPlugin, ...restPlugins } = conf.plugins;
    const copy = { ...conf };
    if (Object.keys(restPlugins).length) {
      copy.plugins = restPlugins;
    } else {
      delete copy.plugins;
    }

    rs.push(copy);
  }

  return rs;
};

// ------------------------------------------------------------
const configs = [
  ...expoConfs,
  ...normalizeReactConfs(),
  {
    rules: {
      "import/default": "off",
      "import/namespace": "off",
      "import/no-default-export": "off",
      "import/no-named-export": "off",

      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: ["scripts/**/*", "assets/**/*"],
  },
];

export = configs;
