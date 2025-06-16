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

import { PetDto } from "@/api/dtos/pet/petDtos";
import { FileKey, getManyDownloadPresignedUrls } from "@/api/files";
import { getPetById } from "@/api/pet";
import { Chip } from "@heroui/chip";
import { Button, Divider, Tab, Tabs } from "@heroui/react";

interface DetailsProps {
    selectedAnimalId: string;
}

function getAgeWord(age: number): string {
    if (age % 100 >= 11 && age % 100 <= 14) return "лет";
    const lastDigit = age % 10;
    return lastDigit === 1 ? "год" : lastDigit >= 2 && lastDigit <= 4 ? "года" : "лет";
}

function calculateAge(birthDate: string): string {
    if (!birthDate) return "Возраст неизвестен";

    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age--;
    }

    return `${age} ${getAgeWord(age)}`;
}

export default function AnimalDetails({ selectedAnimalId }: DetailsProps) {
    const [pet, setPet] = useState<PetDto | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPet = async () => {
            try {
                setIsLoading(true);
                const response = await getPetById(selectedAnimalId);
                if (!response.data.result?.value) {
                    throw new Error("Pet not found");
                }

                let pet = response.data.result.value;

                // Загрузка изображений только если они есть
                if (pet.petPhotos.length > 0) {
                    const fileKeys: FileKey[] = pet.petPhotos
                        .map((photo) => {
                            const filename = photo.path.split("/").pop() ?? "";
                            const [fileId, ...extensionParts] = filename.split(".");
                            const extension = extensionParts.join(".");
                            return { fileId, extension };
                        })
                        .filter((key): key is FileKey => !!key.fileId);

                    if (fileKeys.length > 0) {
                        const responseUrls = await getManyDownloadPresignedUrls({
                            bucketName: "photos",
                            fileKeys,
                        });

                        // Обновляем пути всех фотографий
                        pet = {
                            ...pet,
                            petPhotos: pet.petPhotos.map((photo, index) => ({
                                ...photo,
                                path: responseUrls.data[index] || photo.path,
                            })),
                        };
                    }
                }

                setPet(pet);
            } catch (error) {
                console.error("Error loading pet:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadPet();
    }, [selectedAnimalId]);

    const getStatusLabel = (status: string): { label: string; color: "success" | "warning" | "danger" | "default" } => {
        switch (status) {
            case "FoundHome":
                return { label: "Пристроен", color: "success" };
            case "SearchingHome":
                return { label: "В поисках дома", color: "warning" };
            case "NeedsHelp":
                return { label: "Нуждается в помощи", color: "danger" };
            default:
                return { label: "Неизвестно", color: "default" };
        }
    };

    const getGenderLabel = (gender?: string) => {
        switch (gender) {
            case "male":
                return "Самец";
            case "female":
                return "Самка";
            default:
                return "Неизвестно";
        }
    };

    const nextImage = () => {
        if (pet && currentImageIndex < pet.petPhotos.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Не указана";
        return new Date(dateString).toLocaleDateString("ru-RU");
    };

    if (isLoading) {
        return <div className="flex h-full items-center justify-center">Загрузка...</div>;
    }

    if (!pet) {
        return <div className="flex h-full items-center justify-center">Животное не найдено</div>;
    }

    const status = getStatusLabel(pet.helpStatus);
    const hasMultiplePhotos = pet.petPhotos.length > 1;

    return (
        <div className="block h-[80vh] md:h-full">
            <h3 className="mb-2 flex items-center justify-between text-xl font-bold text-white md:text-2xl">
                {pet.petName}
                <Chip className="text-white" color={status.color} variant="flat">
                    {status.label}
                </Chip>
            </h3>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Image Carousel */}
                {/* Исправленная карусель изображений */}
                <div className="space-y-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        {/* Текущее изображение */}
                        {pet.petPhotos.length > 0 && (
                            <img
                                src={pet.petPhotos[currentImageIndex].path || "/placeholder.svg"}
                                alt={`${pet.petName} - фото ${currentImageIndex + 1}`}
                                className="h-full w-full object-cover"
                            />
                        )}

                        {/* Кнопки навигации */}
                        {hasMultiplePhotos && (
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
                                    isDisabled={currentImageIndex === pet.petPhotos.length - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Индикаторы для множества фото */}
                    {hasMultiplePhotos && (
                        <div className="flex justify-center gap-2">
                            {pet.petPhotos.map((_, index) => (
                                <button
                                    key={index}
                                    className={`h-2 w-2 rounded-full transition-colors ${
                                        index === currentImageIndex ? "bg-green-500" : "bg-gray-600"
                                    }`}
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                    }}
                                    aria-label={`Перейти к фото ${index + 1}`}
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
                                        <span>{calculateAge(pet.birthDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Пол:</span>
                                        <span>{getGenderLabel(pet.sex)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Palette className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Цвет:</span>
                                        <span>{pet.color}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Ruler className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Рост:</span>
                                        <span>{pet.height} см</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Weight className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Вес:</span>
                                        <span>{pet.weight} кг</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Home className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Порода:</span>
                                        <span>{pet.breedName}</span>
                                    </div>
                                </div>

                                <Divider className="bg-gray-700" />

                                <div>
                                    <h4 className="mb-2 flex items-center gap-2 font-semibold">
                                        <MapPin className="h-4 w-4 text-green-500" />
                                        Адрес
                                    </h4>
                                    <p className="text-sm text-gray-300">
                                        {pet.state}, {pet.city}, {pet.street}, {pet.zipCode}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="mb-2 font-semibold">Описание</h4>
                                    <p className="text-sm text-gray-300">{pet.description}</p>
                                </div>

                                <div>
                                    <h4 className="mb-2 font-semibold">Даты</h4>
                                    <div className="space-y-1 text-sm">
                                        <div>
                                            <span className="text-gray-400">Дата рождения:</span>{" "}
                                            <span>{formatDate(pet.birthDate)}</span>
                                        </div>
                                        {pet.arriveDate && (
                                            <div>
                                                <span className="text-gray-400">Поступил в приют:</span>{" "}
                                                <span>{formatDate(pet.arriveDate)}</span>
                                            </div>
                                        )}
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
                                        <span className={pet.isVaccinated ? "text-green-400" : "text-red-400"}>
                                            {pet.isVaccinated ? "Да" : "Нет"}
                                        </span>
                                    </div>
                                    {pet.isVaccinated && pet.lastVaccinationDate && (
                                        <div className="text-sm">
                                            <span className="text-gray-400">Дата прививки:</span>{" "}
                                            <span>{formatDate(pet.lastVaccinationDate)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Стерилизован:</span>
                                        <span className={pet.isSpayedNeutered ? "text-green-400" : "text-red-400"}>
                                            {pet.isSpayedNeutered ? "Да" : "Нет"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Хронические болезни:</span>
                                        <span className={pet.hasChronicDiseases ? "text-yellow-400" : "text-green-400"}>
                                            {pet.hasChronicDiseases ? "Есть" : "Нет"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Спец. питание:</span>
                                        <span
                                            className={pet.requiresSpecialDiet ? "text-yellow-400" : "text-green-400"}
                                        >
                                            {pet.requiresSpecialDiet ? "Требуется" : "Не требуется"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Аллергии:</span>
                                        <span className={pet.hasAllergies ? "text-yellow-400" : "text-green-400"}>
                                            {pet.hasAllergies ? "Есть" : "Нет"}
                                        </span>
                                    </div>
                                </div>

                                <Divider className="bg-gray-700" />

                                <div>
                                    <h4 className="mb-2 font-semibold">Состояние здоровья</h4>
                                    <p className="text-sm text-gray-300">{pet.healthInformation}</p>
                                </div>

                                {pet.medicalNotes && (
                                    <div>
                                        <h4 className="mb-2 font-semibold">Медицинские заметки</h4>
                                        <p className="text-sm text-gray-300">{pet.medicalNotes}</p>
                                    </div>
                                )}
                            </div>
                        </Tab>

                        <Tab key="temperament" title="Характер">
                            <div className="space-y-4">
                                <div className="space-y-4">
                                    {pet.aggressionLevel !== undefined && (
                                        <div>
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-sm font-medium">Уровень агрессии</span>
                                                <span className="text-sm text-gray-400">{pet.aggressionLevel}/10</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-700">
                                                <div
                                                    className="h-2 rounded-full bg-red-500"
                                                    style={{ width: `${(pet.aggressionLevel / 10) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {pet.friendliness !== undefined && (
                                        <div>
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-sm font-medium">Дружелюбие</span>
                                                <span className="text-sm text-gray-400">{pet.friendliness}/10</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-700">
                                                <div
                                                    className="h-2 rounded-full bg-green-500"
                                                    style={{ width: `${(pet.friendliness / 10) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {pet.activityLevel !== undefined && (
                                        <div>
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-sm font-medium">Активность</span>
                                                <span className="text-sm text-gray-400">{pet.activityLevel}/10</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-700">
                                                <div
                                                    className="h-2 rounded-full bg-blue-500"
                                                    style={{ width: `${(pet.activityLevel / 10) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Divider className="bg-gray-700" />

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-2">
                                        <Baby className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Отношение к детям:</span>
                                        <span className={pet.goodWithKids ? "text-green-400" : "text-red-400"}>
                                            {pet.goodWithKids ? "Хорошее" : "Осторожное"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Отношение к людям:</span>
                                        <span className={pet.goodWithPeople ? "text-green-400" : "text-red-400"}>
                                            {pet.goodWithPeople ? "Хорошее" : "Осторожное"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-400">Отношение к животным:</span>
                                        <span className={pet.goodWithOtherAnimals ? "text-green-400" : "text-red-400"}>
                                            {pet.goodWithOtherAnimals ? "Хорошее" : "Осторожное"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                <div className="text-sm text-gray-400">Контактный телефон: {pet.phoneNumber || "Не указан"}</div>
                <div className="flex gap-2">
                    <Button variant="faded" className="border-gray-600">
                        <Heart className="mr-2 h-4 w-4" />В избранное
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600">Связаться с волонтером</Button>
                </div>
            </div>
        </div>
    );
}
