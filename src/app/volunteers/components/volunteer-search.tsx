"use client";

import { Filter } from "lucide-react";

import { useState } from "react";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { Icon } from "@iconify/react";

interface VolunteerSearchProps {
    onSearch: (searchTerm: string, experienceFrom: number | undefined, experienceTo: number | undefined) => void;
    initialSearchTerm?: string;
    initialExperienceFrom?: number | undefined;
    initialExperienceTo?: number | undefined;
}

export default function VolunteerSearch({
    onSearch,
    initialSearchTerm = "",
    initialExperienceFrom = undefined,
    initialExperienceTo = undefined,
}: VolunteerSearchProps) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [experienceFrom, setExperienceFrom] = useState<number | undefined>(initialExperienceFrom);
    const [experienceTo, setExperienceTo] = useState<number | undefined>(initialExperienceTo);

    const handleSearch = () => {
        onSearch(searchTerm, experienceFrom, experienceTo);
    };

    const handleReset = () => {
        setSearchTerm("");
        setExperienceFrom(undefined);
        setExperienceTo(undefined);
        /*onSearch("", null, null);*/
    };

    return (
        <Card className="glass-effect sticky top-24 border-0 shadow-xl">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    <Filter className="text-primary h-5 w-5" />
                    Поиск волонтёров
                </div>
            </CardHeader>
            <CardBody className="space-y-6">
                {/* Search Input */}
                <div className="relative">
                    <Input
                        type="text"
                        startContent={<Icon icon="material-symbols:search-rounded" className="text-primary h-4 w-4" />}
                        label="Поиск по имени"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                </div>

                {/* Exp Filter */}
                <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <Icon icon="mdi:clock-outline" className="text-primary h-4 w-4" />
                        Опыт
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <Input
                            label="От"
                            type="number"
                            value={experienceFrom?.toString() ?? ""}
                            min={0}
                            onChange={(e) => {
                                setExperienceFrom(e.target.value ? parseInt(e.target.value) : undefined);
                            }}
                        ></Input>
                        <Input
                            label="До"
                            type="number"
                            value={experienceTo?.toString() ?? ""}
                            onChange={(e) => {
                                setExperienceTo(e.target.value ? parseInt(e.target.value) : undefined);
                            }}
                            min={1}
                        ></Input>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                    <Button
                        variant="flat"
                        className="flex-1"
                        onPress={() => {
                            handleReset();
                            setSearchTerm("");
                        }}
                    >
                        Сбросить
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 flex-1" onPress={handleSearch}>
                        Найти
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
