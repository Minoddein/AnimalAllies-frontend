"use client";

import { Ban, Search, UserCheck, Users } from "lucide-react";

import { useEffect, useState } from "react";

import { BanUser, UsersCount, getUsersByPage, getUsersCount } from "@/api/accounts";
import { Chip } from "@heroui/chip";
import { Avatar, Button, Card, CardBody, CardHeader, Input, Pagination } from "@heroui/react";

interface UserMember {
    id: string;
    avatar: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    roles: string[];
    isBanned: boolean;
}

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
        case "Пользователь":
            return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        default:
            return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
};

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<UserMember[]>();
    const [stats, setStats] = useState<UsersCount>();
    const [currentPage, setCurrentPage] = useState(1);
    const [pagedData, setPagedData] = useState<{ items: UserMember[]; totalCount: number }>({
        items: [],
        totalCount: 0,
    });

    const itemsPerPage = 10;

    const totalPages = Math.ceil(pagedData.totalCount / itemsPerPage);

    async function getUsersStats() {
        try {
            const responseUsersCount = await getUsersCount();
            if (!responseUsersCount.data.result) {
                throw new Error("users count data was not found");
            }

            const stats = responseUsersCount.data.result.value;

            setStats(stats);
        } catch (error) {
            console.error(error);
        }
    }

    async function banUser(userId: string) {
        await BanUser(userId);

        await getUsers();
    }

    async function getUsers() {
        try {
            const response = await getUsersByPage(currentPage, itemsPerPage);
            if (!response.data.result?.value) {
                throw new Error("cannot load users");
            }

            const userMembers = response.data.result.value.items.map(
                (user) =>
                    ({
                        id: user.id,
                        avatar: "",
                        firstName: user.adminProfile?.adminFirstName ?? user.participantAccount?.firstName,
                        lastName: user.adminProfile?.adminSecondName ?? user.participantAccount?.secondName,
                        username: user.userName,
                        email: user.email,
                        roles: user.roles
                            .map((r) => r.name)
                            .map((v) => {
                                if (v === "Participant") {
                                    return "Пользователь";
                                } else if (v === "Volunteer") {
                                    return "Волонтёр";
                                } else if (v === "Admin") {
                                    return "Администратор";
                                }
                            }),
                        isBanned: user.isBanned,
                    }) as UserMember,
            );

            setUsers(userMembers);
            setPagedData({
                items: userMembers,
                totalCount: response.data.result.value.totalCount,
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        void getUsers();
    }, [currentPage]);

    useEffect(() => {
        void getUsersStats();
    }, []);

    const filteredUsers = pagedData.items.filter(
        (user) =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const toggleBanStatus = (userId: string) => {
        setUsers(users!.map((user) => (user.id === userId ? { ...user, isBanned: !user.isBanned } : user)));
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
                                <div className="text-2xl font-bold text-white">{stats?.totalUsers}</div>
                                <div className="text-sm text-gray-400">Всего пользователей</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">{stats?.activeUsers}</div>
                                <div className="text-sm text-gray-400">Активных</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-400">{stats?.blockedUsers}</div>
                                <div className="text-sm text-gray-400">Заблокированных</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-400">{stats?.volunteerUsers}</div>
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
                                                        <div className="text-sm text-gray-400">@{user.lastName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-white">{user.email}</div>
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
                                                {user.roles.includes("Администратор") ? null : (
                                                    <Button
                                                        variant="flat"
                                                        size="sm"
                                                        onPress={() => {
                                                            toggleBanStatus(user.id);
                                                            void banUser(user.id);
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
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
                {pagedData.items.length > 0 && (
                    <Pagination
                        className="mt-6 flex justify-center"
                        initialPage={currentPage}
                        page={currentPage}
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
                {filteredUsers.length === 0 && (
                    <div className="py-8 text-center text-gray-400">Пользователи не найдены</div>
                )}
            </div>
        </div>
    );
}
