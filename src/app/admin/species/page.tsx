"use client";

import { PawPrint } from "lucide-react";

import { useEffect, useState } from "react";

import {
    createBreed,
    createSpecies,
    deleteBreed,
    deleteSpecies,
    getAllSpeciesWithBreeds,
    getSpecies,
} from "@/api/species";
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
    const [, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newSpeciesName, setNewSpeciesName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [newBreedName, setNewBreedName] = useState("");
    const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("");
    const { isOpen: isCreateSpeciesOpen, onOpen: onCreateSpeciesOpen, onClose: onCreateSpeciesClose } = useDisclosure();
    const { isOpen: isCreateBreedOpen, onOpen: onCreateBreedOpen, onClose: onCreateBreedClose } = useDisclosure();
    const [speciesForCreate, setSpeciesForCreate] = useState<Species[]>([]);

    const loadSpecies = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSpecies(currentPage, itemsPerPage, undefined, undefined, searchTerm);
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

    const loadSpeciesWithBreedsForCreation = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllSpeciesWithBreeds();
            if (!response.data.result?.value) {
                throw new Error("Некорректный формат данных от сервера");
            }

            const speciesWithBreeds = response.data.result.value.map((s) => ({
                ...s,
                breeds: (s.breeds ?? [])
                    .filter((breed) => typeof breed === "object")
                    .map((breed) => ({
                        breedId: breed.breedId || `temp-${Math.random().toString(36).substring(2, 9)}`,
                        breedName: breed.breedName || "Без названия",
                    })),
            }));

            setSpeciesForCreate(speciesWithBreeds);
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

    useEffect(() => {
        void loadSpeciesWithBreedsForCreation();
    }, []);

    const handleCreateSpecies = async () => {
        if (!newSpeciesName.trim()) return;

        try {
            await createSpecies(newSpeciesName);
            setNewSpeciesName("");
            onCreateSpeciesClose();
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await loadSpecies();
            await loadSpeciesWithBreedsForCreation();
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
        await loadSpeciesWithBreedsForCreation();
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

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setCurrentPage(1);
        await loadSpecies();
    };

    const filteredSpecies = species.filter((s) => s.speciesName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-black">
            {/* Поиск и кнопки */}
            <div className="container mx-auto px-8 py-8">
                <div className="flex flex-row justify-between gap-3">
                    <div className="max-w-md flex-1">
                        <form
                            onSubmit={(e) => {
                                void handleSearch(e);
                            }}
                        >
                            <Input
                                placeholder="Поиск видов и пород..."
                                value={searchTerm}
                                onValueChange={setSearchTerm}
                                startContent={<Icon icon="lucide:search" className="h-4 w-4 text-gray-400" />}
                            />
                        </form>
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
                            className="border border-gray-600 text-white hover:border-gray-500 hover:bg-gray-700/10"
                        >
                            Добавить породу
                        </Button>
                    </div>
                </div>
            </div>

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
                                            className="border border-red-700 text-red-400 hover:border-red-600 hover:bg-red-500/10"
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
                                                    className="border border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                                                >
                                                    {breed.breedName}
                                                </Chip>
                                            ))}
                                        {(!speciesItem.breeds || speciesItem.breeds.length === 0) && (
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
                    color="primary"
                    siblings={1}
                    boundaries={1}
                />
            )}

            {/* Модальное окно создания вида */}
            <Modal isOpen={isCreateSpeciesOpen} onClose={onCreateSpeciesClose}>
                <ModalContent>
                    <ModalHeader>
                        <h2 className="text-white">Создать новый вид</h2>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Название вида"
                            variant="bordered"
                            value={newSpeciesName}
                            onValueChange={setNewSpeciesName}
                            classNames={{
                                input: "text-white",
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onCreateSpeciesClose} className="text-gray-400">
                            Отмена
                        </Button>
                        <Button
                            color="primary"
                            onPress={() => {
                                void handleCreateSpecies();
                            }}
                        >
                            Создать
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Модальное окно создания породы */}
            <Modal isOpen={isCreateBreedOpen} onClose={onCreateBreedClose}>
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
                            variant="bordered"
                        >
                            {speciesForCreate.map((s) => (
                                <SelectItem key={s.speciesId} className="text-white hover:bg-gray-700">
                                    {s.speciesName}
                                </SelectItem>
                            ))}
                        </Select>
                        <Input
                            label="Название породы"
                            placeholder="Например: Персидская"
                            value={newBreedName}
                            variant="bordered"
                            onValueChange={setNewBreedName}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onCreateBreedClose} className="text-gray-400">
                            Отмена
                        </Button>
                        <Button
                            color="primary"
                            onPress={() => {
                                void handleCreateBreed();
                            }}
                        >
                            Создать
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
