"use client";

import { Calendar, Camera, Clock, Heart, MapPin, Search, User } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { Button, Card, CardBody, CardHeader, Chip, Input, Select, SelectItem } from "@heroui/react";

export default function VolunteerEvents() {
    const events = [
        {
            id: 1,
            title: "Поиск пропавшего лабрадора Рекса",
            description: "Присоединяйтесь к поиску золотистого лабрадора, пропавшего в районе Сокольников.",
            type: "Поиск животных",
            location: "Сокольники, Москва",
            date: "15 декабря 2024",
            time: "10:00",
            participants: 12,
            maxParticipants: 20,
            image: "/images/events/search-dog.jpg",
            urgent: true,
        },
        {
            id: 2,
            title: "Выставка 'Найди друга'",
            description: "Знакомьтесь с животными из приютов на нашей ежемесячной выставке.",
            type: "Выставка",
            location: "Парк Горького, Москва",
            date: "18 декабря 2024",
            time: "12:00",
            participants: 8,
            maxParticipants: 15,
            image: "/images/events/exhibition.jpg",
        },
        {
            id: 3,
            title: "Сбор для приюта 'Верные друзья'",
            description: "Помогите собрать корм и средства для животных в приюте.",
            type: "Сбор пожертвований",
            location: "ТЦ Европейский, Москва",
            date: "20 декабря 2024",
            time: "11:00",
            participants: 6,
            maxParticipants: 10,
            image: "/images/events/fundraising.jpg",
        },
        {
            id: 4,
            title: "Форум волонтёров AnimalAllies",
            description: "Встреча для обмена опытом и планирования новых проектов.",
            type: "Форум",
            location: "Библиотека им. Ленина, Москва",
            date: "22 декабря 2024",
            time: "18:00",
            participants: 15,
            maxParticipants: 25,
            image: "/images/events/forum.jpg",
        },
        {
            id: 5,
            title: "Фотосессия для приютских животных",
            description: "Создайте красивые фото животных для поиска хозяев.",
            type: "Фотосессия",
            location: "Приют 'Дом для всех', Подмосковье",
            date: "25 декабря 2024",
            time: "14:00",
            participants: 4,
            maxParticipants: 8,
            image: "/images/events/photoshoot.jpg",
        },
        {
            id: 6,
            title: "Новогодняя ярмарка",
            description: "Праздничная ярмарка в поддержку животных.",
            type: "Ярмарка",
            location: "Красная площадь, Москва",
            date: "28 декабря 2024",
            time: "10:00",
            participants: 20,
            maxParticipants: 30,
            image: "/images/events/fair.jpg",
        },
    ];

    const getEventIcon = (type: string) => {
        switch (type) {
            case "Поиск животных":
                return <Search className="h-4 w-4" />;
            case "Выставка":
                return <Heart className="h-4 w-4" />;
            case "Сбор пожертвований":
                return <Heart className="h-4 w-4" />;
            case "Форум":
                return <User className="h-4 w-4" />;
            case "Фотосессия":
                return <Camera className="h-4 w-4" />;
            case "Ярмарка":
                return <Heart className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case "Поиск животных":
                return "danger";
            case "Выставка":
                return "primary";
            case "Сбор пожертвований":
                return "success";
            case "Форум":
                return "secondary";
            case "Фотосессия":
                return "warning";
            case "Ярмарка":
                return "default";
            default:
                return "default";
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative py-16">
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black"></div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                        События <span className="text-green-500">волонтёров</span>
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
                        Присоединяйтесь к мероприятиям и помогайте животным обрести дом.
                    </p>

                    {/* Search and Filter */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
                        <Input
                            placeholder="Поиск событий..."
                            variant="bordered"
                            classNames={{
                                input: "text-white",
                                inputWrapper: "bg-black/50 border-gray-700 hover:border-green-500",
                            }}
                            startContent={<Search className="h-4 w-4 text-gray-400" />}
                            className="w-full md:w-64"
                        />
                        <Select
                            placeholder="Тип события"
                            variant="bordered"
                            classNames={{
                                trigger: "bg-black/50 border-gray-700 hover:border-green-500",
                                value: "text-white",
                                popoverContent: "bg-black border-gray-700 text-white",
                            }}
                            className="w-full md:w-48"
                        >
                            {[
                                "Все типы",
                                "Поиск животных",
                                "Выставка",
                                "Сбор пожертвований",
                                "Форум",
                                "Фотосессия",
                                "Ярмарка",
                            ].map((type) => (
                                <SelectItem key={type.toLowerCase()} className="text-white">
                                    {type}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            placeholder="Район"
                            variant="bordered"
                            classNames={{
                                trigger: "bg-black/50 border-gray-700 hover:border-green-500",
                                value: "text-white",
                                popoverContent: "bg-black border-gray-700 text-white",
                            }}
                            className="w-full md:w-48"
                        >
                            {["Вся Москва", "Центр", "Север", "Юг", "Восток", "Запад"].map((district) => (
                                <SelectItem key={district.toLowerCase()} className="text-white">
                                    {district}
                                </SelectItem>
                            ))}
                        </Select>
                        <Button
                            color="success"
                            className="bg-green-500 hover:bg-green-600"
                            startContent={<Search className="h-4 w-4" />}
                        >
                            Найти
                        </Button>
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="bg-black py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Card
                                key={event.id}
                                className="border-gray-800 bg-gray-900 transition-all duration-200 hover:border-green-500"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="rounded-t-lg object-cover"
                                        onError={(e) => (e.currentTarget.src = "/images/fallback.jpg")}
                                    />
                                    {event.urgent && (
                                        <Chip color="danger" className="absolute top-2 left-2">
                                            Срочно!
                                        </Chip>
                                    )}
                                    <Chip
                                        color={getEventColor(event.type)}
                                        className="absolute top-2 right-2"
                                        startContent={getEventIcon(event.type)}
                                    >
                                        {event.type}
                                    </Chip>
                                </div>
                                <CardHeader className="flex flex-col gap-2">
                                    <h3 className="line-clamp-2 text-lg font-semibold">{event.title}</h3>
                                    <p className="line-clamp-2 text-sm text-gray-400">{event.description}</p>
                                </CardHeader>
                                <CardBody className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-300">
                                        <MapPin className="mr-2 h-4 w-4 text-green-500" />
                                        {event.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <Calendar className="mr-2 h-4 w-4 text-green-500" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300">
                                        <Clock className="mr-2 h-4 w-4 text-green-500" />
                                        {event.time}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-300">
                                        <div className="flex items-center">
                                            <User className="mr-2 h-4 w-4 text-green-500" />
                                            {event.participants}/{event.maxParticipants}
                                        </div>
                                        <div className="h-2 w-16 rounded-full bg-gray-700">
                                            <div
                                                className="h-2 rounded-full bg-green-500"
                                                style={{
                                                    width: `${(event.participants / event.maxParticipants) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        color="success"
                                        className="mt-4 w-full bg-green-500 hover:bg-green-600"
                                        startContent={<User className="h-4 w-4" />}
                                    >
                                        Участвовать
                                    </Button>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-green-600 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-3xl font-bold">Создайте своё событие</h2>
                    <p className="mx-auto mb-6 max-w-lg text-lg text-green-100">
                        Не нашли подходящее мероприятие? Организуйте своё и вдохновите других!
                    </p>
                    <Button
                        size="lg"
                        className="bg-white text-green-600 hover:bg-gray-100"
                        startContent={<Heart className="h-5 w-5" />}
                    >
                        Создать событие
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 bg-black py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <Heart className="h-6 w-6 text-green-500" />
                                <span className="text-xl font-bold">AnimalAllies</span>
                            </div>
                            <p className="text-gray-400">Объединяем людей для помощи животным.</p>
                        </div>
                        <div>
                            <h3 className="mb-4 font-semibold">Разделы</h3>
                            <ul className="space-y-2 text-gray-400">
                                {["Животные", "Волонтёры", "События", "Заявки"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="hover:text-green-500">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-semibold">Помощь</h3>
                            <ul className="space-y-2 text-gray-400">
                                {["Как стать волонтёром", "Правила участия", "Контакты", "FAQ"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="hover:text-green-500">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-semibold">Контакты</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>📧 info@animalallies.ru</li>
                                <li>📱 +7 (495) 123-45-67</li>
                                <li>📍 Москва, Россия</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-4 text-center text-gray-400">
                        © 2025 AnimalAllies. Все права защищены.
                    </div>
                </div>
            </footer>
        </div>
    );
}
