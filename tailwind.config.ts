import { Config } from "tailwindcss";

import { heroui } from "@heroui/react";

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
    theme: {},
    darkMode: "class",
    plugins: [
        heroui({
            themes: {
                light: {
                    colors: {
                        default: {
                            "50": "#fafafa",
                            "100": "#f2f2f3",
                            "200": "#ebebec",
                            "300": "#e3e3e6",
                            "400": "#dcdcdf",
                            "500": "#d4d4d8",
                            "600": "#afafb2",
                            "700": "#8a8a8c",
                            "800": "#656567",
                            "900": "#404041",
                            foreground: "#000",
                            DEFAULT: "#d4d4d8",
                        },
                        primary: {
                            "50": "#dff3ea",
                            "100": "#b3e2cd",
                            "200": "#86d0b0",
                            "300": "#59bf93",
                            "400": "#2dae76",
                            "500": "#009d59",
                            "600": "#008249",
                            "700": "#00663a",
                            "800": "#004b2a",
                            "900": "#002f1b",
                            foreground: "#000",
                            DEFAULT: "#009d59",
                        },
                        secondary: {
                            "50": "#dfefec",
                            "100": "#b3d9d1",
                            "200": "#86c3b5",
                            "300": "#59ac9a",
                            "400": "#2d967f",
                            "500": "#008064",
                            "600": "#006a53",
                            "700": "#005341",
                            "800": "#003d30",
                            "900": "#00261e",
                            foreground: "#fff",
                            DEFAULT: "#008064",
                        },
                        success: {
                            "50": "#e2f8e9",
                            "100": "#b9efca",
                            "200": "#91e6ab",
                            "300": "#68dd8d",
                            "400": "#40d36e",
                            "500": "#17ca4f",
                            "600": "#13a741",
                            "700": "#0f8333",
                            "800": "#0b6026",
                            "900": "#073d18",
                            foreground: "#000",
                            DEFAULT: "#17ca4f",
                        },
                        warning: {
                            "50": "#f7fae3",
                            "100": "#edf4bb",
                            "200": "#e2ed93",
                            "300": "#d7e76b",
                            "400": "#cde044",
                            "500": "#c2da1c",
                            "600": "#a0b417",
                            "700": "#7e8e12",
                            "800": "#5c680d",
                            "900": "#3a4108",
                            foreground: "#000",
                            DEFAULT: "#c2da1c",
                        },
                        danger: {
                            "50": "#fde1e4",
                            "100": "#fbb8be",
                            "200": "#f98e98",
                            "300": "#f76472",
                            "400": "#f43b4c",
                            "500": "#f21126",
                            "600": "#c80e1f",
                            "700": "#9d0b19",
                            "800": "#730812",
                            "900": "#49050b",
                            foreground: "#000",
                            DEFAULT: "#f21126",
                        },
                        background: "#ffffff",
                        foreground: "#000000",
                        content1: {
                            DEFAULT: "#ffffff",
                            foreground: "#000",
                        },
                        content2: {
                            DEFAULT: "#f4f4f5",
                            foreground: "#000",
                        },
                        content3: {
                            DEFAULT: "#e4e4e7",
                            foreground: "#000",
                        },
                        content4: {
                            DEFAULT: "#d4d4d8",
                            foreground: "#000",
                        },
                        focus: "#009d59",
                        overlay: "#000000",
                    },
                },
                dark: {
                    colors: {
                        default: {
                            "50": "#0d0d0e",
                            "100": "#19191c",
                            "200": "#26262a",
                            "300": "#323238",
                            "400": "#3f3f46",
                            "500": "#65656b",
                            "600": "#8c8c90",
                            "700": "#b2b2b5",
                            "800": "#d9d9da",
                            "900": "#ffffff",
                            foreground: "#fff",
                            DEFAULT: "#3f3f46",
                        },
                        primary: {
                            "50": "#002f1b",
                            "100": "#004b2a",
                            "200": "#00663a",
                            "300": "#008249",
                            "400": "#009d59",
                            "500": "#2dae76",
                            "600": "#59bf93",
                            "700": "#86d0b0",
                            "800": "#b3e2cd",
                            "900": "#dff3ea",
                            foreground: "#000",
                            DEFAULT: "#009d59",
                        },
                        secondary: {
                            "50": "#00261e",
                            "100": "#003d30",
                            "200": "#005341",
                            "300": "#006a53",
                            "400": "#008064",
                            "500": "#2d967f",
                            "600": "#59ac9a",
                            "700": "#86c3b5",
                            "800": "#b3d9d1",
                            "900": "#dfefec",
                            foreground: "#fff",
                            DEFAULT: "#008064",
                        },
                        success: {
                            "50": "#073d18",
                            "100": "#0b6026",
                            "200": "#0f8333",
                            "300": "#13a741",
                            "400": "#17ca4f",
                            "500": "#40d36e",
                            "600": "#68dd8d",
                            "700": "#91e6ab",
                            "800": "#b9efca",
                            "900": "#e2f8e9",
                            foreground: "#000",
                            DEFAULT: "#17ca4f",
                        },
                        warning: {
                            "50": "#3a4108",
                            "100": "#5c680d",
                            "200": "#7e8e12",
                            "300": "#a0b417",
                            "400": "#c2da1c",
                            "500": "#cde044",
                            "600": "#d7e76b",
                            "700": "#e2ed93",
                            "800": "#edf4bb",
                            "900": "#f7fae3",
                            foreground: "#000",
                            DEFAULT: "#c2da1c",
                        },
                        danger: {
                            "50": "#49050b",
                            "100": "#730812",
                            "200": "#9d0b19",
                            "300": "#c80e1f",
                            "400": "#f21126",
                            "500": "#f43b4c",
                            "600": "#f76472",
                            "700": "#f98e98",
                            "800": "#fbb8be",
                            "900": "#fde1e4",
                            foreground: "#000",
                            DEFAULT: "#f21126",
                        },
                        background: "#000000",
                        foreground: "#ffffff",
                        content1: {
                            DEFAULT: "#18181b",
                            foreground: "#fff",
                        },
                        content2: {
                            DEFAULT: "#27272a",
                            foreground: "#fff",
                        },
                        content3: {
                            DEFAULT: "#3f3f46",
                            foreground: "#fff",
                        },
                        content4: {
                            DEFAULT: "#52525b",
                            foreground: "#fff",
                        },
                        focus: "#009d59",
                        overlay: "#ffffff",
                    },
                },
            },
            layout: {
                disabledOpacity: "0.5",
            },
        }),
    ],
};

export default config;
