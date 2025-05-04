"use client";

import { PawPrintIcon as Paw } from "lucide-react";

import Link from "next/link";

import { Button } from "@heroui/button";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";

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
          // Если accessToken существует, показываем вкладку "Профиль"
          <NavbarItem className="hidden lg:flex">
            <Link href="/profile">Профиль</Link>
          </NavbarItem>
        ) : (
          // Если accessToken отсутствует, показываем "Войти" и "Регистрация"
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
