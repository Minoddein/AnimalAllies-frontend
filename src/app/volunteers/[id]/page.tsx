"use client";

import {
    ArrowLeft,
    Award,
    Calendar,
    Camera,
    Car,
    Clock,
    Heart,
    Mail,
    MessageCircle,
    Phone,
    Share2,
    TrendingUp,
    Users,
} from "lucide-react";

import Link from "next/link";

import { Avatar, Badge, Button, Card, CardBody, CardHeader } from "@heroui/react";

const mockVolunteer = {
    id: "1",
    name: "Анна Петрова",
    avatar: "/placeholder.svg?height=400&width=400",
    location: "Москва",
    joinDate: "Апрель 2023",
    experience: "1 год",
    email: "anna@example.com",
    phone: "+7 (999) 123-45-67",
    skills: ["Уход за животными", "Фотография", "Транспортировка"],
    badges: ["Опытный", "Наставник"],
    status: "active",
    rating: 4.9,
    bio: "Я люблю животных с детства и всегда мечтала помогать им. В свободное время фотографирую животных для сайта приюта и помогаю с транспортировкой. Готова помочь с адаптацией новых питомцев в семьях.",
    stats: {
        animals: 15,
        events: 8,
        hours: 120,
        rating: 4.9,
        reviews: 23,
    },
    achievements: [
        { name: "Первое животное", description: "Помог пристроить первое животное", date: "Май 2023", icon: Heart },
        { name: "Фотограф", description: "Сделал 100+ фотографий для приюта", date: "Август 2023", icon: Camera },
        { name: "Водитель", description: "Перевез 50+ животных", date: "Октябрь 2023", icon: Car },
        { name: "Наставник", description: "Обучил 5 новых волонтёров", date: "Декабрь 2023", icon: Users },
    ],
    activities: [
        { date: "15.05.2024", type: "event", description: "Участие в дне открытых дверей приюта", impact: "Высокий" },
        { date: "10.05.2024", type: "animal", description: "Помощь в пристройстве кота Барсика", impact: "Высокий" },
        {
            date: "01.05.2024",
            type: "training",
            description: "Прохождение курса по первой помощи животным",
            impact: "Средний",
        },
        {
            date: "25.04.2024",
            type: "event",
            description: "Организация фотосессии для животных приюта",
            impact: "Высокий",
        },
    ],
};

export default function VolunteerProfilePage() {
    const volunteer = mockVolunteer;

    return (
        <div className="gradient-bg min-h-screen pl-6">
            <div className="container py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/volunteers"
                        className="text-primary hover:text-primary/80 inline-flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Назад к списку волонтёров
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="glass-effect sticky top-24 border-0 shadow-xl">
                            <CardBody className="pt-6">
                                <div className="text-center">
                                    {/* Avatar with status */}
                                    <div className="relative mb-4 inline-block">
                                        <Avatar className="ring-primary/20 h-32 w-32 ring-4">
                                            {/*<AvatarImage
                                                src={volunteer.avatar || "/placeholder.svg"}
                                                alt={volunteer.name}
                                            />*/}
                                            {/*<AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                                {volunteer.name.charAt(0)}
                                            </AvatarFallback>*/}
                                        </Avatar>
                                    </div>

                                    <h1 className="mb-2 text-2xl font-bold">{volunteer.name}</h1>
                                </div>

                                {/* Contact Info */}
                                <div className="mb-6 space-y-3">
                                    <div className="bg-background/50 flex items-center gap-3 rounded-lg p-3">
                                        <Calendar className="text-primary h-4 w-4" />
                                        <span className="text-sm">С нами с {volunteer.joinDate}</span>
                                    </div>
                                    <div className="bg-background/50 flex items-center gap-3 rounded-lg p-3">
                                        <Clock className="text-primary h-4 w-4" />
                                        <span className="text-sm">Опыт: {volunteer.experience}</span>
                                    </div>
                                    <div className="bg-background/50 flex items-center gap-3 rounded-lg p-3">
                                        <Mail className="text-primary h-4 w-4" />
                                        <span className="text-sm">{volunteer.email}</span>
                                    </div>
                                    <div className="bg-background/50 flex items-center gap-3 rounded-lg p-3">
                                        <Phone className="text-primary h-4 w-4" />
                                        <span className="text-sm">{volunteer.phone}</span>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="mb-6">
                                    <h3 className="mb-3 text-sm font-semibold">Навыки</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {volunteer.skills.map((skill, index) => (
                                            <Badge key={index} variant="flat" className="bg-primary/10 text-primary">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Achievements */}
                                <div className="mb-6">
                                    <h3 className="mb-3 text-sm font-semibold">Достижения</h3>
                                    <div className="space-y-2">
                                        {volunteer.badges.map((badge, index) => (
                                            <div
                                                key={index}
                                                className="bg-background/50 flex items-center gap-2 rounded-lg p-2"
                                            >
                                                <Award className="text-primary h-4 w-4" />
                                                <span className="text-sm font-medium">{badge}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <Button className="bg-primary hover:bg-primary/90 w-full">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Написать сообщение
                                    </Button>
                                    <Button variant="flat" className="w-full">
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Поделиться профилем
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Bio */}
                        <Card className="glass-effect border-0 shadow-xl">
                            <CardHeader>О волонтёре</CardHeader>
                            <CardBody>
                                <p className="text-muted-foreground leading-relaxed">{volunteer.bio}</p>
                            </CardBody>
                        </Card>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <Card className="glass-effect border-0 shadow-lg">
                                <CardBody className="pt-6 text-center">
                                    <Heart className="mx-auto mb-2 h-8 w-8 text-red-500" />
                                    <div className="text-2xl font-bold">{volunteer.stats.animals}</div>
                                    <p className="text-muted-foreground text-xs">Животных пристроено</p>
                                </CardBody>
                            </Card>
                            <Card className="glass-effect border-0 shadow-lg">
                                <CardBody className="pt-6 text-center">
                                    <Users className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                                    <div className="text-2xl font-bold">{volunteer.stats.events}</div>
                                    <p className="text-muted-foreground text-xs">Мероприятий</p>
                                </CardBody>
                            </Card>
                            <Card className="glass-effect border-0 shadow-lg">
                                <CardBody className="pt-6 text-center">
                                    <Clock className="mx-auto mb-2 h-8 w-8 text-green-500" />
                                    <div className="text-2xl font-bold">{volunteer.stats.hours}</div>
                                    <p className="text-muted-foreground text-xs">Часов помощи</p>
                                </CardBody>
                            </Card>
                            <Card className="glass-effect border-0 shadow-lg">
                                <CardBody className="pt-6 text-center">
                                    <TrendingUp className="mx-auto mb-2 h-8 w-8 text-purple-500" />
                                    <div className="text-2xl font-bold">{volunteer.stats.rating}</div>
                                    <p className="text-muted-foreground text-xs">Рейтинг</p>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Achievements Timeline */}
                        <Card className="glass-effect border-0 shadow-xl">
                            <CardHeader>Достижения</CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    {volunteer.achievements.map((achievement, index) => {
                                        const IconComponent = achievement.icon;
                                        return (
                                            <div
                                                key={index}
                                                className="bg-background/30 flex items-start gap-4 rounded-lg p-4"
                                            >
                                                <div className="bg-primary/10 rounded-full p-3">
                                                    <IconComponent className="text-primary h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{achievement.name}</h4>
                                                    <p className="text-muted-foreground mb-1 text-sm">
                                                        {achievement.description}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">{achievement.date}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Activity Timeline */}
                        <Card className="glass-effect border-0 shadow-xl">
                            <CardHeader>Последняя активность</CardHeader>
                            <CardBody>
                                {/*<Tabs className="w-full">
                                    <div className="mb-6 grid w-full grid-cols-4">
                                        <Tab value="all">Все</Tab>
                                        <Tab value="events">События</Tab>
                                        <Tab value="animals">Животные</Tab>
                                        <Tab value="training">Обучение</Tab>
                                    </div>
                                    <TabsContent value="all" className="space-y-4">
                                        {volunteer.activities.map((activity, index) => (
                                            <div
                                                key={index}
                                                className="bg-background/30 flex items-start gap-4 rounded-lg p-4"
                                            >
                                                <div className="bg-primary/10 rounded-full p-2">
                                                    {activity.type === "event" && (
                                                        <Users className="text-primary h-4 w-4" />
                                                    )}
                                                    {activity.type === "animal" && (
                                                        <Heart className="text-primary h-4 w-4" />
                                                    )}
                                                    {activity.type === "training" && (
                                                        <Award className="text-primary h-4 w-4" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{activity.description}</p>
                                                    <div className="mt-2 flex items-center gap-4">
                                                        <p className="text-muted-foreground text-sm">{activity.date}</p>
                                                        <Badge
                                                            variant={
                                                                activity.impact === "Высокий" ? "default" : "secondary"
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {activity.impact} импакт
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </TabsContent>
                                </Tabs>*/}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
