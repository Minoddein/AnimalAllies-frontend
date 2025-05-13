import {PawPrintIcon as Paw} from "lucide-react";
import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    PressEvent,
    useDisclosure
} from "@heroui/react";
import * as React from "react";
import {useContext} from "react";
import {AuthContext} from "@/contexts/auth/AuthContext";
import ModalOrDrawer from "@/components/modal-or-drawer";
import AuthForm from "@/app/_components/auth/auth-form";
import {Tab} from "@/types/tabs";

const AnimalAlliesLogo = () => {
    return (
        <div className="flex items-center gap-1">
            <Paw size={28} className="text-primary"/>
        </div>
    );
};

interface NavbarProps {
    activeTab: Tab;
    setActiveTabAction: React.Dispatch<React.SetStateAction<Tab>>;
}

export default function Header({activeTab, setActiveTabAction}: NavbarProps) {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const {accessToken, user, handleLogout} = useContext(AuthContext)!;
    const tabs: Tab[] = ["animals", "volunteers", "requests", "events"];

    console.log(user);

    const handleNavigation = (e: PressEvent, tab: Tab) => {
        setActiveTabAction(tab);
    };

    const handleOnClickLogout = async () => {
        try {
            await handleLogout();
            onClose();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const getTabLabel = (tab: Tab): string => {
        const labels = {
            main: "Главная",
            animals: "Животные",
            volunteers: "Волонтёры",
            requests: "Заявки",
            events: "События",
        };
        return labels[tab] || tab;
    };

    return (
        <Navbar isBordered isBlurred={false} maxWidth="full" className="px-4">
            <NavbarBrand className="flex justify-normal gap-2">
                <AnimalAlliesLogo/>
                <p className="font-bold text-inherit">AnimalAllies</p>
            </NavbarBrand>
            <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                {tabs.map((tab) => (
                    <NavbarItem key={tab}>
                        <Link
                            color="foreground"
                            href={`/${tab}`}
                            onPressEnd={(e) => {
                                handleNavigation(e, tab);
                            }}
                            className={activeTab === tab ? "font-bold" : ""}
                        >
                            {getTabLabel(tab)}
                        </Link>
                    </NavbarItem>
                ))}
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
                            <DropdownItem key="logout" color="danger" onPressEnd={() => {
                                void handleOnClickLogout()
                            }}>
                                Выйти
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <NavbarItem className="flex">
                        <Button variant="light" onPressEnd={onOpen}>
                            Войти
                        </Button>
                        <ModalOrDrawer label="Вход" isOpen={isOpen}
                                       onOpenChangeAction={onOpenChange}>
                            <AuthForm/>
                        </ModalOrDrawer>
                    </NavbarItem>
                )}
            </NavbarContent>
        </Navbar>
    );
};