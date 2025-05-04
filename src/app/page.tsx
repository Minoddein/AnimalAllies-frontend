"use client";

import { PawPrintIcon as Paw } from "lucide-react";

import Link from "next/link";

import { Button } from "@heroui/button";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { User } from "@/models/user";

export default function App() {
  return (
    <main>
      <Header />
    </main>
  );
}

const AnimalAlliesLogo = () => {
  return (
    <div className="flex items-center gap-1">
      <Paw size={28} className="text-primary" />
    </div>
  );
};

const Header = () => {
  const accessToken = useContext(AuthContext)?.accessToken;
  const user: User = useContext(AuthContext)?.user!;

  console.log(user);

  return (
    <Navbar isBordered isBlurred={false} maxWidth="full" className="px-4">
      <NavbarBrand className="flex justify-normal gap-2">
        <AnimalAlliesLogo />
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
                <p className="font-semibold">{user.userName}</p>
              </DropdownItem>
              <DropdownItem key="settings">Настройки</DropdownItem>
              <DropdownItem key="statistic">Статистика</DropdownItem>
              <DropdownItem key="help_and_feedback">Помощь</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Выйти
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">Войти</Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="/registration"
                variant="flat"
              >
                Регистрация
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};
