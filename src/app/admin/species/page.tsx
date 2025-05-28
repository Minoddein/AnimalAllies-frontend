"use client";

import { Edit, PawPrint, Plus, Search, Trash2 } from "lucide-react";

import { useState } from "react";

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
    Select,
    SelectItem,
    useDisclosure,
} from "@heroui/react";

interface Breed {
    id: string;
    name: string;
}

interface Species {
    id: string;
    name: string;
    breeds: Breed[];
}

export default function SpeciesManagement() {
    const [species, setSpecies] = useState<Species[]>([
        {
            id: "1",
            name: "Кошка",
            breeds: [
                { id: "1", name: "Персидская" },
                { id: "2", name: "Сиамская" },
                { id: "3", name: "Британская короткошерстная" },
            ],
        },
        {
            id: "2",
            name: "Собака",
            breeds: [
                { id: "4", name: "Лабрадор" },
                { id: "5", name: "Немецкая овчарка" },
                { id: "6", name: "Золотистый ретривер" },
            ],
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [newSpeciesName, setNewSpeciesName] = useState("");
    const [newBreedName, setNewBreedName] = useState("");
    const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("");

    const { isOpen: isCreateSpeciesOpen, onOpen: onCreateSpeciesOpen, onClose: onCreateSpeciesClose } = useDisclosure();
    const { isOpen: isCreateBreedOpen, onOpen: onCreateBreedOpen, onClose: onCreateBreedClose } = useDisclosure();

    const filteredSpecies = species.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.breeds.some((b) => b.name.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    const handleCreateSpecies = () => {
        if (!newSpeciesName.trim()) return;

        const newSpecies: Species = {
            id: Date.now().toString(),
            name: newSpeciesName,
            breeds: [],
        };

        setSpecies([...species, newSpecies]);
        setNewSpeciesName("");
        onCreateSpeciesClose();
    };

    const handleCreateBreed = () => {
        if (!newBreedName.trim() || !selectedSpeciesId) return;

        const newBreed: Breed = {
            id: Date.now().toString(),
            name: newBreedName,
        };

        setSpecies(species.map((s) => (s.id === selectedSpeciesId ? { ...s, breeds: [...s.breeds, newBreed] } : s)));

        setNewBreedName("");
        setSelectedSpeciesId("");
        onCreateBreedClose();
    };

    const handleDeleteSpecies = (speciesId: string) => {
        setSpecies(species.filter((s) => s.id !== speciesId));
    };

    const handleDeleteBreed = (speciesId: string, breedId: string) => {
        setSpecies(
            species.map((s) => (s.id === speciesId ? { ...s, breeds: s.breeds.filter((b) => b.id !== breedId) } : s)),
        );
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Search */}
            <div className="container mx-auto px-8 py-8">
                <div className="flex flex-row justify-between gap-3">
                    <div className="max-w-md flex-1">
                        <Input
                            placeholder="Поиск видов и пород..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            startContent={<Search className="h-4 w-4 text-gray-400" />}
                            classNames={{
                                base: "max-w-full",
                                mainWrapper: "h-full",
                                input: "text-white placeholder-gray-500",
                                inputWrapper:
                                    "h-full font-normal bg-black border border-green-500 hover:border-green-400 focus-within:border-green-400 transition-colors",
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            color="success"
                            startContent={<Plus className="h-4 w-4" />}
                            onPress={onCreateSpeciesOpen}
                            className="bg-green-500 text-white hover:bg-green-600"
                        >
                            Добавить вид
                        </Button>
                        <Button
                            variant="bordered"
                            startContent={<Plus className="h-4 w-4" />}
                            onPress={onCreateBreedOpen}
                            className="border border-green-500 text-white hover:border-green-400 hover:bg-green-500/10"
                        >
                            Добавить породу
                        </Button>
                    </div>
                </div>
            </div>

            {/* Species List */}
            <div className="container mx-auto px-6 pb-8">
                <div className="grid gap-6">
                    {filteredSpecies.map((speciesItem) => (
                        <Card
                            key={speciesItem.id}
                            className="border border-green-500 bg-black transition-colors hover:border-green-400"
                        >
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{speciesItem.name}</h3>
                                    <p className="text-gray-400">
                                        {speciesItem.breeds.length}{" "}
                                        {speciesItem.breeds.length === 1 ? "порода" : "пород"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        isIconOnly
                                        variant="bordered"
                                        size="sm"
                                        className="border border-green-500 text-gray-400 hover:border-green-400 hover:bg-green-500/10 hover:text-white"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        variant="bordered"
                                        size="sm"
                                        onPress={() => {
                                            handleDeleteSpecies(speciesItem.id);
                                        }}
                                        className="border border-red-500 text-red-400 hover:border-red-400 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="flex flex-wrap gap-2">
                                    {speciesItem.breeds.map((breed) => (
                                        <Chip
                                            key={breed.id}
                                            variant="flat"
                                            onClose={() => {
                                                handleDeleteBreed(speciesItem.id, breed.id);
                                            }}
                                            className="border border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
                                        >
                                            {breed.name}
                                        </Chip>
                                    ))}
                                    {speciesItem.breeds.length === 0 && (
                                        <p className="text-gray-400 italic">Породы не добавлены</p>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {filteredSpecies.length === 0 && (
                    <div className="py-12 text-center">
                        <PawPrint className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="mb-2 text-lg font-medium text-gray-400">Виды не найдены</h3>
                        <p className="text-gray-400">Попробуйте изменить поисковый запрос или добавьте новый вид</p>
                    </div>
                )}
            </div>

            {/* Create Species Modal */}
            <Modal
                isOpen={isCreateSpeciesOpen}
                onClose={onCreateSpeciesClose}
                classNames={{
                    base: "bg-black border border-green-500",
                    header: "border-b border-green-500/30",
                    body: "py-6",
                    footer: "border-t border-green-500/30",
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h2 className="text-white">Создать новый вид</h2>
                        <p className="text-sm text-gray-400">Добавьте новый вид животного в справочник</p>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Название вида"
                            placeholder="Например: Кошка"
                            value={newSpeciesName}
                            onValueChange={setNewSpeciesName}
                            classNames={{
                                input: "text-white",
                                inputWrapper:
                                    "bg-black border border-green-500 hover:border-green-400 focus-within:border-green-400",
                                label: "text-gray-400",
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onCreateSpeciesClose} className="text-gray-400">
                            Отмена
                        </Button>
                        <Button
                            color="success"
                            onPress={handleCreateSpecies}
                            className="bg-green-500 text-white hover:bg-green-600"
                        >
                            Создать
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Create Breed Modal */}
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
                                <SelectItem key={s.id} className="text-white hover:bg-gray-900">
                                    {s.name}
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
                            onPress={handleCreateBreed}
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
