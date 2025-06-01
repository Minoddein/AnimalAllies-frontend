"use client";

import { PawPrint } from "lucide-react";

import { useEffect, useState } from "react";

import { createBreed, createSpecies, deleteBreed, deleteSpecies, getSpecies } from "@/api/species";
import { Species } from "@/models/species";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Select,
    SelectItem,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export default function SpeciesManagement() {
    const [species, setSpecies] = useState<Species[]>([]);
    const [pagedData, setPagedData] = useState<{ items: Species[]; totalCount: number }>({
        items: [],
        totalCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newSpeciesName, setNewSpeciesName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [newBreedName, setNewBreedName] = useState("");
    const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("");
    const { isOpen: isCreateSpeciesOpen, onOpen: onCreateSpeciesOpen, onClose: onCreateSpeciesClose } = useDisclosure();
    const { isOpen: isCreateBreedOpen, onOpen: onCreateBreedOpen, onClose: onCreateBreedClose } = useDisclosure();

    const loadSpecies = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSpecies(currentPage, itemsPerPage);
            if (!response.data.result?.value?.items) {
                throw new Error("Некорректный формат данных от сервера");
            }

            const speciesWithBreeds = response.data.result.value.items.map((s) => ({
                ...s,
                breeds: (s.breeds ?? [])
                    .filter((breed) => typeof breed === "object")
                    .map((breed) => ({
                        breedId: breed.breedId || `temp-${Math.random().toString(36).substring(2, 9)}`,
                        breedName: breed.breedName || "Без названия",
                    })),
            }));

            setSpecies(speciesWithBreeds);
            setPagedData({
                items: speciesWithBreeds,
                totalCount: response.data.result.value.totalCount,
            });
        } catch (err) {
            console.error("Ошибка загрузки видов:", err);
            setError("Не удалось загрузить список видов");
            setSpecies([]);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(pagedData.totalCount / itemsPerPage);

    useEffect(() => {
        void loadSpecies();
    }, [currentPage]);

    const handleCreateSpecies = async () => {
        if (!newSpeciesName.trim()) return;

        try {
            await createSpecies(newSpeciesName);
            setNewSpeciesName("");
            onCreateSpeciesClose();
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await loadSpecies();
        } catch (err) {
            console.error("Ошибка создания вида:", err);
            setError("Не удалось создать вид");
        }
    };

    const handleCreateBreed = async () => {
        if (!newBreedName.trim() || !selectedSpeciesId) return;

        await createBreed(selectedSpeciesId, newBreedName);

        setNewBreedName("");
        setSelectedSpeciesId("");
        onCreateBreedClose();

        await new Promise((resolve) => setTimeout(resolve, 1500));

        await loadSpecies();
    };

    const handleDeleteSpecies = async (speciesId: string) => {
        await deleteSpecies(speciesId);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await loadSpecies();
    };

    const handleDeleteBreed = async (speciesId: string, breedId: string) => {
        await deleteBreed(speciesId, breedId);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await loadSpecies();
    };

    const filteredSpecies = species.filter((s) => s.speciesName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-black">
            {/* Поиск и кнопки */}
            <div className="container mx-auto px-8 py-8">
                <div className="flex flex-row justify-between gap-3">
                    <div className="max-w-md flex-1">
                        <Input
                            placeholder="Поиск видов и пород..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            startContent={<Icon icon="lucide:search" className="h-4 w-4 text-gray-400" />}
                            classNames={{
                                input: "text-white placeholder-gray-500",
                                inputWrapper:
                                    "bg-black border border-green-500 hover:border-green-400 focus-within:border-green-400",
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            color="success"
                            startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                            onPress={onCreateSpeciesOpen}
                            className="bg-green-500 text-white hover:bg-green-600"
                        >
                            Добавить вид
                        </Button>
                        <Button
                            variant="bordered"
                            startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
                            onPress={onCreateBreedOpen}
                            className="border border-green-500 text-white hover:border-green-400 hover:bg-green-500/10"
                        >
                            Добавить породу
                        </Button>
                    </div>
                </div>
            </div>

            {/* Сообщения об ошибке */}
            {error && <div className="container mx-auto mb-4 px-6 text-red-500">{error}</div>}

            {/* Основной контент */}
            <div className="container mx-auto px-6 pb-8">
                {loading ? (
                    <div className="py-12 text-center">
                        <PawPrint className="mx-auto h-12 w-12 animate-pulse text-gray-400" />
                        <p className="mt-2 text-gray-400">Загрузка...</p>
                    </div>
                ) : filteredSpecies.length > 0 ? (
                    <div className="grid gap-6">
                        {filteredSpecies.map((speciesItem) => (
                            <Card
                                key={speciesItem.speciesId}
                                className="border border-green-500 bg-black transition-colors hover:border-green-400"
                            >
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{speciesItem.speciesName}</h3>
                                        <p className="text-gray-400">
                                            {speciesItem.breeds?.length}{" "}
                                            {speciesItem.breeds?.length === 1 ? "порода" : "пород"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            isIconOnly
                                            variant="bordered"
                                            size="sm"
                                            onPress={() => {
                                                void handleDeleteSpecies(speciesItem.speciesId);
                                            }}
                                            className="border border-red-500 text-red-400 hover:border-red-400 hover:bg-red-500/10"
                                        >
                                            <Icon icon="lucide:trash-2" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="flex flex-wrap gap-2">
                                        {speciesItem.breeds
                                            ?.filter((breed) => breed.breedName)
                                            .map((breed) => (
                                                <Chip
                                                    key={breed.breedId}
                                                    variant="flat"
                                                    onClose={() => {
                                                        void handleDeleteBreed(speciesItem.speciesId, breed.breedId);
                                                    }}
                                                    className="border border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
                                                >
                                                    {breed.breedName}
                                                </Chip>
                                            ))}
                                        {(!speciesItem.breeds ||
                                            speciesItem.breeds.length === 0 ||
                                            speciesItem.breeds.every((breed) => !breed.breedName)) && (
                                            <p className="text-gray-400 italic">Породы не добавлены</p>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <PawPrint className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-400">Виды не найдены</h3>
                        <p className="text-gray-400">Попробуйте изменить поисковый запрос</p>
                    </div>
                )}
            </div>

            {pagedData.items.length > 0 && (
                <Pagination
                    className="mt-6 flex justify-center"
                    initialPage={currentPage}
                    total={totalPages}
                    onChange={(page) => {
                        setCurrentPage(page);
                    }}
                    showControls
                    showShadow={true}
                    siblings={1}
                    boundaries={1}
                />
            )}
            {/* Модальное окно создания вида */}
            <Modal isOpen={isCreateSpeciesOpen} onClose={onCreateSpeciesClose}>
                <ModalContent className="border border-green-500 bg-black">
                    <ModalHeader className="border-b border-green-500/30">
                        <h2 className="text-white">Создать новый вид</h2>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Название вида"
                            value={newSpeciesName}
                            onValueChange={setNewSpeciesName}
                            classNames={{
                                input: "text-white",
                                inputWrapper: "bg-black border border-green-500",
                                label: "text-gray-400",
                            }}
                        />
                    </ModalBody>
                    <ModalFooter className="border-t border-green-500/30">
                        <Button variant="light" onPress={onCreateSpeciesClose} className="text-gray-400">
                            Отмена
                        </Button>
                        <Button
                            color="success"
                            onPress={() => {
                                void handleCreateSpecies();
                            }}
                            className="bg-green-500 text-white hover:bg-green-600"
                        >
                            Создать
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Модальное окно создания породы */}
            <Modal
                isOpen={isCreateBreedOpen}
                onClose={onCreateBreedClose}
                classNames={{
                    base: "bg-black border border-green-500",
                    header: "border-b border-green-500/30",
                    body: "py-6",
                    footer: "border-t border-green-500/30",
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h2 className="text-white">Создать новую породу</h2>
                        <p className="text-sm text-gray-400">Добавьте новую породу к существующему виду</p>
                    </ModalHeader>
                    <ModalBody>
                        <Select
                            label="Выберите вид"
                            placeholder="Выберите вид животного"
                            selectedKeys={selectedSpeciesId ? [selectedSpeciesId] : []}
                            onSelectionChange={(keys) => {
                                setSelectedSpeciesId(Array.from(keys)[0] as string);
                            }}
                            classNames={{
                                trigger: "bg-black border border-green-500 hover:border-green-400",
                                label: "text-gray-400",
                                value: "text-white",
                                listbox: "bg-black",
                                popoverContent: "bg-black border border-green-500",
                            }}
                        >
                            {species.map((s) => (
                                <SelectItem key={s.speciesId} className="text-white hover:bg-gray-900">
                                    {s.speciesName}
                                </SelectItem>
                            ))}
                        </Select>
                        <Input
                            label="Название породы"
                            placeholder="Например: Персидская"
                            value={newBreedName}
                            onValueChange={setNewBreedName}
                            classNames={{
                                input: "text-white",
                                inputWrapper:
                                    "bg-black border border-green-500 hover:border-green-400 focus-within:border-green-400",
                                label: "text-gray-400",
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onCreateBreedClose} className="text-gray-400">
                            Отмена
                        </Button>
                        <Button
                            color="success"
                            onPress={() => {
                                void handleCreateBreed();
                            }}
                            className="bg-green-500 text-white hover:bg-green-600"
                        >
                            Создать
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
