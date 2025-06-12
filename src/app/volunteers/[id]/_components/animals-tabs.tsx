"use client";

import { Clock, Edit, GripVertical, Heart, MapPin, Plus, Trash2 } from "lucide-react";

import { useState } from "react";

import ModalOrDrawer from "@/components/modal-or-drawer";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import { Chip } from "@heroui/chip";
import { Button, Card, CardBody, Image, useDisclosure } from "@heroui/react";

interface Animal {
    id: string;
    name: string;
    type: string;
    breed: string;
    age: string;
    gender: string;
    status: "active" | "adopted" | "pending";
    location: string;
    image: string;
    dateAdded: string;
}

export default function MyAnimalsTab() {
    const [animals, setAnimals] = useState<Animal[]>([
        {
            id: "animal-1",
            name: "Пушинка",
            type: "Кролик",
            breed: "Декоративный",
            age: "1 год",
            gender: "Самка",
            status: "active",
            location: "Москва",
            image: "/placeholder.svg?height=200&width=200",
            dateAdded: "15.03.2025",
        },
        {
            id: "animal-2",
            name: "Барсик",
            type: "Кот",
            breed: "Сибирский",
            age: "3 года",
            gender: "Самец",
            status: "pending",
            location: "Москва",
            image: "/placeholder.svg?height=200&width=200",
            dateAdded: "02.04.2025",
        },
        {
            id: "animal-3",
            name: "Рекс",
            type: "Собака",
            breed: "Лабрадор",
            age: "2 года",
            gender: "Самец",
            status: "adopted",
            location: "Санкт-Петербург",
            image: "/placeholder.svg?height=200&width=200",
            dateAdded: "10.01.2025",
        },
        {
            id: "animal-4",
            name: "Мурка",
            type: "Кошка",
            breed: "Британская",
            age: "5 лет",
            gender: "Самка",
            status: "active",
            location: "Москва",
            image: "/placeholder.svg?height=200&width=200",
            dateAdded: "23.05.2025",
        },
    ]);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "active":
                return { label: "Активен", color: "success" };
            case "adopted":
                return { label: "Пристроен", color: "secondary" };
            case "pending":
                return { label: "В процессе", color: "warning" };
            default:
                return { label: "Неизвестно", color: "default" };
        }
    };

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

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Main Content */}
            <main className="mx-auto max-w-6xl px-6 py-4">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold">Мои животные</h1>
                        <p className="text-gray-400">Управляйте списком ваших животных и их статусами</p>
                    </div>
                    <Button className="bg-green-500 text-white hover:bg-green-600">
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
                                    {animals.filter((a) => a.status === "pending").length}
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
                                        {animals.map((animal, index) => {
                                            const status = getStatusLabel(animal.status);
                                            return (
                                                <Draggable key={animal.id} draggableId={animal.id} index={index}>
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
                                                                    src={animal.image || "/placeholder.svg"}
                                                                    alt={animal.name}
                                                                    width={64}
                                                                    height={64}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="mb-1 flex items-center gap-2">
                                                                    <h3 className="font-semibold">{animal.name}</h3>
                                                                    <Chip
                                                                        className="text-xs"
                                                                        variant="bordered"
                                                                        color={status.color}
                                                                    >
                                                                        {status.label}
                                                                    </Chip>
                                                                </div>
                                                                <div className="text-sm text-gray-400">
                                                                    {animal.type} • {animal.breed} • {animal.age} •{" "}
                                                                    {animal.gender}
                                                                </div>
                                                                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                                                    <div className="flex items-center">
                                                                        <MapPin className="mr-1 h-3 w-3" />
                                                                        {animal.location}
                                                                    </div>
                                                                    <div>Добавлено: {animal.dateAdded}</div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4 flex items-center gap-2">
                                                                <Button
                                                                    variant="light"
                                                                    isIconOnly
                                                                    className="text-gray-400 hover:text-white"
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
                                                                                animalDelete(animal.id);
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
