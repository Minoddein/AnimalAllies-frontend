"use client";

import { Filter, MapPin, Search, Star } from "lucide-react";

import { useState } from "react";

import { Button, Card, CardBody, CardHeader, Chip, Input } from "@heroui/react";

export default function VolunteerSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState("");

    const skills = [
        "Уход за животными",
        "Фотография",
        "Транспортировка",
        "Ветеринария",
        "Социальные сети",
        "Организация мероприятий",
        "Строительство",
        "Обучение",
    ];

    const locations = ["Москва", "Санкт-Петербург", "Екатеринбург", "Новосибирск", "Казань"];

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
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
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                        type="text"
                        placeholder="Поиск по имени..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                        className="bg-background/50 focus:ring-primary/20 border-0 pl-10 focus:ring-2"
                    />
                </div>

                {/* Location Filter */}
                <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <MapPin className="text-primary h-4 w-4" />
                        Город
                    </h3>
                    <div className="space-y-2">
                        {locations.map((location) => (
                            <label key={location} className="flex cursor-pointer items-center space-x-2">
                                <input
                                    type="radio"
                                    name="location"
                                    value={location}
                                    checked={selectedLocation === location}
                                    onChange={(e) => {
                                        setSelectedLocation(e.target.value);
                                    }}
                                    className="text-primary focus:ring-primary"
                                />
                                <span className="text-sm">{location}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Skills Filter */}
                <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <Star className="text-primary h-4 w-4" />
                        Навыки
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <Chip
                                key={skill}
                                variant={selectedSkills.includes(skill) ? "dot" : "flat"}
                                className="hover:bg-primary/20 cursor-pointer transition-colors"
                                onClick={() => {
                                    toggleSkill(skill);
                                }}
                            >
                                {skill}
                            </Chip>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                    <Button
                        variant="flat"
                        className="flex-1"
                        onPress={() => {
                            setSearchTerm("");
                            setSelectedSkills([]);
                            setSelectedLocation("");
                        }}
                    >
                        Сбросить
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 flex-1">Найти</Button>
                </div>
            </CardBody>
        </Card>
    );
}
