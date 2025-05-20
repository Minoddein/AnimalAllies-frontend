"use client";

import * as React from "react";
import { useContext } from "react";

import { Inter } from "next/font/google";
import Link from "next/link";

import AuthForm from "@/app/_components/auth/auth-form";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { Providers } from "@/components/providres";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthContext } from "@/contexts/auth/AuthContext";
import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import "../globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    );
}

const AnimalAlliesLogo = () => {
    return (
        <div className="flex items-center gap-1">
            <Icon icon="lucide:paw-print" width={28} height={28} className="text-primary" />
        </div>
    );
};

const Header = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { accessToken, user, handleLogout } = useContext(AuthContext)!;

    console.log(user);

    const handleOnClickLogout = async () => {
        try {
            await handleLogout();
            onClose();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Navbar isBordered isBlurred={true} maxWidth="full" className="px-4">
            <NavbarBrand className="flex justify-normal gap-2">
                <Link href="/" className="flex justify-normal gap-2">
                    <AnimalAlliesLogo />
                    <p className="font-bold text-inherit">AnimalAllies</p>
                </Link>
            </NavbarBrand>
            <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Животные
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link aria-current="page" href="#">
                        Волонтёры
                    </Link>
                </NavbarItem>
                {!user?.roles.includes("Admin") ? null : (
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Заявки
                        </Link>
                    </NavbarItem>
                )}
                <NavbarItem>
                    <Link color="foreground" href="#">
                        События
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {/* Условный рендеринг для авторизованных/неавторизованных пользователей */}
                {accessToken ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="secondary"
                                name="Jason Hughes"
                                size="sm"
                                src={user?.avatarUrl ?? "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2" href="/profile">
                                <p className="font-semibold">{user!.userName}</p>
                            </DropdownItem>
                            <DropdownItem key="settings">Настройки</DropdownItem>
                            <DropdownItem key="statistic">Статистика</DropdownItem>
                            <DropdownItem key="help_and_feedback">Помощь</DropdownItem>
                            <DropdownItem
                                key="logout"
                                color="danger"
                                onPressEnd={() => {
                                    void handleOnClickLogout();
                                }}
                            >
                                Выйти
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <NavbarItem className="flex">
                        <Button variant="light" onPressEnd={onOpen}>
                            Войти
                        </Button>
                        <ModalOrDrawer label="Вход" isOpen={isOpen} onOpenChangeAction={onOpenChange}>
                            <AuthForm />
                        </ModalOrDrawer>
                    </NavbarItem>
                )}
                <ThemeSwitcher />
            </NavbarContent>
        </Navbar>
    );
};
