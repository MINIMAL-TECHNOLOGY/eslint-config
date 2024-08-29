declare const configs: (import("eslint").Linter.FlatConfig | {
    files: string[];
    rules: {
        "prefer-promise-reject-errors": string;
        "@typescript-eslint/no-explicit-any": string;
        "@typescript-eslint/no-unsafe-function-type": string;
        "@typescript-eslint/no-invalid-this": string;
        "@typescript-eslint/no-this-alias": string;
        "@typescript-eslint/no-floating-promises": string;
        "@typescript-eslint/no-empty-object-type": string;
        "@typescript-eslint/no-invalid-void-type": string;
        "@typescript-eslint/no-confusing-void-expression": string;
        "@typescript-eslint/no-extraneous-class": string;
        "@typescript-eslint/prefer-nullish-coalescing": string;
        "@typescript-eslint/strict-boolean-expressions": string;
        "@typescript-eslint/explicit-function-return-type": string;
        "@typescript-eslint/naming-convention": (string | {
            selector: string;
            format: string[];
            prefix: string[];
        })[];
        "no-restricted-imports": (string | {
            paths: {
                name: string;
                message: string;
            }[];
        })[];
    };
})[];
export = configs;
