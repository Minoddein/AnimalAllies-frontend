import React from "react";

import { useTheme } from "next-themes";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { Icon } from "@iconify/react";

type Theme = "light" | "dark" | "system";

function isSupportedTheme(theme: string): theme is Theme {
    return ["system", "light", "dark"].includes(theme);
}

const THEME_CONFIG = {
    system: {
        name: "Системная",
        icon: "iconoir:computer",
    },
    light: {
        name: "Светлая",
        icon: "iconoir:sun-light",
    },
    dark: {
        name: "Тёмная",
        icon: "iconoir:half-moon",
    },
};

export const ThemeSwitcher = () => {
    const useThemeProps = useTheme();
    const theme = useThemeProps.theme ?? "system";
    const setTheme = useThemeProps.setTheme;
    const [systemTheme, setSystemTheme] = React.useState<"light" | "dark">("light");

    if (!isSupportedTheme(theme)) {
        throw new Error("Unsupported theme");
    }

    React.useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
            setSystemTheme(e.matches ? "dark" : "light");
        };

        updateSystemTheme(mediaQuery);
        mediaQuery.addEventListener("change", updateSystemTheme);

        return () => {
            mediaQuery.removeEventListener("change", updateSystemTheme);
        };
    }, []);

    const currentTheme = theme === "system" ? systemTheme : theme;

    const dropDownItems = Object.entries(THEME_CONFIG).map(([themeKey, themeConf]) => (
        <DropdownItem
            key={themeKey}
            startContent={React.createElement(Icon, { icon: themeConf.icon, className: "text-md" })}
        >
            {themeConf.name}
        </DropdownItem>
    ));

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="flat"
                    startContent={React.createElement(Icon, {
                        icon: THEME_CONFIG[currentTheme].icon,
                        className: "text-md",
                    })}
                    isIconOnly
                ></Button>
            </DropdownTrigger>
            <DropdownMenu
                selectionMode="single"
                selectedKeys={[theme]}
                onAction={(key) => {
                    setTheme(key as Theme);
                }}
            >
                {dropDownItems}
            </DropdownMenu>
        </Dropdown>
    );
};
