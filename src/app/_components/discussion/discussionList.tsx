"use client";

import { MessageCircle, X } from "lucide-react";

import { useState } from "react";

import { Avatar, Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";

import { Discussion } from "./discussion";

interface ChatUser {
    id: string;
    name: string;
    role: "admin" | "user";
    avatar: string;
    status: "Waiting" | "Submitted" | "Rejected" | "RevisionRequired" | "Approved";
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount?: number;
}

// Моковые данные чатов
const mockChats: ChatUser[] = [
    {
        id: "user1",
        name: "Петр Смирнов",
        role: "user",
        avatar: "ПС",
        status: "Submitted",
        lastMessage: "Да, у меня есть опыт работы с травмированными животными...",
        lastMessageTime: new Date("2025-05-24T11:15:00"),
        unreadCount: 2,
    },
    {
        id: "user2",
        name: "Анна Иванова",
        role: "user",
        avatar: "АИ",
        status: "RevisionRequired",
        lastMessage: "Спасибо, я дополню информацию и отправлю заново.",
        lastMessageTime: new Date("2025-05-24T09:45:00"),
    },
    {
        id: "user3",
        name: "Екатерина Соколова",
        role: "user",
        avatar: "ЕС",
        status: "Waiting",
        lastMessage: "Здравствуйте! Когда будет рассмотрена моя заявка?",
        lastMessageTime: new Date("2025-05-24T08:20:00"),
        unreadCount: 1,
    },
    {
        id: "user4",
        name: "Михаил Петров",
        role: "user",
        avatar: "МП",
        status: "Approved",
        lastMessage: "Отлично! Когда можно приступить к работе?",
        lastMessageTime: new Date("2025-05-23T16:30:00"),
    },
    {
        id: "user5",
        name: "Ольга Васильева",
        role: "user",
        avatar: "ОВ",
        status: "Rejected",
        lastMessage: "Понятно, спасибо за обратную связь.",
        lastMessageTime: new Date("2025-05-23T14:15:00"),
    },
];

// Компонент для отображения статуса
const StatusChip = ({ status }: { status: ChatUser["status"] }) => {
    switch (status) {
        case "Waiting":
            return (
                <Chip
                    variant="flat"
                    size="sm"
                    className="border-yellow-500/20 bg-yellow-500/10 text-xs text-yellow-500"
                >
                    Ожидает
                </Chip>
            );
        case "Submitted":
            return (
                <Chip variant="flat" size="sm" className="border-blue-500/20 bg-blue-500/10 text-xs text-blue-500">
                    На рассмотрении
                </Chip>
            );
        case "Approved":
            return (
                <Chip variant="flat" size="sm" className="border-green-500/20 bg-green-500/10 text-xs text-green-500">
                    Одобрено
                </Chip>
            );
        case "Rejected":
            return (
                <Chip variant="flat" size="sm" className="border-red-500/20 bg-red-500/10 text-xs text-red-500">
                    Отклонено
                </Chip>
            );
        case "RevisionRequired":
            return (
                <Chip
                    variant="flat"
                    size="sm"
                    className="border-orange-500/20 bg-orange-500/10 text-xs text-orange-500"
                >
                    Требует доработки
                </Chip>
            );
        default:
            return null;
    }
};

export function DiscussionList() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);
    const [chats] = useState<ChatUser[]>(mockChats);

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else {
            return date.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
            });
        }
    };

    const handleChatSelect = (chat: ChatUser) => {
        setSelectedChat(chat);
        setIsOpen(false); // Закрываем список чатов
    };

    const handleBackToList = () => {
        setSelectedChat(null);
        setIsOpen(true); // Возвращаемся к списку чатов
    };

    // Если выбран конкретный чат, показываем Discussion
    if (selectedChat) {
        return <Discussion chatPartner={selectedChat} onBack={handleBackToList} />;
    }

    // Кнопка для открытия списка чатов
    if (!isOpen) {
        return (
            <div className="fixed right-6 bottom-6 z-50">
                <Button
                    onPress={() => {
                        setIsOpen(true);
                    }}
                    className="h-14 w-14 rounded-full bg-green-500 shadow-lg hover:bg-green-600"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            </div>
        );
    }

    // Список чатов
    return (
        <div className="fixed right-6 bottom-6 z-50 h-[400px] w-80">
            <Card className="flex h-full flex-col border-green-900/20 bg-black/90 backdrop-blur-sm">
                <CardHeader className="border-b border-green-900/20 pb-3">
                    <div className="grid grid-cols-[1fr_auto] items-center gap-24">
                        <h3 className="text-base font-semibold text-white">Чаты по заявкам</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onPress={() => {
                                setIsOpen(false);
                            }}
                            className="h-8 w-8 p-0 hover:bg-red-500/20"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardBody className="flex-1 overflow-y-auto p-0">
                    <div>
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => {
                                    handleChatSelect(chat);
                                }}
                                className="cursor-pointer border-b border-gray-800/50 p-3 transition-colors last:border-b-0 hover:bg-gray-800/30"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10" name={chat.avatar} />
                                        {chat.unreadCount && chat.unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-black">
                                                {chat.unreadCount}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center justify-between gap-2">
                                            <h4 className="truncate text-sm font-medium text-white">{chat.name}</h4>
                                            <span className="flex-shrink-0 text-xs text-gray-400">
                                                {formatTime(chat.lastMessageTime)}
                                            </span>
                                        </div>

                                        <div className="mb-1">
                                            <StatusChip status={chat.status} />
                                        </div>

                                        <p className="truncate text-xs text-gray-400">{chat.lastMessage}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
