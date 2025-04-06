import path from "path";
import tseslint from "typescript-eslint";

import { includeIgnoreFile } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";

const gitignorePath = path.resolve(import.meta.dirname, ".gitignore");

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

export default tseslint.config(
    includeIgnoreFile(gitignorePath),

    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
        },
        extends: [eslint.configs.recommended],
    },

    {
        files: ["**/*.{ts,tsx}"],
        ignores: ["src/components/ui/**"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        extends: [
            eslint.configs.recommended,
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
        ],
        rules: {
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
        },
    },

    ...compat.extends("prettier", "next/core-web-vitals", "next/typescript"),
);
