import type { Config } from "stylelint";

const stylelintConfig: Config = {
    extends: ["stylelint-config-recommended", "stylelint-config-tailwindcss"],
    rules: {
        "at-rule-no-deprecated": [
            true,
            {
                ignoreAtRules: ["apply"],
            },
        ],
    },
};

export default stylelintConfig;
