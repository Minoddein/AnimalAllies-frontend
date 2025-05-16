"use client";

import React from "react";

import UserForm from "@/app/_components/auth/user-form";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownMenuProps, DropdownTrigger } from "@heroui/react";

export default function RegistrationFrom() {
    const roles = ["Пользователь", "Волонтёр", "Животное"];

    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set([roles[0]]));

    const selectedValue = React.useMemo(() => Array.from(selectedKeys).join(", ").replace(/_/g, ""), [selectedKeys]);

    const handleSelectionChange: DropdownMenuProps["onSelectionChange"] = (keys) => {
        if (keys === "all") {
            setSelectedKeys(new Set(roles));
        } else {
            const stringKeys = new Set<string>();
            (keys as Set<string>).forEach((key) => {
                stringKeys.add(key);
            });
            setSelectedKeys(stringKeys);
        }
    };

    return (
        <>
            <div className="my-4 flex justify-center">
                <Dropdown shouldBlockScroll={false}>
                    <DropdownTrigger>
                        <Button className="capitalize" variant="bordered">
                            {selectedValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Выбор роли при регистрации"
                        selectedKeys={selectedKeys}
                        selectionMode="single"
                        variant="flat"
                        onSelectionChange={handleSelectionChange}
                    >
                        {roles.map((role) => {
                            return <DropdownItem key={role}>{role}</DropdownItem>;
                        })}
                    </DropdownMenu>
                </Dropdown>
            </div>
            {selectedValue === "Пользователь" ? <UserForm /> : <p>Форма находиться в разработке</p>}
        </>
    );
}
