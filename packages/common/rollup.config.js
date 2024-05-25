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
    "eslint",
    "eslint-config-love",
    "eslint-config-prettier",
    "eslint-plugin-prettier",
    "prettier",
    "typescript",
  ],
};
