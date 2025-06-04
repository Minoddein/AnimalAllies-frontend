"use client";

import { Ban, Search, UserCheck, Users } from "lucide-react";

import { useState } from "react";

import { Chip } from "@heroui/chip";
import { Avatar, Button, Card, CardBody, CardHeader, Input } from "@heroui/react";

interface User {
    id: string;
    avatar: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    roles: string[];
    isBanned: boolean;
    joinDate: string;
}

const mockUsers: User[] = [
    {
        id: "1",
        avatar: "/placeholder.svg?height=40&width=40",
        firstName: "Анна",
        lastName: "Петрова",
        username: "anna_pets",
        email: "anna.petrova@example.com",
        roles: ["Волонтёр", "Модератор"],
        isBanned: false,
        joinDate: "2024-01-15",
    },
    {
        id: "2",
        avatar: "/placeholder.svg?height=40&width=40",
        firstName: "Михаил",
        lastName: "Сидоров",
        username: "mikhail_vet",
        email: "mikhail.sidorov@example.com",
        roles: ["Ветеринар"],
        isBanned: false,
        joinDate: "2024-02-20",
    },
    {
        id: "3",
        avatar: "/placeholder.svg?height=40&width=40",
        firstName: "Елена",
        lastName: "Козлова",
        username: "elena_helper",
        email: "elena.kozlova@example.com",
        roles: ["Пользователь"],
        isBanned: true,
        joinDate: "2024-03-10",
    },
    {
        id: "4",
        avatar: "/placeholder.svg?height=40&width=40",
        firstName: "Дмитрий",
        lastName: "Волков",
        username: "dmitry_admin",
        email: "dmitry.volkov@example.com",
        roles: ["Администратор", "Модератор"],
        isBanned: false,
        joinDate: "2023-12-05",
    },
    {
        id: "5",
        avatar: "/placeholder.svg?height=40&width=40",
        firstName: "Ольга",
        lastName: "Морозова",
        username: "olga_volunteer",
        email: "olga.morozova@example.com",
        roles: ["Волонтёр"],
        isBanned: false,
        joinDate: "2024-01-28",
    },
];

const getRoleColor = (role: string) => {
    switch (role) {
        case "Администратор":
            return "bg-red-500/20 text-red-400 border-red-500/30";
        case "Модератор":
            return "bg-purple-500/20 text-purple-400 border-purple-500/30";
        case "Ветеринар":
            return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        case "Волонтёр":
            return "bg-green-500/20 text-green-400 border-green-500/30";
        default:
            return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
};

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState(mockUsers);

    const filteredUsers = users.filter(
        (user) =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const toggleBanStatus = (userId: string) => {
        setUsers(users.map((user) => (user.id === userId ? { ...user, isBanned: !user.isBanned } : user)));
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">Управление пользователями</h1>
                    <p className="text-gray-400">Просмотр и управление пользователями платформы AnimalAllies</p>
                </div>

                {/* Stats Card */}
                <Card className="mb-8 border-gray-800 bg-gray-900/50">
                    <CardHeader className="pb-4">
                        <Users className="h-5 w-5 text-purple-400" />
                        <span>Статистика пользователей</span>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{users.length}</div>
                                <div className="text-sm text-gray-400">Всего пользователей</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">
                                    {users.filter((u) => !u.isBanned).length}
                                </div>
                                <div className="text-sm text-gray-400">Активных</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-400">
                                    {users.filter((u) => u.isBanned).length}
                                </div>
                                <div className="text-sm text-gray-400">Заблокированных</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-400">
                                    {users.filter((u) => u.roles.includes("Волонтёр")).length}
                                </div>
                                <div className="text-sm text-gray-400">Волонтёров</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Поиск пользователей..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                            className="border-gray-700 bg-gray-900/50 pl-10 text-white placeholder-gray-400 focus:border-purple-500"
                        />
                    </div>
                </div>

                {/* Users List */}
                <Card className="border-gray-800 bg-gray-900/50">
                    <CardBody className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="p-4 text-left font-medium text-gray-300">Пользователь</th>
                                        <th className="p-4 text-left font-medium text-gray-300">Контакты</th>
                                        <th className="p-4 text-left font-medium text-gray-300">Роли</th>
                                        <th className="p-4 text-left font-medium text-gray-300">Статус</th>
                                        <th className="p-4 text-left font-medium text-gray-300">Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-gray-800/50 transition-colors hover:bg-gray-800/30"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-10 w-10">
                                                        {/*<AvatarImage src={user.avatar || "/placeholder.svg"} />
                                                        <AvatarFallback className="bg-gray-700 text-white">
                                                            {user.firstName[0]}
                                                            {user.lastName[0]}
                                                        </AvatarFallback>*/}
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-white">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-400">@{user.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-white">{user.email}</div>
                                                <div className="text-sm text-gray-400">
                                                    Регистрация: {new Date(user.joinDate).toLocaleDateString("ru-RU")}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <Chip
                                                            key={role}
                                                            variant="flat"
                                                            className={`text-xs ${getRoleColor(role)}`}
                                                        >
                                                            {role}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Chip
                                                    variant="flat"
                                                    className={
                                                        user.isBanned
                                                            ? "border-red-500/30 bg-red-500/20 text-red-400"
                                                            : "border-green-500/30 bg-green-500/20 text-green-400"
                                                    }
                                                >
                                                    {user.isBanned ? "Заблокирован" : "Активен"}
                                                </Chip>
                                            </td>
                                            <td className="p-4">
                                                <Button
                                                    variant="flat"
                                                    size="sm"
                                                    onPress={() => {
                                                        toggleBanStatus(user.id);
                                                    }}
                                                    className={
                                                        user.isBanned
                                                            ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                                                            : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                                                    }
                                                >
                                                    {user.isBanned ? (
                                                        <>
                                                            <UserCheck className="mr-1 h-4 w-4" />
                                                            Разблокировать
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Ban className="mr-1 h-4 w-4" />
                                                            Заблокировать
                                                        </>
                                                    )}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>

                {filteredUsers.length === 0 && (
                    <div className="py-8 text-center text-gray-400">Пользователи не найдены</div>
                )}
            </div>
        </div>
    );
}
