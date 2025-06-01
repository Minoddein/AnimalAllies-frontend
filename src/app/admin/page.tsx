"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { getVolunteerRequestsInWaitingCount } from "@/api/requests";
import { Card, CardBody, CardHeader, cn } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function AdminDashboard() {
    const [requestInWaitingCount, setRequestInWaitingCount] = useState(0);

    async function loadRequestsInWaitingCount() {
        const response = await getVolunteerRequestsInWaitingCount();

        setRequestInWaitingCount(response.data.result?.value ?? 0);
    }

    useEffect(() => {
        void loadRequestsInWaitingCount();
    }, []);

    const stats = [
        {
            title: "Всего видов",
            value: "12",
            description: "Активных видов животных",
            icon: "lucide:paw-print",
            color: "text-emerald-400",
        },
        {
            title: "Всего пород",
            value: "156",
            description: "Зарегистрированных пород",
            icon: "lucide:paw-print",
            color: "text-blue-400",
        },
        {
            title: "Пользователи",
            value: "2,847",
            description: "Активных пользователей",
            icon: "lucide:users",
            color: "text-purple-400",
        },
        {
            title: "Заявки",
            value: requestInWaitingCount,
            description: "Ожидают рассмотрения",
            icon: "lucide:file-text",
            color: "text-orange-400",
        },
    ];

    return (
        <div className="min-h-screen bg-black">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-white">Панель администратора</h1>
                    <p className="text-gray-400">Управление платформой AnimalAllies</p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.title} className="border border-green-500/30 bg-black/90 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="text-sm font-medium text-gray-300">{stat.title}</div>
                                <Icon icon={stat.icon} className={cn("h-4 w-4", stat.color)} />
                            </CardHeader>
                            <CardBody>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <p className="text-xs text-gray-400">{stat.description}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card className="border border-green-500/30 bg-black/90 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex flex-row justify-between gap-2">
                                <div className="text-white">Последние действия</div>
                                <div className="text-gray-400">Недавние изменения в системе</div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-white">Добавлен новый вид Хорёк</p>
                                        <p className="text-xs text-gray-400">2 часа назад</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-white">Обновлена порода Мейн-кун</p>
                                        <p className="text-xs text-gray-400">4 часа назад</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-white">Удалена порода Неизвестная</p>
                                        <p className="text-xs text-gray-400">1 день назад</p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border border-green-500/30 bg-black/90 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex flex-row justify-between gap-2">
                                <div className="text-white">Быстрые действия</div>
                                <div className="text-gray-400">Часто используемые функции</div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Кнопка "Добавить вид" */}
                                <Link
                                    href="/admin/species"
                                    className="relative rounded-lg border border-emerald-600/30 bg-emerald-600/10 p-4 pt-8 transition-colors hover:bg-emerald-600/20"
                                >
                                    <Icon
                                        icon="lucide:paw-print"
                                        className="absolute top-4 left-4 h-5 w-5 text-emerald-400"
                                    />
                                    <p className="flex h-full items-center justify-center text-sm font-medium text-white">
                                        Добавить вид
                                    </p>
                                </Link>

                                {/* Кнопка "Добавить породу" */}
                                <Link
                                    href="/admin/species"
                                    className="relative rounded-lg border border-blue-600/30 bg-blue-600/10 p-4 pt-8 transition-colors hover:bg-blue-600/20"
                                >
                                    <Icon
                                        icon="lucide:paw-print"
                                        className="absolute top-4 left-4 h-5 w-5 text-blue-400"
                                    />
                                    <p className="flex h-full items-center justify-center text-sm font-medium text-white">
                                        Добавить породу
                                    </p>
                                </Link>

                                {/* Кнопка "Пользователи" */}
                                <button className="relative rounded-lg border border-purple-600/30 bg-purple-600/10 p-4 pt-8 transition-colors hover:bg-purple-600/20">
                                    <Icon
                                        icon="lucide:users"
                                        className="absolute top-4 left-4 h-5 w-5 text-purple-400"
                                    />
                                    <p className="flex h-full items-center justify-center text-sm font-medium text-white">
                                        Пользователи
                                    </p>
                                </button>

                                {/* Кнопка "Заявки" */}
                                <Link
                                    href="/requests"
                                    className="relative rounded-lg border border-orange-600/30 bg-orange-600/10 p-4 pt-8 transition-colors hover:bg-orange-600/20"
                                >
                                    <Icon
                                        icon="lucide:file-text"
                                        className="absolute top-4 left-4 h-5 w-5 text-orange-400"
                                    />
                                    <p className="flex h-full items-center justify-center text-sm font-medium text-white">
                                        Заявки
                                    </p>
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
