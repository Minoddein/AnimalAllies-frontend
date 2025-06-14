"use client";

import { Clock, Edit, GripVertical, Heart, MapPin, Plus, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { PetDto } from "@/api/dtos/pet/petDtos";
import { getPetWithPaginationByVolunteerId } from "@/api/pet";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { myAnimals } from "@/data/my-animals";
import { Animal } from "@/types/Animal";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import { Button, Card, CardBody, Chip, Image, useDisclosure } from "@heroui/react";

interface AnimalStatus {
    label: string;
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
}

interface MyAnimalsTabProps {
    volunteerId: string;
}

export default function MyAnimalsTab({ volunteerId }: MyAnimalsTabProps) {
    const router = useRouter();
    const [animals, setAnimals] = useState<Animal[]>(myAnimals);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [currentPage] = useState(1);
    const [pagedData, setPagedData] = useState<{ items: PetDto[]; totalCount: number }>({
        items: [],
        totalCount: 0,
    });
    const pageSize = 10;

    const getStatusLabel = (status: string): AnimalStatus => {
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Не указана";

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return "Неверный формат";
        }
    };
    const calculateAge = (birthDateString: string | undefined): string => {
        if (!birthDateString) return "Возраст неизвестен";

        try {
            const birthDate = new Date(birthDateString);
            const today = new Date();

            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            const lastDigit = age % 10;
            const lastTwoDigits = age % 100;

            let ageWord = "лет";
            if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
                ageWord = "лет";
            } else {
                switch (lastDigit) {
                    case 1:
                        ageWord = "год";
                        break;
                    case 2:
                    case 3:
                    case 4:
                        ageWord = "года";
                        break;
                    default:
                        ageWord = "лет";
                }
            }

            return `${age} ${ageWord}`;
        } catch (error) {
            console.error("Ошибка при вычислении возраста:", error);
            return "Возраст неизвестен";
        }
    };

    async function loadAnimals() {
        try {
            const response = await getPetWithPaginationByVolunteerId(volunteerId, pageSize, currentPage);
            if (!response.data.result?.value) {
                throw new Error("cannot load pet for volunteer");
            }

            setPagedData({
                items: response.data.result.value.items,
                totalCount: response.data.result.value.totalCount,
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        void loadAnimals();
    }, [currentPage]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(animals);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setAnimals(items);
    };

    const animalDelete = (id: string) => {
        const items = Array.from(animals);
        const deletedAnimalIndex = items.findIndex((a) => a.id === id);
        items.splice(deletedAnimalIndex, 1);

        setAnimals(items);
    };

    const handleAddAnimal = () => {
        router.push(`/animals/edit/${volunteerId}`);
    };

    const handleEditAnimal = (id: string) => {
        router.push(`/my-animals/edit?id=${id}`);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Main Content */}
            <main className="mx-auto max-w-6xl px-6 py-4">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold">Мои животные</h1>
                        <p className="text-gray-400">Управляйте списком ваших животных и их статусами</p>
                    </div>
                    <Button className="bg-green-500 text-white hover:bg-green-600" onPress={handleAddAnimal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить животное
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className="border-gray-700 bg-gray-900/50">
                        <CardBody className="flex items-center justify-between space-y-2 p-6">
                            <div>
                                <p className="mb-1 text-gray-400">Всего животных</p>
                                <p className="text-center text-3xl font-bold">{animals.length}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                                <Heart className="h-6 w-6" />
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="border-gray-700 bg-gray-900/50">
                        <CardBody className="flex items-center justify-between p-6">
                            <div>
                                <p className="mb-1 text-gray-400">Пристроено</p>
                                <p className="text-center text-3xl font-bold">
                                    {animals.filter((a) => a.status === "adopted").length}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                                <Heart className="h-6 w-6 fill-green-500" />
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="border-gray-700 bg-gray-900/50">
                        <CardBody className="flex items-center justify-between p-6">
                            <div>
                                <p className="mb-1 text-gray-400">В процессе</p>
                                <p className="text-center text-3xl font-bold">
                                    {animals.filter((a) => a.status === "needs_help").length}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
                                <Clock className="h-6 w-6" />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Instructions */}
                <div className="mb-8 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                    <p className="text-gray-300">
                        <strong>Подсказка:</strong> Вы можете изменить порядок животных, перетаскивая их за иконку{" "}
                        <GripVertical className="inline h-4 w-4" />
                    </p>
                </div>

                {/* Animals List */}
                <Card className="border-gray-700 bg-gray-900/50">
                    <CardBody className="p-0">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="animals">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="divide-y divide-gray-800"
                                    >
                                        {pagedData.items.map((animal, index) => {
                                            const status = getStatusLabel(animal.helpStatus);
                                            return (
                                                <Draggable key={animal.petId} draggableId={animal.petId} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className="flex items-center p-4 transition-colors hover:bg-gray-800/50"
                                                        >
                                                            <div
                                                                {...provided.dragHandleProps}
                                                                className="mr-4 cursor-move text-gray-500"
                                                            >
                                                                <GripVertical className="h-5 w-5" />
                                                            </div>
                                                            <div className="mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                                                                <Image
                                                                    src={"/placeholder.svg"}
                                                                    alt={animal.petName}
                                                                    width={64}
                                                                    height={64}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="mb-1 flex items-center gap-2">
                                                                    <h3 className="font-semibold">{animal.petName}</h3>
                                                                    <Chip
                                                                        className="text-xs text-white"
                                                                        color={status.color}
                                                                        variant="bordered"
                                                                    >
                                                                        {status.label}
                                                                    </Chip>
                                                                </div>
                                                                <div className="text-sm text-gray-400">
                                                                    {animal.speciesName} • {animal.breedName} •{" "}
                                                                    {calculateAge(animal.birthDate)} •{" "}
                                                                    {animal.sex === "Male"
                                                                        ? "Самец"
                                                                        : animal.sex === "Female"
                                                                          ? "Самка"
                                                                          : "Неизвестно"}
                                                                </div>
                                                                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                                                    <div className="flex items-center">
                                                                        <MapPin className="mr-1 h-3 w-3" />
                                                                        {animal.state + "," + animal.city}
                                                                    </div>
                                                                    <div>
                                                                        Добавлено: {formatDate(animal.arriveDate)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4 flex items-center gap-2">
                                                                <Button
                                                                    variant="light"
                                                                    isIconOnly
                                                                    className="text-gray-400 hover:text-white"
                                                                    onPress={() => {
                                                                        handleEditAnimal(animal.petId);
                                                                    }}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="light"
                                                                    isIconOnly
                                                                    className="text-gray-400 hover:text-red-500"
                                                                    onPress={onOpen}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                                <ModalOrDrawer
                                                                    label="Подтверждение"
                                                                    isOpen={isOpen}
                                                                    onOpenChangeAction={onOpenChange}
                                                                >
                                                                    <p>
                                                                        Вы уверены что хотите удалить закреплённое
                                                                        животное из списка?
                                                                    </p>
                                                                    <div className="flex flex-row justify-end gap-4">
                                                                        <Button onPress={onClose}>Нет</Button>
                                                                        <Button
                                                                            startContent={
                                                                                <Trash2 className="h-4 w-4" />
                                                                            }
                                                                            variant="light"
                                                                            color="danger"
                                                                            onPress={() => {
                                                                                animalDelete(animal.petId);
                                                                                onClose();
                                                                            }}
                                                                        >
                                                                            Да
                                                                        </Button>
                                                                    </div>
                                                                </ModalOrDrawer>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
}
