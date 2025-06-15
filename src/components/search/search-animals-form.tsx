"use client";

import React, { useState } from "react";

import { SearchAnimalsParams } from "@/types/search";
import {
    Accordion,
    AccordionItem,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Form,
    type Selection,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface SearchFormProps {
    onSubmitAction: (params: SearchAnimalsParams) => void;
}

interface DropdownItem {
    key: string;
    name: string;
}

const genders: DropdownItem[] = [
    { key: "M", name: "Мальчик" },
    { key: "F", name: "Девочка" },
    { key: "U", name: "Неизвестно" },
] as DropdownItem[];

const colorings: DropdownItem[] = [
    { key: "black", name: "Чёрный" },
    { key: "white", name: "Белый" },
    { key: "orange", name: "Рыжий" },
] as DropdownItem[];

const healths: DropdownItem[] = [
    { key: "Good", name: "Отличное" },
    { key: "Normal", name: "Есть небольшие проблемы" },
    { key: "Bad", name: "Болен" },
] as DropdownItem[];

const places: DropdownItem[] = [
    { key: "Home", name: "Домашний" },
    { key: "Street", name: "Уличный" },
] as DropdownItem[];

const others: DropdownItem[] = [{ key: "Other", name: "Другое" }] as DropdownItem[];

const filters: DropdownItem[] = [
    { key: "age", name: "Возраст" },
    { key: "aggressionLevel", name: "Уровень агрессии" },
    { key: "kindnessLevel", name: "Уровень дружелюбия" },
    { key: "activeLevel", name: "Уровень активности" },
] as DropdownItem[];

export function SearchAnimalsForm({ onSubmitAction }: SearchFormProps) {
    const [selectedGender, setSelectedGender] = React.useState<string>();
    const [selectedHealth, setSelectedHealth] = React.useState<string>();
    const [selectedPlace, setSelectedPlace] = React.useState<string>();
    const [selectedColoring, setSelectedColoring] = React.useState<string>();
    const [selectedOther, setSelectedOther] = React.useState<string>();
    const [selectedFilter, setSelectedFilter] = React.useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSortAscending, setIsSortAscending] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const searchParams: SearchAnimalsParams = {
            name: "",
            gender: selectedGender,
            coloring: selectedColoring,
            place: selectedPlace,
            health: selectedHealth,
            other: selectedOther,
            filter: selectedFilter,
        };
        onSubmitAction(searchParams);
        setIsLoading(false);
    };
    const handleReset = () => {
        setSelectedGender(undefined);
        setSelectedHealth(undefined);
        setSelectedPlace(undefined);
        setSelectedColoring(undefined);
        setSelectedOther(undefined);
        setSelectedFilter(undefined);
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
            <div className="mb-3">
                <label className="mb-2 block text-sm font-medium">{label}</label>
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
                <div>
                    <Button
                        isIconOnly
                        variant="flat"
                        className="absolute top-0 right-2"
                        color="primary"
                        onPress={() => {
                            setIsSortAscending(!isSortAscending);
                        }}
                        size="sm"
                    >
                        <Icon
                            icon={isSortAscending ? "qlementine-icons:sort-asc-24" : "qlementine-icons:sort-desc-24"}
                            className="h-4 w-4"
                        />
                    </Button>
                    {renderDropdown(
                        "Фильтрация по",
                        filters.map((g) => ({ key: g.key, name: g.name })),
                        selectedFilter,
                        (keys) => {
                            handleSelectionChange(keys, setSelectedFilter);
                        },
                        true,
                    )}
                </div>
                <Accordion variant="splitted" className="mb-2">
                    <AccordionItem key="1" aria-label="Sorting" title="Сортировка">
                        {renderDropdown(
                            "Пол",
                            genders.map((g) => ({ key: g.key, name: g.name })),
                            selectedGender,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedGender);
                            },
                            true,
                        )}
                        {renderDropdown(
                            "Окрас",
                            colorings.map((c) => ({ key: c.key, name: c.name })),
                            selectedColoring,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedColoring);
                            },
                            true,
                        )}
                        {renderDropdown(
                            "Место",
                            places.map((p) => ({ key: p.key, name: p.name })),
                            selectedPlace,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedPlace);
                            },
                            true,
                        )}
                        {renderDropdown(
                            "Здоровье",
                            healths.map((h) => ({ key: h.key, name: h.name })),
                            selectedHealth,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedHealth);
                            },
                            true,
                        )}
                        {renderDropdown(
                            "Другое",
                            others.map((o) => ({ key: o.key, name: o.name })),
                            selectedOther,
                            (keys) => {
                                handleSelectionChange(keys, setSelectedOther);
                            },
                            true,
                        )}
                    </AccordionItem>
                </Accordion>
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
