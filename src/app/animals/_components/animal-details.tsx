"use client";

import {
    Baby,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Heart,
    Home,
    MapPin,
    Palette,
    Ruler,
    Shield,
    Syringe,
    Users,
    Weight,
} from "lucide-react";

import { useEffect, useState } from "react";

import { sampleAnimals } from "@/data/sample-animals";
import { Animal } from "@/types/Animal";
import { MedicalInfo } from "@/types/medical-info";
import { Temperament } from "@/types/temperament";
import { Chip } from "@heroui/chip";
import { Button, Divider, Tab, Tabs } from "@heroui/react";

interface DetailsProps {
    selectedAnimalId: string;
}

export default function AnimalDetails({ selectedAnimalId }: DetailsProps) {
    const [selectedAnimal, setSelectedAnimal] = useState<{
        animal: Animal;
        medical: MedicalInfo;
        temperament: Temperament;
    } | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setSelectedAnimal(sampleAnimals[selectedAnimalId]);
    }, [selectedAnimalId]);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "adopted":
                return { label: "Пристроен", color: "success" };
            case "looking_for_home":
                return { label: "В поисках дома", color: "warning" };
            case "needs_help":
                return { label: "Нуждается в помощи", color: "danger" };
            default:
                return { label: "Неизвестно", color: "default" };
        }
    };

    const getGenderLabel = (gender: string) => {
        switch (gender) {
            case "male":
                return "Самец";
            case "female":
                return "Самка";
            default:
                return "Неизвестно";
        }
    };

    const getSourceLabel = (source: string) => {
        switch (source) {
            case "stray":
                return "Бездомный";
            case "shelter":
                return "Из другого приюта";
            case "person":
                return "От человека";
            default:
                return "Неизвестно";
        }
    };

    const nextImage = () => {
        if (selectedAnimal && currentImageIndex < selectedAnimal.animal.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ru-RU");
    };

    return (
        <div>
            <h3 className="flex items-center justify-between text-2xl font-bold text-white">
                {selectedAnimal?.animal.name}
                <Chip
                    className="text-white"
                    color={getStatusLabel(String(selectedAnimal?.animal.status)).color}
                    variant="flat"
                >
                    {getStatusLabel(String(selectedAnimal?.animal.status)).label}
                </Chip>
            </h3>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Image Carousel */}
                <div className="space-y-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                            src={selectedAnimal?.animal.images[currentImageIndex] ?? "/placeholder.svg"}
                            alt={`${selectedAnimal?.animal.name} - фото ${currentImageIndex + 1}`}
                            className="object-cover"
                        />
                        {selectedAnimal?.animal.images.length > 1 && (
                            <>
                                <Button
                                    variant="flat"
                                    isIconOnly
                                    className="absolute top-1/2 left-2 -translate-y-1/2 transform bg-black/50 hover:bg-black/70"
                                    onPress={prevImage}
                                    isDisabled={currentImageIndex === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="flat"
                                    isIconOnly
                                    className="absolute top-1/2 right-2 -translate-y-1/2 transform bg-black/50 hover:bg-black/70"
                                    onPress={nextImage}
                                    isDisabled={currentImageIndex === selectedAnimal?.animal.images.length - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                    {selectedAnimal?.animal.images.length > 1 && (
                        <div className="flex justify-center gap-2">
                            {selectedAnimal?.animal.images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`h-2 w-2 rounded-full ${
                                        index === currentImageIndex ? "bg-green-500" : "bg-gray-600"
                                    }`}
                                    onClick={() => { setCurrentImageIndex(index); }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Animal Information */}
                <div className="space-y-4">
                    <Tabs fullWidth>
                        <Tab key="general" title="Основное">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Возраст:</span>
                                        <span>{selectedAnimal?.animal.age}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Пол:</span>
                                        <span>{getGenderLabel(String(selectedAnimal?.animal.gender))}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Palette className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Цвет:</span>
                                        <span>{selectedAnimal?.animal.color}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Ruler className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Рост:</span>
                                        <span>{selectedAnimal?.animal.height}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Weight className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Вес:</span>
                                        <span>{selectedAnimal?.animal.weight}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Home className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Откуда:</span>
                                        <span>{getSourceLabel(String(selectedAnimal?.animal.source))}</span>
                                    </div>
                                </div>

                                <Divider className="bg-gray-700" />

                                <div>
                                    <h4 className="mb-2 flex items-center gap-2 font-semibold">
                                        <MapPin className="h-4 w-4 text-green-500" />
                                        Местоположение
                                    </h4>
                                    <p className="text-sm text-gray-300">{selectedAnimal?.animal.shelterAddress}</p>
                                </div>

                                <div>
                                    <h4 className="mb-2 font-semibold">Описание</h4>
                                    <p className="text-sm text-gray-300">{selectedAnimal?.animal.description}</p>
                                </div>

                                <div>
                                    <h4 className="mb-2 font-semibold">Даты</h4>
                                    <div className="space-y-1 text-sm">
                                        <div>
                                            <span className="text-gray-400">Дата рождения:</span>{" "}
                                            <span>{formatDate(String(selectedAnimal?.animal.birthDate))}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Поступил в приют:</span>{" "}
                                            <span>{formatDate(String(selectedAnimal?.animal.arrivalDate))}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>

                        <Tab key="medical" title="Здоровье">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Syringe className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Привит:</span>
                                        <span
                                            className={
                                                selectedAnimal?.medical.isVaccinated ? "text-green-400" : "text-red-400"
                                            }
                                        >
                                            {selectedAnimal?.medical.isVaccinated ? "Да" : "Нет"}
                                        </span>
                                    </div>
                                    {selectedAnimal?.medical.isVaccinated && selectedAnimal.medical.vaccinationDate && (
                                        <div className="text-sm">
                                            <span className="text-gray-400">Дата прививки:</span>{" "}
                                            <span>{formatDate(String(selectedAnimal.medical.vaccinationDate))}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Стерилизован:</span>
                                        <span
                                            className={
                                                selectedAnimal?.medical.isSterilized ? "text-green-400" : "text-red-400"
                                            }
                                        >
                                            {selectedAnimal?.medical.isSterilized ? "Да" : "Нет"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Хронические болезни:</span>
                                        <span
                                            className={
                                                selectedAnimal?.medical.hasChronicDiseases
                                                    ? "text-yellow-400"
                                                    : "text-green-400"
                                            }
                                        >
                                            {selectedAnimal?.medical.hasChronicDiseases ? "Есть" : "Нет"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Спец. питание:</span>
                                        <span
                                            className={
                                                selectedAnimal?.medical.needsSpecialDiet
                                                    ? "text-yellow-400"
                                                    : "text-green-400"
                                            }
                                        >
                                            {selectedAnimal?.medical.needsSpecialDiet ? "Требуется" : "Не требуется"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Аллергии:</span>
                                        <span
                                            className={
                                                selectedAnimal?.medical.hasAllergies
                                                    ? "text-yellow-400"
                                                    : "text-green-400"
                                            }
                                        >
                                            {selectedAnimal?.medical.hasAllergies ? "Есть" : "Нет"}
                                        </span>
                                    </div>
                                </div>

                                <Divider className="bg-gray-700" />

                                <div>
                                    <h4 className="mb-2 font-semibold">Состояние здоровья</h4>
                                    <p className="text-sm text-gray-300">{selectedAnimal?.animal.healthStatus}</p>
                                </div>

                                {selectedAnimal?.medical.medicalDescription && (
                                    <div>
                                        <h4 className="mb-2 font-semibold">Медицинское описание</h4>
                                        <p className="text-sm text-gray-300">
                                            {selectedAnimal.medical.medicalDescription}
                                        </p>
                                    </div>
                                )}

                                {selectedAnimal?.medical.hasAllergies &&
                                    selectedAnimal.medical.allergiesDescription && (
                                        <div>
                                            <h4 className="mb-2 font-semibold">Описание аллергий</h4>
                                            <p className="text-sm text-gray-300">
                                                {selectedAnimal.medical.allergiesDescription}
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </Tab>

                        <Tab key="temperament" title="Характер">
                            <div className="space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-medium">Уровень агрессии</span>
                                            <span className="text-sm text-gray-400">
                                                {selectedAnimal?.temperament.aggressionLevel}/10
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-700">
                                            <div
                                                className="h-2 rounded-full bg-red-500"
                                                style={{
                                                    width: `${(selectedAnimal?.temperament.aggressionLevel / 10) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-medium">Дружелюбие</span>
                                            <span className="text-sm text-gray-400">
                                                {selectedAnimal?.temperament.friendlinessLevel}/10
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-700">
                                            <div
                                                className="h-2 rounded-full bg-green-500"
                                                style={{
                                                    width: `${(selectedAnimal?.temperament.friendlinessLevel / 10) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-medium">Активность</span>
                                            <span className="text-sm text-gray-400">
                                                {selectedAnimal?.temperament.activityLevel}/10
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-700">
                                            <div
                                                className="h-2 rounded-full bg-blue-500"
                                                style={{
                                                    width: `${(selectedAnimal?.temperament.activityLevel / 10) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Divider className="bg-gray-700" />

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-2">
                                        <Baby className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Отношение к детям:</span>
                                        <span
                                            className={
                                                selectedAnimal?.temperament.goodWithChildren
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                            }
                                        >
                                            {selectedAnimal?.temperament.goodWithChildren ? "Хорошее" : "Осторожное"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Отношение к людям:</span>
                                        <span
                                            className={
                                                selectedAnimal?.temperament.goodWithPeople
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                            }
                                        >
                                            {selectedAnimal?.temperament.goodWithPeople ? "Хорошее" : "Осторожное"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Отношение к животным:</span>
                                        <span
                                            className={
                                                selectedAnimal?.temperament.goodWithAnimals
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                            }
                                        >
                                            {selectedAnimal?.temperament.goodWithAnimals ? "Хорошее" : "Осторожное"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                <div className="text-sm text-gray-400">
                    Добавлено: {selectedAnimal?.animal.dateAdded} • {selectedAnimal?.animal.location}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-600">
                        <Heart className="mr-2 h-4 w-4" />В избранное
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600">Связаться с приютом</Button>
                </div>
            </div>
        </div>
    );
}
