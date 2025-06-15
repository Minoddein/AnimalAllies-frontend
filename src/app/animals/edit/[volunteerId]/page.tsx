"use client";

import { Save, X } from "lucide-react";

import type React from "react";
import { useEffect, useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { AddPetRequest, PetDto } from "@/api/dtos/pet/petDtos";
import { getManyDownloadPresignedUrls } from "@/api/files";
import { UploadFileDto, addPetPhotos, addPetToVolunteer, deletePetPhotos, getPetById, updatePet } from "@/api/pet";
import { getAllSpeciesWithBreeds } from "@/api/species";
import { UploadForm } from "@/app/animals/edit/[volunteerId]/_components/upload-form";
import { Breed } from "@/models/breed";
import { Species } from "@/models/species";
import { Animal } from "@/types/Animal";
import { FilePreview } from "@/types/file-preview";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    DatePicker,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Radio,
    RadioGroup,
    Slider,
    Tab,
    Tabs,
    Textarea,
    addToast,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";

// Пример данных для нового животного
const emptyAnimal: Animal = {
    id: "",
    name: "",
    type: "",
    breed: "",
    gender: "unknown",
    status: "needs_help",
    location: "",
    images: [],
    dateAdded: new Date().toLocaleDateString("ru-RU"),
    description: "",
    birthDate: "",
    arrivalDate: new Date().toISOString().split("T")[0],
    lastOwner: "",
    source: "stray",
    color: "",
    height: "",
    weight: "",
    healthStatus: "",
    phoneNumber: "",
    shelterAddress: "",
    state: "",
    city: "",
    street: "",
    zipCode: "",
    speciesName: "",
    breedName: "",
};

// Дополнительные поля для медицинской информации
interface MedicalInfo {
    isVaccinated: boolean;
    vaccinationDate: string;
    isSterilized: boolean;
    hasChronicDiseases: boolean;
    medicalDescription: string;
    needsSpecialDiet: boolean;
    hasAllergies: boolean;
}

// Дополнительные поля для темперамента
interface Temperament {
    aggressionLevel: number;
    friendlinessLevel: number;
    activityLevel: number;
    goodWithChildren: boolean;
    goodWithPeople: boolean;
    goodWithAnimals: boolean;
}

// Пример данных для медицинской информации
const emptyMedicalInfo: MedicalInfo = {
    isVaccinated: false,
    vaccinationDate: "",
    isSterilized: false,
    hasChronicDiseases: false,
    medicalDescription: "",
    needsSpecialDiet: false,
    hasAllergies: false,
};

// Пример данных для темперамента
const emptyTemperament: Temperament = {
    aggressionLevel: 1,
    friendlinessLevel: 5,
    activityLevel: 5,
    goodWithChildren: false,
    goodWithPeople: true,
    goodWithAnimals: false,
};

const petDtoToAnimal = (pet: PetDto): Animal => ({
    id: pet.petId,
    name: pet.petName,
    type: pet.speciesName || "",
    breed: pet.breedName || "",
    gender: pet.sex ? (pet.sex.toLowerCase() as "male" | "female" | "unknown") : "unknown",
    status:
        pet.helpStatus === "NeedsHelp"
            ? "needs_help"
            : pet.helpStatus === "SearchingHome"
              ? "looking_for_home"
              : "adopted",
    location: `${pet.state || ""}, ${pet.city || ""}`,
    images: pet.petPhotos.length > 0 ? pet.petPhotos.map((p) => p.path) : [],
    description: pet.description || "",
    dateAdded: new Date().toLocaleDateString("ru-RU"),
    birthDate: pet.birthDate || "",
    arrivalDate: pet.arriveDate ?? new Date().toISOString().split("T")[0],
    lastOwner: pet.lastOwner ?? "",
    source: pet.from === "Homeless" ? "stray" : pet.from === "Shelter" ? "shelter" : "person",
    color: pet.color || "",
    height: pet.height ? pet.height.toString() : "",
    weight: pet.weight ? pet.weight.toString() : "",
    healthStatus: pet.healthInformation || "",
    phoneNumber: pet.phoneNumber || "",
    shelterAddress: pet.street || "",
    state: pet.state || "",
    city: pet.city || "",
    street: pet.street || "",
    zipCode: pet.zipCode || "",
    speciesName: pet.speciesName || "",
    breedName: pet.breedName || "",
    arriveDate: pet.arriveDate,
    sex: pet.sex,
    isSpayedNeutered: pet.isSpayedNeutered ?? false,
    isVaccinated: pet.isVaccinated ?? false,
    lastVaccinationDate: pet.lastVaccinationDate,
    hasChronicDiseases: pet.hasChronicDiseases ?? false,
    medicalNotes: pet.medicalNotes,
    requiresSpecialDiet: pet.requiresSpecialDiet ?? false,
    hasAllergies: pet.hasAllergies ?? false,
    aggressionLevel: pet.aggressionLevel ?? 1,
    friendliness: pet.friendliness ?? 5,
    activityLevel: pet.activityLevel ?? 5,
    goodWithKids: pet.goodWithKids ?? false,
    goodWithPeople: pet.goodWithPeople ?? true,
    goodWithOtherAnimals: pet.goodWithOtherAnimals ?? false,
});

export function getContentTypeFromExtension(extension: string): string {
    const formattedExtension = extension.replace(".", "").toLowerCase();

    return formattedExtension === "jpg" ? "image/jpeg" : `image/${formattedExtension}`;
}

export default function EditAnimalPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const animalId = searchParams.get("id");
    const isEditMode = !!animalId;
    const params = useParams();
    const volunteerId = params.volunteerId as string;

    const [removedFiles, setRemovedFiles] = useState<string[]>([]);

    const [animal, setAnimal] = useState<Animal>(emptyAnimal);
    const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>(emptyMedicalInfo);
    const [temperament, setTemperament] = useState<Temperament>(emptyTemperament);
    const [isLoading, setIsLoading] = useState(false);

    const [species, setSpecies] = useState<Species[]>([]);
    const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("");
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [selectedBreedId, setSelectedBreedId] = useState<string>("");
    const [isLoadingSpecies, setIsLoadingSpecies] = useState(false);

    const [files, setFiles] = useState<FilePreview[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "adopted":
                return "Пристроен";
            case "looking_for_home":
                return "Ищет дом";
            case "needs_help":
                return "Нуждается в помощи";
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

    useEffect(() => {
        const fetchSpecies = async () => {
            setIsLoadingSpecies(true);
            try {
                const responseSpecies = await getAllSpeciesWithBreeds();
                if (responseSpecies.data.result?.isSuccess && responseSpecies.data.result.value) {
                    setSpecies(responseSpecies.data.result.value);

                    // Если редактируем существующее животное, устанавливаем выбранные значения
                    if (animalId) {
                        const response = await getPetById(animalId);
                        if (response.data.result?.isSuccess && response.data.result.value) {
                            const petData = response.data.result.value;

                            if (petData.speciesName) {
                                const foundSpecies = responseSpecies.data.result.value.find(
                                    (s) => s.speciesName === petData.speciesName,
                                );
                                if (foundSpecies) {
                                    setSelectedSpeciesId(foundSpecies.speciesId);
                                    setBreeds(foundSpecies.breeds ?? []);

                                    if (petData.breedName) {
                                        const foundBreed = foundSpecies.breeds?.find(
                                            (b) => b.breedName === petData.breedName,
                                        );
                                        if (foundBreed) {
                                            setSelectedBreedId(foundBreed.breedId);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Ошибка при загрузке видов и пород:", error);
            } finally {
                setIsLoadingSpecies(false);
            }
        };

        void fetchSpecies();
    }, [animalId]);

    const uploadFileToS3 = async (presignedUrl: string, file: File) => {
        return fetch(presignedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        });
    };

    const handleRemoveFile = (id: string, isExisting: boolean) => {
        setFiles((prev) => prev.filter((file) => file.id !== id));
        if (isExisting) {
            const fileToRemove = files.find((f) => f.id === id);
            if (fileToRemove?.preview) {
                setRemovedFiles((prev) => [...prev, fileToRemove.preview]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        console.log("Проверка типов:", {
            aggressionLevel: {
                value: temperament.aggressionLevel,
                type: typeof temperament.aggressionLevel,
            },
            friendlinessLevel: {
                value: temperament.friendlinessLevel,
                type: typeof temperament.friendlinessLevel,
            },
            activityLevel: {
                value: temperament.activityLevel,
                type: typeof temperament.activityLevel,
            },
        });

        try {
            const request: AddPetRequest = {
                name: animal.name || "",
                petPhysicCharacteristicsDto: {
                    color: animal.color,
                    healthInformation: animal.healthStatus,
                    weight: parseFloat(animal.weight),
                    height: parseFloat(animal.height),
                },
                petDetailsDto: {
                    description: animal.description,
                    birthDate: animal.birthDate ? new Date(animal.birthDate).toISOString() : new Date().toISOString(),
                },
                addressDto: {
                    street: animal.street ?? "",
                    city: animal.city ?? "",
                    state: animal.state ?? "",
                    zipCode: animal.zipCode ?? "",
                },
                phoneNumber: animal.phoneNumber,
                helpStatus:
                    animal.status === "needs_help"
                        ? "NeedsHelp"
                        : animal.status === "looking_for_home"
                          ? "SearchingHome"
                          : "FoundHome",
                animalTypeDto: {
                    speciesId: selectedSpeciesId,
                    breedId: selectedBreedId,
                },
                animalSex: animal.gender === "male" ? "Male" : animal.gender === "female" ? "Female" : "Неизвестно",
                historyDto: {
                    arriveTime: animal.arrivalDate
                        ? new Date(animal.arrivalDate).toISOString()
                        : new Date().toISOString(),
                    lastOwner: animal.lastOwner ?? "",
                    from:
                        animal.source === "stray"
                            ? "Homeless"
                            : animal.source === "shelter"
                              ? "Shelter"
                              : "PrivatePerson",
                },
                temperamentDto: {
                    aggressionLevel: Number(temperament.aggressionLevel),
                    friendliness: Number(temperament.friendlinessLevel),
                    activityLevel: Number(temperament.activityLevel),
                    goodWithKids: temperament.goodWithChildren,
                    goodWithPeople: temperament.goodWithPeople,
                    goodWithOtherAnimals: temperament.goodWithAnimals,
                },
                medicalInfoDto: {
                    isSpayedNeutered: medicalInfo.isSterilized,
                    isVaccinated: medicalInfo.isVaccinated,
                    lastVaccinationDate: medicalInfo.vaccinationDate
                        ? new Date(medicalInfo.vaccinationDate).toISOString()
                        : null,
                    hasChronicDiseases: medicalInfo.hasChronicDiseases,
                    medicalNotes: medicalInfo.medicalDescription || null,
                    requiresSpecialDiet: medicalInfo.needsSpecialDiet,
                    hasAllergies: medicalInfo.hasAllergies,
                },
                requisitesDto: [],
            };

            console.log("Sending request:", JSON.stringify(request, null, 2)); // Для отладки

            let response;
            if (animalId) {
                response = await updatePet(volunteerId, animalId, request);
                if (removedFiles.length > 0) {
                    await deletePetPhotos(volunteerId, animalId, removedFiles);
                }
            } else {
                response = await addPetToVolunteer(volunteerId, request);
            }

            if (response.data.result?.isSuccess) {
                if (files.length > 0 && !animalId) {
                    const uploadFilesDtos: UploadFileDto[] = files.map((file: FilePreview) => {
                        const lastDotIndex = file.name.lastIndexOf(".");
                        const extension =
                            lastDotIndex === -1 ? "" : file.name.substring(lastDotIndex + 1).toLowerCase();

                        return {
                            bucketName: "photos",
                            fileName: file.name,
                            contentType: getContentTypeFromExtension(extension),
                        };
                    });

                    const urlsResponse = await addPetPhotos(volunteerId, response.data.result.value!, uploadFilesDtos);
                    if (urlsResponse.data.result?.value) {
                        const urlToUpload = urlsResponse.data.result.value.fileUrls;

                        const uploadPromises = urlToUpload.map((url, index) =>
                            uploadFileToS3(url, files[index]).catch((error: unknown) => {
                                console.error(`Ошибка загрузки файла ${files[index].name}:`, error);
                                return null;
                            }),
                        );

                        const results = await Promise.all(uploadPromises);

                        const successfulUploads = results.filter((result) => result !== null);
                        console.log(`Успешно загружено ${successfulUploads.length} из ${files.length} файлов.`);
                    }
                }

                router.push("/volunteers");
            } else {
                console.error("Ошибка при добавлении животного:", response.data.errors);
            }
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchAnimalData = async () => {
            if (animalId) {
                try {
                    setIsLoading(true);
                    const response = await getPetById(animalId);
                    if (response.data.result?.isSuccess && response.data.result.value) {
                        const petData = response.data.result.value;

                        // Преобразуем PetDto в Animal
                        const animalData = petDtoToAnimal(petData);
                        setAnimal(animalData);

                        // Устанавливаем медицинскую информацию
                        setMedicalInfo({
                            isVaccinated: petData.isVaccinated ?? false,
                            vaccinationDate: petData.lastVaccinationDate ?? "",
                            isSterilized: petData.isSpayedNeutered ?? false,
                            hasChronicDiseases: petData.hasChronicDiseases ?? false,
                            medicalDescription: petData.medicalNotes ?? "",
                            needsSpecialDiet: petData.requiresSpecialDiet ?? false,
                            hasAllergies: petData.hasAllergies ?? false,
                        });

                        // Устанавливаем темперамент
                        setTemperament({
                            aggressionLevel: petData.aggressionLevel ?? 1,
                            friendlinessLevel: petData.friendliness ?? 5,
                            activityLevel: petData.activityLevel ?? 5,
                            goodWithChildren: petData.goodWithKids ?? false,
                            goodWithPeople: petData.goodWithPeople ?? true,
                            goodWithAnimals: petData.goodWithOtherAnimals ?? false,
                        });

                        if (petData.speciesName) {
                            const foundSpecies = species.find((s) => s.speciesName === petData.speciesName);
                            if (foundSpecies) {
                                setSelectedSpeciesId(foundSpecies.speciesId);
                                setBreeds(foundSpecies.breeds ?? []);

                                if (petData.breedName) {
                                    const foundBreed = foundSpecies.breeds?.find(
                                        (b) => b.breedName === petData.breedName,
                                    );
                                    if (foundBreed) {
                                        setSelectedBreedId(foundBreed.breedId);
                                    }
                                }
                            }
                        }

                        // Загрузка фото
                        if (petData.petPhotos.length > 0) {
                            const presignedUrlsResponse = await getManyDownloadPresignedUrls({
                                bucketName: "photos",
                                fileKeys: petData.petPhotos.map((photo) => ({
                                    fileId: photo.path.split("/").pop()?.split(".")[0] ?? "",
                                    extension: photo.path.split(".").pop() ?? "jpg",
                                })),
                            });

                            // 2. Загружаем каждый файл и получаем его размер
                            const files = await Promise.all(
                                petData.petPhotos.map(async (photo, index) => {
                                    try {
                                        const response = await fetch(presignedUrlsResponse.data[index]);
                                        const blob = await response.blob();

                                        return {
                                            name: photo.path.split("/").pop() ?? `photo-${Date.now()}.jpg`,
                                            preview: photo.path,
                                            file: new File([blob], `photo-${Date.now()}.jpg`, {
                                                type: blob.type,
                                            }),
                                            size: blob.size, // ← Добавляем размер файла
                                        };
                                    } catch (error) {
                                        console.error("Error loading photo:", error);
                                        return null;
                                    }
                                }),
                            );

                            setFiles(files.filter(Boolean) as unknown as FilePreview[]);
                        }
                    }
                } catch (error) {
                    console.error("Ошибка при загрузке данных животного:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        void fetchAnimalData();
    }, [animalId, species]);

    const handleSpeciesChange = (speciesId: string) => {
        setSelectedSpeciesId(speciesId);
        const selectedSpecies = species.find((s) => s.speciesId === speciesId);
        setBreeds(selectedSpecies?.breeds ?? []);
        setSelectedBreedId("");
        // Обновляем animal.type
        setAnimal({
            ...animal,
            type: selectedSpecies?.speciesName ?? "",
            breed: "",
        });
    };

    const handleBreedChange = (breedId: string) => {
        setSelectedBreedId(breedId);
        const selectedBreed = breeds.find((b) => b.breedId === breedId);
        // Обновляем animal.breed
        setAnimal({
            ...animal,
            breed: selectedBreed?.breedName ?? "",
        });
    };

    const handleUpload = async (filesToUpload: File[]) => {
        setIsUploading(true);

        try {
            const formData = new FormData();

            filesToUpload.forEach((file) => {
                formData.append("Files", file);
            });

            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log(files);

            //setFiles([]);
            addToast({
                title: "Успех",
                description: "Фото успешно загружены",
                color: "success",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Main Content */}
            <div className="mx-5 py-4 pb-20">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">
                        {isEditMode ? `Редактирование: ${animal.name}` : "Добавление нового животного"}
                    </h1>
                    <p className="text-gray-400">
                        {isEditMode
                            ? "Измените информацию о животном и нажмите 'Сохранить'"
                            : "Заполните информацию о новом животном и нажмите 'Сохранить'"}
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        void handleSubmit(e);
                    }}
                >
                    <Tabs fullWidth className="w-full">
                        {/* Основная информация */}
                        <Tab key="general" title="Основная информация">
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                {/* Фото животного */}
                                <Card className="border-gray-700 bg-gray-900/50">
                                    <CardHeader className="flex flex-col">
                                        <h3 className="text-2xl font-bold text-white">Фото животного</h3>
                                        <p className="text-xs text-gray-400">Загрузите фотографию животного</p>
                                    </CardHeader>
                                    <CardBody className="flex flex-col items-center">
                                        {/*<div className="relative mb-4 h-48 w-48">
                                            <img
                                                src={
                                                    animal.image ||
                                                    "https://i.pinimg.com/originals/0a/a9/fd/0aa9fd22cf073e4f3918b5def662b1e1.jpg"
                                                }
                                                alt="Фото животного"
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                        <Button type="button" variant="faded" className="w-full">
                                            <Upload className="mr-2 h-4 w-4"/>
                                            Загрузить фото
                                        </Button>*/}
                                        <UploadForm
                                            files={files}
                                            setFiles={setFiles}
                                            onUpload={handleUpload}
                                            isUploading={isUploading}
                                            onRemoveFile={handleRemoveFile}
                                        />
                                    </CardBody>
                                </Card>

                                {/* Основная информация */}
                                <Card className="border-gray-700 bg-gray-900/50 lg:col-span-2">
                                    <CardHeader className="flex flex-col">
                                        <h3 className="text-2xl font-bold text-white">Основная информация</h3>
                                        <p className="text-xs text-gray-400">Обязательные поля отмечены *</p>
                                    </CardHeader>
                                    <CardBody className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <Input
                                                id="name"
                                                value={animal.name}
                                                label="Имя"
                                                onChange={(e) => {
                                                    setAnimal({ ...animal, name: e.target.value });
                                                }}
                                                isRequired={true}
                                            />

                                            {/* Вид животного */}
                                            <div className="flex flex-row items-center space-x-2">
                                                <p className="h-15 pt-4 text-base text-white">Вид животного *:</p>
                                                <Dropdown>
                                                    <DropdownTrigger className="border-gray-700 bg-gray-800">
                                                        <Button variant="bordered" isLoading={isLoadingSpecies}>
                                                            {animal.type || "Выберите вид"}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu
                                                        onAction={(key) => {
                                                            handleSpeciesChange(String(key));
                                                        }}
                                                        disabledKeys={
                                                            isLoadingSpecies ? species.map((s) => s.speciesId) : []
                                                        }
                                                    >
                                                        {species.map((specie) => (
                                                            <DropdownItem key={specie.speciesId}>
                                                                {specie.speciesName}
                                                            </DropdownItem>
                                                        ))}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>

                                            {/* Порода */}
                                            <div className="flex flex-row items-center space-x-2">
                                                <p className="h-15 pt-4 text-base text-white">Порода *:</p>
                                                <Dropdown>
                                                    <DropdownTrigger className="border-gray-700 bg-gray-800">
                                                        <Button
                                                            variant="bordered"
                                                            isDisabled={!selectedSpeciesId || isLoadingSpecies}
                                                        >
                                                            {animal.breed ||
                                                                (selectedSpeciesId
                                                                    ? "Выберите породу"
                                                                    : "Сначала выберите вид")}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu
                                                        onAction={(key) => {
                                                            handleBreedChange(String(key));
                                                        }}
                                                        disabledKeys={
                                                            !selectedSpeciesId ? breeds.map((b) => b.breedId) : []
                                                        }
                                                    >
                                                        {breeds.map((breed) => (
                                                            <DropdownItem key={breed.breedId}>
                                                                {breed.breedName}
                                                            </DropdownItem>
                                                        ))}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>

                                            {/* Пол */}
                                            <div className="space-y-2">
                                                <p className="text-base text-white">Пол *</p>
                                                <RadioGroup
                                                    value={animal.gender}
                                                    onValueChange={(value) => {
                                                        setAnimal({
                                                            ...animal,
                                                            gender: value as "male" | "female" | "unknown",
                                                        });
                                                    }}
                                                    className="flex space-x-6"
                                                    orientation="horizontal"
                                                >
                                                    <Radio value="male">Самец</Radio>
                                                    <Radio value="female">Самка</Radio>
                                                    <Radio value="unknown">Неизвестно</Radio>
                                                </RadioGroup>
                                            </div>

                                            <DatePicker
                                                id="birthDate"
                                                label="Дата рождения"
                                                value={
                                                    animal.birthDate ? parseDate(animal.birthDate.split("T")[0]) : null
                                                }
                                                onChange={(e) => {
                                                    setAnimal({
                                                        ...animal,
                                                        birthDate: e ? `${e.toString()}T00:00:00` : "",
                                                    });
                                                }}
                                                isRequired={true}
                                            />

                                            <DatePicker
                                                id="arrivalDate"
                                                label="Дата поступления в приют"
                                                value={
                                                    animal.arrivalDate
                                                        ? parseDate(animal.arrivalDate.split("T")[0])
                                                        : null
                                                }
                                                onChange={(e) => {
                                                    setAnimal({
                                                        ...animal,
                                                        arrivalDate: e ? `${e.toString()}T00:00:00` : "",
                                                    });
                                                }}
                                                isRequired={true}
                                            />

                                            <Input
                                                label="Цвет"
                                                value={animal.color}
                                                onChange={(e) => {
                                                    setAnimal({ ...animal, color: e.target.value });
                                                }}
                                                isRequired={true}
                                            />

                                            <Input
                                                id="height"
                                                label="Рост"
                                                value={animal.height}
                                                onChange={(e) => {
                                                    setAnimal({ ...animal, height: e.target.value });
                                                }}
                                                isRequired={true}
                                                placeholder="Например: 30 см"
                                            />

                                            <Input
                                                id="weight"
                                                label="Вес"
                                                value={animal.weight}
                                                onChange={(e) => {
                                                    setAnimal({ ...animal, weight: e.target.value });
                                                }}
                                                isRequired={true}
                                                placeholder="Например: 4.5 кг"
                                            />

                                            <Input
                                                id="phoneNumber"
                                                label="Номер телефона"
                                                value={animal.phoneNumber}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9+]/g, "");
                                                    setAnimal({ ...animal, phoneNumber: value });
                                                }}
                                                isRequired={true}
                                                placeholder="+79991234567"
                                            />

                                            {/* Откуда поступил */}
                                            <div className="flex flex-row items-center space-x-2">
                                                <p className="h-15 pt-4 text-base text-white">Откуда поступил *:</p>
                                                <Dropdown>
                                                    <DropdownTrigger className="border-gray-700 bg-gray-800">
                                                        <Button variant="bordered">
                                                            {getSourceLabel(animal.source)}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu
                                                        onAction={(value) => {
                                                            setAnimal({
                                                                ...animal,
                                                                source: String(value) as "stray" | "shelter" | "person",
                                                            });
                                                        }}
                                                    >
                                                        <DropdownItem key="stray">Бездомный</DropdownItem>
                                                        <DropdownItem key="shelter">Из другого приюта</DropdownItem>
                                                        <DropdownItem key="person">От человека</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>

                                            <Input
                                                id="lastOwner"
                                                label="Последний хозяин"
                                                value={animal.lastOwner}
                                                onChange={(e) => {
                                                    setAnimal({ ...animal, lastOwner: e.target.value });
                                                }}
                                                placeholder="ФИО или название"
                                            />

                                            {/* Адрес приюта */}
                                            <Input
                                                id="shelterAddress"
                                                label="Страна"
                                                value={animal.state}
                                                onChange={(e) => {
                                                    setAnimal({
                                                        ...animal,
                                                        state: e.target.value,
                                                    });
                                                }}
                                                isRequired={true}
                                                placeholder="Страна"
                                            />

                                            <Input
                                                label="Город"
                                                value={animal.city ?? ""}
                                                onChange={(e) => {
                                                    setAnimal({ ...animal, city: e.target.value });
                                                }}
                                                isRequired={true}
                                                placeholder="Город"
                                            />

                                            <Input
                                                label="Улица"
                                                value={animal.street ?? ""}
                                                onChange={(e) => {
                                                    setAnimal({ ...animal, street: e.target.value });
                                                }}
                                                isRequired={true}
                                                placeholder="Улица"
                                            />

                                            <Input
                                                label="Индекс"
                                                value={animal.zipCode ?? ""}
                                                onChange={(e) => {
                                                    setAnimal({ ...animal, zipCode: e.target.value });
                                                }}
                                                isRequired={true}
                                                placeholder="Индекс"
                                            />

                                            {/* Статус помощи */}
                                            <div className="flex flex-row items-center space-x-2">
                                                <p className="h-15 pt-4 text-base text-white">Статус помощи *:</p>
                                                <Dropdown>
                                                    <DropdownTrigger className="border-gray-700 bg-gray-800">
                                                        <Button variant="bordered">
                                                            {getStatusLabel(animal.status)}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu
                                                        onAction={(key) => {
                                                            setAnimal({
                                                                ...animal,
                                                                status: String(key) as
                                                                    | "needs_help"
                                                                    | "looking_for_home"
                                                                    | "adopted",
                                                            });
                                                        }}
                                                    >
                                                        <DropdownItem key="needs_help">Нуждается в помощи</DropdownItem>
                                                        <DropdownItem key="looking_for_home">Ищет дом</DropdownItem>
                                                        <DropdownItem key="adopted">Пристроен</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </div>

                                        <Textarea
                                            id="description"
                                            label="Описание"
                                            value={animal.description}
                                            onChange={(e) => {
                                                setAnimal({ ...animal, description: e.target.value });
                                            }}
                                            isRequired={true}
                                            className="min-h-[120px]"
                                            placeholder="Опишите животное, его характер и особенности"
                                        />

                                        <Textarea
                                            id="healthStatus"
                                            label="Состояние здоровья"
                                            value={animal.healthStatus}
                                            onChange={(e) => {
                                                setAnimal({ ...animal, healthStatus: e.target.value });
                                            }}
                                            isRequired={true}
                                            placeholder="Опишите общее состояние здоровья животного"
                                        />
                                    </CardBody>
                                </Card>
                            </div>
                        </Tab>

                        {/* Медицинская информация */}
                        <Tab key="medical" title="Медицинская информация">
                            <Card className="border-gray-700 bg-gray-900/50">
                                <CardHeader className="flex flex-col">
                                    <h3 className="text-2xl font-bold text-white">Медицинская информация</h3>
                                    <p className="text-xs text-gray-400">
                                        Необязательные поля с медицинской информацией о животном
                                    </p>
                                </CardHeader>
                                <CardBody className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Привит или нет */}
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="isVaccinated"
                                                    checked={medicalInfo.isVaccinated}
                                                    onValueChange={(checked) => {
                                                        setMedicalInfo({
                                                            ...medicalInfo,
                                                            isVaccinated: checked,
                                                        });
                                                    }}
                                                >
                                                    Привит
                                                </Checkbox>
                                            </div>

                                            {medicalInfo.isVaccinated && (
                                                <div className="space-y-2">
                                                    <DatePicker
                                                        id="vaccinationDate"
                                                        label="Дата прививки"
                                                        value={
                                                            medicalInfo.vaccinationDate
                                                                ? parseDate(medicalInfo.vaccinationDate.split("T")[0])
                                                                : null
                                                        }
                                                        onChange={(e) => {
                                                            setMedicalInfo({
                                                                ...medicalInfo,
                                                                vaccinationDate: e ? `${e.toString()}T00:00:00` : "",
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Стерилизован или нет */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="isSterilized"
                                                    isSelected={medicalInfo.isSterilized}
                                                    onValueChange={(checked) => {
                                                        setMedicalInfo({
                                                            ...medicalInfo,
                                                            isSterilized: checked,
                                                        });
                                                    }}
                                                >
                                                    Стерилизован/кастрирован
                                                </Checkbox>
                                            </div>
                                        </div>

                                        {/* Хронические заболевания */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="hasChronicDiseases"
                                                    isSelected={medicalInfo.hasChronicDiseases}
                                                    onValueChange={(checked) => {
                                                        setMedicalInfo({
                                                            ...medicalInfo,
                                                            hasChronicDiseases: checked,
                                                        });
                                                    }}
                                                >
                                                    Имеет хронические заболевания
                                                </Checkbox>
                                            </div>
                                        </div>

                                        {/* Специальное питание */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="needsSpecialDiet"
                                                    isSelected={medicalInfo.needsSpecialDiet}
                                                    onValueChange={(checked) => {
                                                        setMedicalInfo({
                                                            ...medicalInfo,
                                                            needsSpecialDiet: checked,
                                                        });
                                                    }}
                                                >
                                                    Нуждается в специальном питании
                                                </Checkbox>
                                            </div>
                                        </div>

                                        {/* Аллергии */}
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="hasAllergies"
                                                    isSelected={medicalInfo.hasAllergies}
                                                    onValueChange={(checked) => {
                                                        setMedicalInfo({
                                                            ...medicalInfo,
                                                            hasAllergies: checked,
                                                        });
                                                    }}
                                                >
                                                    Имеет аллергии
                                                </Checkbox>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Медицинское описание */}
                                    <div className="space-y-2">
                                        <Textarea
                                            id="medicalDescription"
                                            label="Медицинское описание состояния здоровья"
                                            value={medicalInfo.medicalDescription}
                                            onChange={(e) => {
                                                setMedicalInfo({
                                                    ...medicalInfo,
                                                    medicalDescription: e.target.value,
                                                });
                                            }}
                                            className="min-h-[120px]"
                                            placeholder="Подробное описание состояния здоровья, перенесенных болезней, операций и т.д."
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Tab>

                        {/* Темперамент */}
                        <Tab key="temperament" title="Темперамент">
                            <Card className="border-gray-700 bg-gray-900/50">
                                <CardHeader className="flex flex-col">
                                    <h3 className="text-2xl font-bold text-white">Темперамент</h3>
                                    <p className="text-xs text-gray-400">
                                        Необязательные поля с информацией о характере животного
                                    </p>
                                </CardHeader>
                                <CardBody className="space-y-8">
                                    {/* Шкалы */}
                                    <div className="space-y-6">
                                        {/* Уровень агрессии */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <p className="text-xl text-white">Уровень агрессии</p>
                                                <span className="text-sm text-gray-400">
                                                    {temperament.aggressionLevel}/10
                                                </span>
                                            </div>
                                            <Slider
                                                minValue={1}
                                                maxValue={10}
                                                step={1}
                                                value={[temperament.aggressionLevel]} // Всегда массив
                                                onChange={(value) => {
                                                    const numValue = Array.isArray(value) ? value[0] : value;
                                                    setTemperament({
                                                        ...temperament,
                                                        aggressionLevel: Number(numValue), // Явное преобразование в число
                                                    });
                                                }}
                                                className="w-full"
                                                showSteps={true}
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Спокойный</span>
                                                <span>Агрессивный</span>
                                            </div>
                                        </div>

                                        {/* Уровень дружелюбия */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <p className="text-xl text-white">Уровень дружелюбия</p>
                                                <span className="text-sm text-gray-400">
                                                    {temperament.friendlinessLevel}/10
                                                </span>
                                            </div>
                                            <Slider
                                                minValue={1}
                                                maxValue={10}
                                                step={1}
                                                value={[temperament.friendlinessLevel]}
                                                onChange={(value) => {
                                                    const numValue = Array.isArray(value) ? value[0] : value;
                                                    setTemperament({
                                                        ...temperament,
                                                        friendlinessLevel: Number(numValue),
                                                    });
                                                }}
                                                className="w-full"
                                                showSteps={true}
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Замкнутый</span>
                                                <span>Дружелюбный</span>
                                            </div>
                                        </div>

                                        {/* Уровень активности */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <p className="text-xl text-white">Уровень активности</p>
                                                <span className="text-sm text-gray-400">
                                                    {temperament.activityLevel}/10
                                                </span>
                                            </div>
                                            <Slider
                                                minValue={1}
                                                maxValue={10}
                                                step={1}
                                                value={[temperament.activityLevel]}
                                                onChange={(value) => {
                                                    const numValue = Array.isArray(value) ? value[0] : value;
                                                    setTemperament({
                                                        ...temperament,
                                                        activityLevel: Number(numValue),
                                                    });
                                                }}
                                                className="w-full"
                                                showSteps={true}
                                            />
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Спокойный</span>
                                                <span>Активный</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Чекбоксы */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        {/* Отношение к детям */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="goodWithChildren"
                                                    isSelected={temperament.goodWithChildren}
                                                    onValueChange={(checked) => {
                                                        setTemperament({
                                                            ...temperament,
                                                            goodWithChildren: checked,
                                                        });
                                                    }}
                                                >
                                                    Хорошо относится к детям
                                                </Checkbox>
                                            </div>
                                        </div>

                                        {/* Отношение к людям */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="goodWithPeople"
                                                    isSelected={temperament.goodWithPeople}
                                                    onValueChange={(checked) => {
                                                        setTemperament({
                                                            ...temperament,
                                                            goodWithPeople: checked,
                                                        });
                                                    }}
                                                >
                                                    Хорошо относится к людям
                                                </Checkbox>
                                            </div>
                                        </div>

                                        {/* Отношение к другим животным */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="goodWithAnimals"
                                                    isSelected={temperament.goodWithAnimals}
                                                    onValueChange={(checked) => {
                                                        setTemperament({
                                                            ...temperament,
                                                            goodWithAnimals: checked,
                                                        });
                                                    }}
                                                >
                                                    Хорошо относится к другим животным
                                                </Checkbox>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>

                    {/* Кнопки действий */}
                    <div className="fixed right-0 bottom-0 left-0 z-10 border-t border-gray-800 bg-gray-900/80 px-6 py-4 backdrop-blur-sm">
                        <div className="mx-auto flex max-w-6xl justify-between">
                            <Button
                                type="button"
                                variant="light"
                                onPress={() => {
                                    router.push("/volunteers");
                                }}
                                className="border-gray-600"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Отмена
                            </Button>
                            <div className="flex gap-4">
                                <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Сохранение...
                                        </span>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Сохранить
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
