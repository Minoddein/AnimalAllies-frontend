"use client";

import {PawPrintIcon as Paw} from "lucide-react";

import {useContext} from "react";

import Link from "next/link";

import {AuthContext} from "@/contexts/auth/AuthContext";
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
import ModalOrDrawer from "@/components/modal-or-drawer";
import RegistrationFrom from "@/app/_components/auth/registration-from";

export default function App() {
    return (
        <main>
            <Header/>
        </main>
    );
}

const AnimalAlliesLogo = () => {
    return (
        <div className="flex items-center gap-1">
            <Paw size={28} className="text-primary"/>
        </div>
    );
};

const Header = () => {
    const {
        isOpen: isRegistrationOpen,
        onOpen: onRegistrationOpen,
        onOpenChange: onRegistrationOpenChange
    } = useDisclosure();
    const {
        isOpen: isLoginOpen,
        onOpen: onLoginOpen,
        onOpenChange: onLoginOpenChange
    } = useDisclosure();
    const {accessToken, user, handleLogout} = useContext(AuthContext)!;

    console.log(user);

    const handleOnClickLogout = async () => {
        try {
            await handleLogout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Navbar isBordered isBlurred={false} maxWidth="full" className="px-4">
            <NavbarBrand className="flex justify-normal gap-2">
                <AnimalAlliesLogo/>
                <p className="font-bold text-inherit">AnimalAllies</p>
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
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Заявки
                    </Link>
                </NavbarItem>
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
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">{user!.userName}</p>
                            </DropdownItem>
                            <DropdownItem key="settings">Настройки</DropdownItem>
                            <DropdownItem key="statistic">Статистика</DropdownItem>
                            <DropdownItem key="help_and_feedback">Помощь</DropdownItem>
                            <DropdownItem key="logout" color="danger" onPressEnd={() => handleOnClickLogout}>
                                Выйти
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <>
                        <NavbarItem className="hidden lg:flex">
                            <Button variant="light" onPress={onLoginOpen}>
                                Войти
                            </Button>
                            <ModalOrDrawer label="Вход" isOpen={isLoginOpen}
                                           onOpenChangeAction={onLoginOpenChange}>
                            </ModalOrDrawer>
                        </NavbarItem>
                        <NavbarItem>
                            <Button color="primary" variant="flat" onPress={onRegistrationOpen}>
                                Регистрация
                            </Button>
                            <ModalOrDrawer label="Регистрация" isOpen={isRegistrationOpen}
                                           onOpenChangeAction={onRegistrationOpenChange}>
                                <RegistrationFrom/>
                            </ModalOrDrawer>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>
        </Navbar>
    );
};
