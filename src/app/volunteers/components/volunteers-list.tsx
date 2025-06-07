"use client";

import { Calendar, Clock, Heart, MessageCircle, User } from "lucide-react";

import { useState } from "react";

import Link from "next/link";

import { Avatar, Button, Card, CardBody } from "@heroui/react";

interface Volunteer {
    id: string;
    name: string;
    avatar: string;
    location: string;
    joinDate: string;
    experience: string;
    skills: string[];
    badges: string[];
    status: "active" | "inactive";
    rating: number;
    animalsHelped: number;
    description: string;
}

const mockVolunteers: Volunteer[] = [
    {
        id: "1",
        name: "Анна Петрова",
        avatar: "/placeholder.svg?height=400&width=400",
        location: "Москва",
        joinDate: "Апрель 2023",
        experience: "1 год",
        skills: ["Уход за животными", "Фотография", "Транспортировка"],
        badges: ["Опытный", "Наставник"],
        status: "active",
        rating: 4.9,
        animalsHelped: 15,
        description: "Люблю животных с детства. Специализируюсь на фотографии для приюта и помощи в адаптации.",
    },
    {
        id: "2",
        name: "Иван Смирнов",
        avatar: "/placeholder.svg?height=400&width=400",
        location: "Санкт-Петербург",
        joinDate: "Июнь 2022",
        experience: "2 года",
        skills: ["Ветеринария", "Социальные сети", "Организация мероприятий"],
        badges: ["Ветеринар", "Координатор"],
        status: "active",
        rating: 5.0,
        animalsHelped: 32,
        description: "Ветеринар по образованию. Помогаю с медицинскими вопросами и организацией мероприятий.",
    },
    {
        id: "3",
        name: "Мария Иванова",
        avatar: "/placeholder.svg?height=400&width=400",
        location: "Екатеринбург",
        joinDate: "Январь 2024",
        experience: "6 месяцев",
        skills: ["Социальные сети", "Фотография"],
        badges: ["Новичок"],
        status: "active",
        rating: 4.7,
        animalsHelped: 8,
        description: "Начинающий волонтёр. Веду социальные сети приюта и делаю красивые фотографии животных.",
    },
    {
        id: "4",
        name: "Алексей Козлов",
        avatar: "/placeholder.svg?height=400&width=400",
        location: "Новосибирск",
        joinDate: "Март 2021",
        experience: "3 года",
        skills: ["Транспортировка", "Строительство", "Ремонт"],
        badges: ["Водитель", "Мастер"],
        status: "active",
        rating: 4.8,
        animalsHelped: 28,
        description: "Помогаю с транспортировкой животных и ремонтными работами в приютах.",
    },
];

export default function VolunteersList() {
    const [volunteers] = useState<Volunteer[]>(mockVolunteers);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Найдено {volunteers.length} волонтёров</h2>
                <div className="flex gap-2">
                    <Button variant="flat" size="sm">
                        По рейтингу
                    </Button>
                    <Button variant="flat" size="sm">
                        По опыту
                    </Button>
                    <Button variant="flat" size="sm">
                        По активности
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {volunteers.map((volunteer) => (
                    <Card
                        key={volunteer.id}
                        className="card-hover glass-effect group overflow-hidden border-0 shadow-lg"
                    >
                        <CardBody className="p-0">
                            <div className="relative">
                                {/* Background gradient */}
                                <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-green-500/10" />

                                <div className="relative p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <Avatar className="ring-primary/20 h-20 w-20 ring-4">
                                                {/*<AvatarImage
                                                    src={volunteer.avatar || "/placeholder.svg"}
                                                    alt={volunteer.name}
                                                    className="object-cover"
                                                />*/}
                                                {/*<AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                                                    {volunteer.name.charAt(0)}
                                                </AvatarFallback>*/}
                                            </Avatar>
                                        </div>

                                        {/* Main Info */}
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex items-start justify-between">
                                                <div>
                                                    <h3 className="group-hover:text-primary text-xl font-bold transition-colors">
                                                        {volunteer.name}
                                                    </h3>
                                                    <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{volunteer.experience}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                                                {volunteer.description}
                                            </p>

                                            {/* Stats */}
                                            <div className="mb-4 flex items-center gap-4">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Heart className="h-4 w-4 text-red-500" />
                                                    <span className="font-medium">{volunteer.animalsHelped}</span>
                                                    <span className="text-muted-foreground">животных</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="text-primary h-4 w-4" />
                                                    <span className="text-muted-foreground">
                                                        с {volunteer.joinDate}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="flat" className="flex-1">
                                                    <MessageCircle className="mr-2 h-4 w-4" />
                                                    Написать
                                                </Button>
                                                <Link href={`/volunteers/${volunteer.id}`} className="flex-1">
                                                    <Button size="sm" className="bg-primary hover:bg-primary/90 w-full">
                                                        <User className="mr-2 h-4 w-4" />
                                                        Профиль
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Load More */}
            <div className="pt-8 text-center">
                <Button variant="flat" size="lg" className="px-8">
                    Загрузить ещё
                </Button>
            </div>
        </div>
    );
}
