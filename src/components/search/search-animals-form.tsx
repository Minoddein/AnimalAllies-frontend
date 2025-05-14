"use client";

import React, {useState} from "react";

import {Tab} from "@/types/tabs";
import {SearchAnimalsParams} from "@/types/search";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Form,
    Input,
    type Selection,
} from "@heroui/react";

interface SearchFormProps {
    onSubmitAction: (params: SearchAnimalsParams) => void;
    tabType: Tab;
}

interface DropdownItem {
    key: string;
    name: string;
}

const genders: DropdownItem[] = [
    {key: "M", name: "Мальчик"},
    {key: "F", name: "Девочка"},
    {key: "U", name: "Неизвестно"},
] as DropdownItem[];

const colorings: DropdownItem[] = [
    {key: "black", name: "Чёрный"},
    {key: "white", name: "Белый"},
    {key: "orange", name: "Рыжий"},
] as DropdownItem[];

const healths: DropdownItem[] = [
    {key: "Good", name: "Отличное"},
    {key: "Normal", name: "Есть небольшие проблемы"},
    {key: "Bad", name: "Болен"},
] as DropdownItem[];

const places: DropdownItem[] = [
    {key: "Home", name: "Домашний"},
    {key: "Street", name: "Уличный"},
] as DropdownItem[];

const others: DropdownItem[] = [
    {key: "Other", name: "Другое"},
] as DropdownItem[];

export function SearchAnimalsForm({onSubmitAction, tabType}: SearchFormProps) {
    const [name, setName] = useState("");
    const [selectedGender, setSelectedGender] = React.useState<string>();
    const [selectedHealth, setSelectedHealth] = React.useState<string>();
    const [selectedPlace, setSelectedPlace] = React.useState<string>();
    const [selectedColoring, setSelectedColoring] = React.useState<string>();
    const [selectedOther, setSelectedOther] = React.useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        let searchParams: SearchAnimalsParams = {
            name: name,
            gender: selectedGender,
            coloring: selectedColoring,
            place: selectedPlace,
            health: selectedHealth,
            other: selectedOther,
        };
        onSubmitAction(searchParams);
        setIsLoading(false);
    };
    const handleReset = () => {
        setName("");
        setSelectedGender(undefined);
        setSelectedHealth(undefined);
        setSelectedPlace(undefined);
        setSelectedColoring(undefined);
        setSelectedOther(undefined);
    };

    const renderDropdown = (
        label: string,
        items: { key: string; name: string }[],
        selectedKey: string | undefined,
        onSelectionChange: (keys: Selection) => void,
        allowEmpty = false,
    ) => {
        const selectedName = items.find((i) => i.key === selectedKey)?.name ?? "Выберите...";

        return (
            <div className="mb-1">
                <label className="mb-1 block text-sm font-medium">{label}</label>
                <Dropdown className="w-full">
                    <DropdownTrigger>
                        <Button variant="bordered" className="w-full justify-between text-left">
                            {selectedName}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection={!allowEmpty}
                        selectionMode="single"
                        selectedKeys={selectedKey ? new Set([selectedKey]) : new Set()}
                        onSelectionChange={onSelectionChange}
                    >
                        {items.map((item) => (
                            <DropdownItem key={item.key}>{item.name}</DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    };

    const handleSelectionChange = (
        keys: Selection,
        setter: React.Dispatch<React.SetStateAction<string | undefined>>,
    ) => {
        const value = Array.from(keys as Set<string>)[0];
        setter(value);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <div className="grid w-full grid-cols-1 gap-4">
                <h3 className="mt-1">Поиск по имени</h3>
                <Input
                    label="Имя животного"
                    variant="bordered"
                    fullWidth
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <h3 className="mt-1">Сортировка</h3>
                {renderDropdown(
                    "Пол",
                    genders.map((g) => ({key: g.key, name: g.name})),
                    selectedGender,
                    (keys) => {
                        handleSelectionChange(keys, setSelectedGender);
                    },
                    true,
                )}
                {renderDropdown(
                    "Окрас",
                    colorings.map((c) => ({key: c.key, name: c.name})),
                    selectedColoring,
                    (keys) => {
                        handleSelectionChange(keys, setSelectedColoring);
                    },
                    true,
                )}
                {renderDropdown(
                    "Место",
                    places.map((p) => ({key: p.key, name: p.name})),
                    selectedPlace,
                    (keys) => {
                        handleSelectionChange(keys, setSelectedPlace);
                    },
                    true,
                )}
                {renderDropdown(
                    "Здоровье",
                    healths.map((h) => ({key: h.key, name: h.name})),
                    selectedHealth,
                    (keys) => {
                        handleSelectionChange(keys, setSelectedHealth);
                    },
                    true,
                )}
                {renderDropdown(
                    "Другое",
                    others.map((o) => ({key: o.key, name: o.name})),
                    selectedOther,
                    (keys) => {
                        handleSelectionChange(keys, setSelectedOther);
                    },
                    true,
                )}
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="flat" onPress={handleReset}>
                    Сбросить
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    Поиск
                </Button>
            </div>
        </Form>
    );
}
