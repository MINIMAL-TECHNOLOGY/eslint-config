import { defineConfig } from "eslint/config";

// The typescript-eslint base (parser + recommended) is provided by
// @minimaltech/eslint-common; this layer only adds the LoopBack rule set.
const loopbackRules = defineConfig({
  rules: {
    "no-new-wrappers": "error",
    "no-throw-literal": "error",
    "no-unused-expressions": "error",
    eqeqeq: ["error", "smart"],
    "no-void": "error",

    "no-useless-escape": "warn",

    "no-mixed-operators": "off",
    "no-inner-declarations": "off",
    "no-dupe-class-members": "off",
    "no-redeclare": "off",
    "no-caller": "error",
    "no-invalid-this": "off",
    // core no-shadow false-positives on TS constructs; the
    // @typescript-eslint/no-shadow extension rule below covers it
    "no-shadow": "off",
    "no-return-await": "off",
    camelcase: "off",

    // "mocha/handle-done-callback": "error",
    // "mocha/no-exclusive-tests": "error",
    // "mocha/no-identical-title": "error",
    // "mocha/no-nested-tests": "error",
    // "no-array-constructor": "error",

    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/unified-signatures": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-invalid-this": ["error"],
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { vars: "all", args: "none", ignoreRestSiblings: false },
    ],
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": [
      "error",
      { allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: true },
    ],

    "@typescript-eslint/return-await": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase"],
      },

      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
      },

      {
        selector: "variable",
        format: null,
        filter: "^_$",
      },

      // For mixin functions
      {
        selector: "function",
        format: ["PascalCase"],
        filter: "Mixin$",
      },

      {
        selector: "parameter",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },

      // For enum members
      {
        selector: "enumMember",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        leadingUnderscore: "allow",
      },

      // For properties
      {
        selector: "property",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        leadingUnderscore: "allow",
      },

      {
        selector: "method",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },

      // For static members
      {
        selector: "memberLike",
        modifiers: ["static"],
        format: ["camelCase", "UPPER_CASE"],
      },

      // For private members
      {
        selector: "memberLike",
        modifiers: ["private"],
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },

      // For protected members
      {
        selector: "memberLike",
        modifiers: ["protected"],
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },

      {
        selector: "typeLike",
        format: ["PascalCase"],
      },

      // Names that require quotes ("Content-Type", "GET /users") are exempt
      // everywhere they can appear, not just in object literals.
      {
        selector: [
          "objectLiteralProperty",
          "objectLiteralMethod",
          "typeProperty",
          "typeMethod",
          "classProperty",
          "classMethod",
          "enumMember",
        ],
        format: null,
        modifiers: ["requiresQuotes"],
      },

      // For module imports
      // see: https://github.com/loopbackio/loopback-next/issues/10288
      {
        selector: "import",
        format: ["camelCase", "PascalCase"],
      },

      // For Lodash module imports
      {
        selector: "import",
        format: null,
        filter: "^_$",
      },
    ],

    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/consistent-type-assertions": "off",
  },
});

export { loopbackRules };
