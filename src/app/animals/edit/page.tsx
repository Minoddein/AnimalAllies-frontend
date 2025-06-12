"use client";

import { Save, Upload, X } from "lucide-react";

import type React from "react";
import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Animal } from "@/types/Animal";
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
} from "@heroui/react";
import { parseDate } from "@internationalized/date";

// Пример данных для нового животного
const emptyAnimal: Animal = {
    id: "",
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "unknown",
    status: "needs_help",
    location: "",
    image: "https://i1.sndcdn.com/artworks-HrbpVDMzAPVyRM3Y-WjskEg-t1080x1080.jpg",
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
    shelterAddress: "",
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
    allergiesDescription: string;
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
    allergiesDescription: "",
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

// Примеры животных для демонстрации
const sampleAnimals: Record<string, { animal: Animal; medical: MedicalInfo; temperament: Temperament }> = {
    "animal-1": {
        animal: {
            id: "animal-1",
            name: "Пушинка",
            type: "Кролик",
            breed: "Декоративный",
            age: "1 год",
            gender: "female",
            status: "looking_for_home",
            location: "Москва",
            image: "/placeholder.svg?height=200&width=200",
            dateAdded: "15.03.2025",
            description: "Милый и пушистый кролик, который принесет радость в ваш дом.",
            birthDate: "2024-03-15",
            arrivalDate: "2025-03-01",
            source: "person",
            color: "Белый",
            height: "20 см",
            weight: "1.5 кг",
            healthStatus: "Здоров",
            shelterAddress: "ул. Примерная, 123, Москва",
        },
        medical: {
            isVaccinated: true,
            vaccinationDate: "2025-03-05",
            isSterilized: false,
            hasChronicDiseases: false,
            medicalDescription: "Полностью здоров, прошел ветеринарный осмотр.",
            needsSpecialDiet: false,
            hasAllergies: false,
            allergiesDescription: "",
        },
        temperament: {
            aggressionLevel: 1,
            friendlinessLevel: 9,
            activityLevel: 7,
            goodWithChildren: true,
            goodWithPeople: true,
            goodWithAnimals: true,
        },
    },
    "animal-2": {
        animal: {
            id: "animal-2",
            name: "Барсик",
            type: "Кот",
            breed: "Сибирский",
            age: "3 года",
            gender: "male",
            status: "needs_help",
            location: "Москва",
            image: "https://i.pinimg.com/originals/0a/a9/fd/0aa9fd22cf073e4f3918b5def662b1e1.jpg",
            dateAdded: "02.04.2025",
            description: "Ласковый кот, любит играть и мурлыкать.",
            birthDate: "2022-04-10",
            arrivalDate: "2025-04-01",
            source: "stray",
            color: "Серый",
            height: "30 см",
            weight: "4.2 кг",
            healthStatus: "Требуется лечение",
            shelterAddress: "ул. Примерная, 123, Москва",
        },
        medical: {
            isVaccinated: false,
            vaccinationDate: "",
            isSterilized: true,
            hasChronicDiseases: true,
            medicalDescription: "Хроническое заболевание почек, требуется специальная диета.",
            needsSpecialDiet: true,
            hasAllergies: false,
            allergiesDescription: "",
        },
        temperament: {
            aggressionLevel: 3,
            friendlinessLevel: 7,
            activityLevel: 5,
            goodWithChildren: false,
            goodWithPeople: true,
            goodWithAnimals: false,
        },
    },
};

export default function EditAnimalPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const animalId = searchParams.get("id");
    const isEditMode = !!animalId;

    const [animal, setAnimal] = useState<Animal>(emptyAnimal);
    const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>(emptyMedicalInfo);
    const [temperament, setTemperament] = useState<Temperament>(emptyTemperament);
    const [isLoading, setIsLoading] = useState(false);

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
        if (animalId) {
            // Загрузка данных животного для редактирования
            setAnimal(sampleAnimals[animalId].animal);
            setMedicalInfo(sampleAnimals[animalId].medical);
            setTemperament(sampleAnimals[animalId].temperament);
        } else {
            // Сброс формы для нового животного
            setAnimal(emptyAnimal);
            setMedicalInfo(emptyMedicalInfo);
            setTemperament(emptyTemperament);
        }
    }, [animalId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log("Сохраняем данные:", { animal, medicalInfo, temperament });

            await new Promise((resolve) => setTimeout(resolve, 1000));

            router.push("/volunteers");
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
        } finally {
            setIsLoading(false);
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
                                        <div className="relative mb-4 h-48 w-48">
                                            <img
                                                src={
                                                    animal.image ||
                                                    "https://i.pinimg.com/originals/0a/a9/fd/0aa9fd22cf073e4f3918b5def662b1e1.jpg"
                                                }
                                                alt="Фото животного"
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                        <Button type="button" variant="outline" className="w-full">
                                            <Upload className="mr-2 h-4 w-4" />
                                            Загрузить фото
                                        </Button>
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
                                                onChange={(e) => { setAnimal({ ...animal, name: e.target.value }); }}
                                                isRequired={true}
                                            />

                                            {/* Вид животного */}
                                            <div className="flex flex-row items-center space-x-2">
                                                <p className="h-15 pt-4 text-base text-white">Вид животного *:</p>
                                                <Dropdown>
                                                    <DropdownTrigger className="border-gray-700 bg-gray-800">
                                                        <Button variant="bordered">
                                                            {animal.type ? animal.type : "Выберите вид"}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu
                                                        onAction={(key) => { setAnimal({ ...animal, type: key }); }}
                                                    >
                                                        <DropdownItem key="Кошка">Кошка</DropdownItem>
                                                        <DropdownItem key="Собака">Собака</DropdownItem>
                                                        <DropdownItem key="Кролик">Кролик</DropdownItem>
                                                        <DropdownItem key="Хомяк">Хомяк</DropdownItem>
                                                        <DropdownItem key="Морская свинка">Морская свинка</DropdownItem>
                                                        <DropdownItem key="Птица">Птица</DropdownItem>
                                                        <DropdownItem key="Другое">Другое</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>

                                            <Input
                                                id="breed"
                                                label="Порода"
                                                value={animal.breed}
                                                onChange={(e) => { setAnimal({ ...animal, breed: e.target.value }); }}
                                            />

                                            {/* Пол */}
                                            <div className="space-y-2">
                                                <p className="text-base text-white">Пол *</p>
                                                <RadioGroup
                                                    value={animal.gender}
                                                    onValueChange={(value: "male" | "female" | "unknown") =>
                                                        { setAnimal({ ...animal, gender: value }); }
                                                    }
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
                                                value={animal.birthDate ? parseDate(animal.birthDate) : null}
                                                onChange={(e) =>
                                                    { setAnimal({
                                                        ...animal,
                                                        birthDate: e?.toString() ?? "",
                                                    }); }
                                                }
                                                isRequired={true}
                                            />

                                            <DatePicker
                                                id="arrivalDate"
                                                label="Дата поступления в приют"
                                                value={animal.arrivalDate ? parseDate(animal.arrivalDate) : null}
                                                onChange={(e) =>
                                                    { setAnimal({
                                                        ...animal,
                                                        arrivalDate: e?.toString() ?? "",
                                                    }); }
                                                }
                                                isRequired={true}
                                            />

                                            <Input
                                                label="Цвет"
                                                value={animal.color}
                                                onChange={(e) => { setAnimal({ ...animal, color: e.target.value }); }}
                                                isRequired={true}
                                            />

                                            <Input
                                                id="height"
                                                label="Рост"
                                                value={animal.height}
                                                onChange={(e) => { setAnimal({ ...animal, height: e.target.value }); }}
                                                isRequired={true}
                                                placeholder="Например: 30 см"
                                            />

                                            <Input
                                                id="weight"
                                                label="Вес"
                                                value={animal.weight}
                                                onChange={(e) => { setAnimal({ ...animal, weight: e.target.value }); }}
                                                isRequired={true}
                                                placeholder="Например: 4.5 кг"
                                            />

                                            {/* Откуда поступил */}
                                            <div className="flex flex-row items-center space-x-2">
                                                <p className="h-15 pt-4 text-base text-white">Откуда поступил *:</p>
                                                <Dropdown>
                                                    <DropdownTrigger className="border-gray-700 bg-gray-800">
                                                        <Button variant="bordered">
                                                            {animal.source
                                                                ? getSourceLabel(animal.source)
                                                                : "Выберите источник"}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu
                                                        onAction={(value: "stray" | "shelter" | "person") =>
                                                            { setAnimal({ ...animal, source: value }); }
                                                        }
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
                                                value={animal.lastOwner ?? ""}
                                                onChange={(e) => { setAnimal({ ...animal, lastOwner: e.target.value }); }}
                                                placeholder="ФИО или название"
                                            />

                                            {/* Адрес приюта */}
                                            <Input
                                                id="shelterAddress"
                                                label="Адрес приюта"
                                                value={animal.shelterAddress ?? ""}
                                                onChange={(e) =>
                                                    { setAnimal({
                                                        ...animal,
                                                        shelterAddress: e.target.value,
                                                    }); }
                                                }
                                                isRequired={true}
                                                placeholder="Улица, город"
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
                                                        onAction={(
                                                            key: "needs_help" | "looking_for_home" | "adopted",
                                                        ) => { setAnimal({ ...animal, status: key }); }}
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
                                            value={animal.description ?? ""}
                                            onChange={(e) => { setAnimal({ ...animal, description: e.target.value }); }}
                                            isRequired={true}
                                            className="min-h-[120px]"
                                            placeholder="Опишите животное, его характер и особенности"
                                        />

                                        <Textarea
                                            id="healthStatus"
                                            label="Состояние здоровья"
                                            value={animal.healthStatus ?? ""}
                                            onChange={(e) => { setAnimal({ ...animal, healthStatus: e.target.value }); }}
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
                                                    onValueChange={(checked) =>
                                                        { setMedicalInfo({
                                                            ...medicalInfo,
                                                            isVaccinated: checked,
                                                        }); }
                                                    }
                                                >
                                                    Привит
                                                </Checkbox>
                                            </div>

                                            {medicalInfo.isVaccinated && (
                                                <div className="space-y-2">
                                                    <DatePicker
                                                        id="vaccinationDate"
                                                        label="Дата прививки"
                                                        showMonthAndYearPickers
                                                        value={
                                                            medicalInfo.vaccinationDate
                                                                ? parseDate(medicalInfo.vaccinationDate)
                                                                : null
                                                        }
                                                        onChange={(e) =>
                                                            { setMedicalInfo({
                                                                ...medicalInfo,
                                                                vaccinationDate: e?.toString() ?? "",
                                                            }); }
                                                        }
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
                                                    onValueChange={(checked) =>
                                                        { setMedicalInfo({
                                                            ...medicalInfo,
                                                            isSterilized: checked,
                                                        }); }
                                                    }
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
                                                    onValueChange={(checked) =>
                                                        { setMedicalInfo({
                                                            ...medicalInfo,
                                                            hasChronicDiseases: checked,
                                                        }); }
                                                    }
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
                                                    onValueChange={(checked) =>
                                                        { setMedicalInfo({
                                                            ...medicalInfo,
                                                            needsSpecialDiet: checked,
                                                        }); }
                                                    }
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
                                                    onValueChange={(checked) =>
                                                        { setMedicalInfo({
                                                            ...medicalInfo,
                                                            hasAllergies: checked,
                                                        }); }
                                                    }
                                                >
                                                    Имеет аллергии
                                                </Checkbox>
                                            </div>

                                            {medicalInfo.hasAllergies && (
                                                <div className="space-y-2">
                                                    <Textarea
                                                        id="allergiesDescription"
                                                        label="Описание аллергий"
                                                        value={medicalInfo.allergiesDescription}
                                                        onChange={(e) =>
                                                            { setMedicalInfo({
                                                                ...medicalInfo,
                                                                allergiesDescription: e.target.value,
                                                            }); }
                                                        }
                                                        placeholder="Опишите аллергии животного"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Медицинское описание */}
                                    <div className="space-y-2">
                                        <Textarea
                                            id="medicalDescription"
                                            label="Медицинское описание состояния здоровья"
                                            value={medicalInfo.medicalDescription}
                                            onChange={(e) =>
                                                { setMedicalInfo({
                                                    ...medicalInfo,
                                                    medicalDescription: e.target.value,
                                                }); }
                                            }
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
                                                value={[temperament.aggressionLevel]}
                                                onChange={(value: number) =>
                                                    { setTemperament({
                                                        ...temperament,
                                                        aggressionLevel: value,
                                                    }); }
                                                }
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
                                                onChange={(value: number) =>
                                                    { setTemperament({
                                                        ...temperament,
                                                        friendlinessLevel: value,
                                                    }); }
                                                }
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
                                                id="activityLevel"
                                                minValue={1}
                                                maxValue={10}
                                                step={1}
                                                value={[temperament.activityLevel]}
                                                onChange={(value: number) =>
                                                    { setTemperament({
                                                        ...temperament,
                                                        activityLevel: value,
                                                    }); }
                                                }
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
                                                    onValueChange={(checked) =>
                                                        { setTemperament({
                                                            ...temperament,
                                                            goodWithChildren: checked,
                                                        }); }
                                                    }
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
                                                    onValueChange={(checked) =>
                                                        { setTemperament({
                                                            ...temperament,
                                                            goodWithPeople: checked,
                                                        }); }
                                                    }
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
                                                    onValueChange={(checked) =>
                                                        { setTemperament({
                                                            ...temperament,
                                                            goodWithAnimals: checked,
                                                        }); }
                                                    }
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
                                variant="outline"
                                onPress={() => { router.push("/volunteers"); }}
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
