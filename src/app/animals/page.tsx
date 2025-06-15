"use client";

import React, { useEffect, useMemo, useState } from "react";

import { PetDto } from "@/api/dtos/pet/petDtos";
import { getManyDownloadPresignedUrls } from "@/api/files";
import { getPetsWithPagination } from "@/api/pet";
import AnimalsCards from "@/app/animals/_components/animals-cards";
import { MainCards } from "@/components/main-cards";
import { SearchCardOrDrawer } from "@/components/search/search-card-or-drawer";
import { AnimalItem } from "@/types/AnimalItem";
import { SearchAnimalsParams } from "@/types/search";
import { Input } from "@heroui/react";
import { Icon } from "@iconify/react";

interface FileKey {
    fileId: string;
    extension: string;
}

export default function AnimalsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [pagedData, setPagedData] = useState<{ items: PetDto[]; totalCount: number }>({
        items: [],
        totalCount: 0,
    });
    const [page, setPage] = useState(1);
    const [searchParams, setSearchParams] = useState<SearchAnimalsParams>({});
    const perPage = 8;
    const totalPages = Math.ceil(pagedData.totalCount / perPage);

    const calculateAge = (birthDate: string): string => {
        if (!birthDate) return "Возраст неизвестен";

        const birth = new Date(birthDate);
        const now = new Date();
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        if (years === 0) {
            return `${months} ${getRussianMonthsWord(months)}`;
        }

        return `${years} ${getRussianYearsWord(years)} ${months} ${getRussianMonthsWord(months)}`;
    };

    const getRussianYearsWord = (years: number): string => {
        const lastDigit = years % 10;
        const lastTwoDigits = years % 100;

        if (lastDigit === 1 && lastTwoDigits !== 11) return "год";
        if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) return "года";
        return "лет";
    };

    const getRussianMonthsWord = (months: number): string => {
        const lastDigit = months % 10;
        const lastTwoDigits = months % 100;

        if (lastDigit === 1 && lastTwoDigits !== 11) return "месяц";
        if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) return "месяца";
        return "месяцев";
    };

    const getHumanAttitude = (pet: PetDto): string => {
        if (pet.goodWithPeople) return "Хорошее";
        if (pet.aggressionLevel && pet.aggressionLevel > 5) return "Агрессивное";
        return "Нейтральное";
    };

    const getAnimalAttitude = (pet: PetDto): string => {
        if (pet.goodWithOtherAnimals) return "Хорошее";
        if (pet.aggressionLevel && pet.aggressionLevel > 5) return "Агрессивное";
        return "Нейтральное";
    };

    const generateHashtags = (pet: PetDto): string[] => {
        const hashtags = [];

        if (pet.sex) {
            hashtags.push(pet.sex === "male" ? "#самец" : "#самка");
        }

        if (pet.speciesName) {
            hashtags.push(`#${pet.speciesName.toLowerCase()}`);
        }

        if (pet.breedName) {
            hashtags.push(`#${pet.breedName.toLowerCase().replace(/\s+/g, "")}`);
        }

        if (pet.color) {
            hashtags.push(`#${pet.color.toLowerCase()}`);
        }

        return hashtags.length > 0 ? hashtags : ["#питомец"];
    };

    useEffect(() => {
        const loadPets = async () => {
            setIsLoading(true);
            try {
                const response = await getPetsWithPagination(perPage, page);
                if (!response.data.result?.value) {
                    throw new Error("Cannot load pets");
                }

                let pets = response.data.result.value.items;

                if (pets.some((pet) => pet.petPhotos.length > 0)) {
                    const fileKeys: FileKey[] = pets
                        .filter((pet) => pet.petPhotos.length > 0)
                        .map((pet) => {
                            const mainPhoto = pet.petPhotos.find((photo) => photo.isMain) ?? pet.petPhotos[0];
                            const filename = mainPhoto.path.split("/").pop() ?? "";
                            const [fileId, ...extensionParts] = filename.split(".");
                            const extension = extensionParts.join(".");

                            return {
                                fileId,
                                extension,
                            };
                        })
                        .filter((key): key is FileKey => !!key.fileId);

                    if (fileKeys.length > 0) {
                        const responseUrls = await getManyDownloadPresignedUrls({
                            bucketName: "photos",
                            fileKeys,
                        });

                        pets = pets.map((pet, index) => {
                            if (pet.petPhotos.length > 0 && index < responseUrls.data.length) {
                                return {
                                    ...pet,
                                    petPhotos: [
                                        {
                                            ...pet.petPhotos[0],
                                            path: responseUrls.data[index],
                                        },
                                    ],
                                };
                            }
                            return pet;
                        });
                    }
                }

                setPagedData({
                    items: pets,
                    totalCount: response.data.result.value.totalCount,
                });
            } catch (error) {
                console.error("Ошибка при загрузке животных:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadPets();
    }, [page, searchParams]);

    const animalsData = useMemo(() => {
        return pagedData.items.map((pet) => ({
            id: pet.petId,
            name: pet.petName,
            image:
                pet.petPhotos.length > 0
                    ? pet.petPhotos[0].path
                    : "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1ueISv.img?w=1280&h=857&m=4&q=91",
            age: calculateAge(pet.birthDate) || "Неизвестно",
            isVaccinated: pet.isVaccinated ?? false,
            humanAttitude: getHumanAttitude(pet),
            animalsAttitude: getAnimalAttitude(pet),
            hashtags: generateHashtags(pet),
            description: pet.description,
            sex: pet.sex === "Male" ? "Мальчик" : "Девочка",
            species: pet.speciesName,
            breed: pet.breedName,
        }));
    }, [pagedData]);

    const handleSearch = (params: SearchAnimalsParams) => {
        setSearchParams(params);
        setPage(1);
    };

    return (
        <div className="flex min-h-[100vh] w-full">
            <SearchCardOrDrawer onSearchAction={handleSearch} />

            <div className="flex flex-1 flex-col">
                <div className="p-4 pb-2">
                    <Input
                        label="Поиск по имени"
                        type="text"
                        startContent={<Icon icon="material-symbols:search-rounded" className="h-5 w-5" />}
                        value={searchParams.name ?? ""}
                        onChange={(e) => {
                            setSearchParams((prev) => ({ ...prev, name: e.target.value.trim() }));
                        }}
                    />
                </div>

                <div className="flex-1 px-4">
                    <MainCards<AnimalItem>
                        isLoading={isLoading}
                        pageItems={animalsData}
                        totalPages={totalPages || 1}
                        page={page}
                        setPageAction={setPage}
                        renderCardsAction={(items) => <AnimalsCards paginatedData={items} />}
                    />
                </div>
            </div>
        </div>
    );
}
