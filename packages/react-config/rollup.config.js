import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "eslint.config.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    json(),
  ],
  external: [
    "@minimaltech/eslint-config-common",
    "eslint-plugin-react",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react-refresh",
    "eslint-plugin-storybook",
  ],
};
