import type { Config } from "prettier";

const prettierConfig: Config = {
    singleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    semi: true,
    tabWidth: 4,
    printWidth: 120,
    endOfLine: "auto",

    plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
    importOrder: ["^react", "^next", "^@", "^[.]", "^[.][.]"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderParserPlugins: ["jsx", "typescript"],
};

export default prettierConfig;
