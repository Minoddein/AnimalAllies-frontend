"use client";

import { ArrowLeft, Check, Edit, Send, Trash2, X, XIcon } from "lucide-react";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { CardBody, CardHeader } from "@heroui/card";
import { Avatar, Button, Card, Chip, Input } from "@heroui/react";

interface Message {
    id: string;
    text: string;
    sender: "admin" | "user";
    timestamp: Date;
    isEdited?: boolean;
}

interface ChatUser {
    id: string;
    name: string;
    role: "admin" | "user";
    avatar: string;
    status?: "Waiting" | "Submitted" | "Rejected" | "RevisionRequired" | "Approved";
}

interface DiscussionProps {
    chatPartner: ChatUser;
    onBack?: () => void;
}

// Моковые данные
const mockMessages: Message[] = [
    {
        id: "1",
        text: "Здравствуйте! Я рассматриваю вашу заявку на волонтёрство. У меня есть несколько вопросов.",
        sender: "admin",
        timestamp: new Date("2025-05-24T10:30:00"),
    },
    {
        id: "2",
        text: "Здравствуйте! Конечно, готов ответить на любые вопросы.",
        sender: "user",
        timestamp: new Date("2025-05-24T10:32:00"),
    },
    {
        id: "3",
        text: "Расскажите подробнее о вашем опыте работы с животными. В заявке указано 'работал в зоомагазине', но хотелось бы больше деталей.",
        sender: "admin",
        timestamp: new Date("2025-05-24T10:35:00"),
    },
    {
        id: "4",
        text: "Я работал в зоомагазине 'Четыре лапы' 2 года. Занимался уходом за животными, кормлением, уборкой клеток. Также помогал покупателям выбирать корма и аксессуары.",
        sender: "user",
        timestamp: new Date("2025-05-24T10:38:00"),
    },
    {
        id: "5",
        text: "Отлично! А есть ли у вас опыт работы с бездомными или травмированными животными?",
        sender: "admin",
        timestamp: new Date("2025-05-24T10:40:00"),
    },
];

const currentUser: ChatUser = {
    id: "admin1",
    name: "Анна Дмитриева",
    role: "admin",
    avatar: "АД",
};

// Компонент для отображения статуса
const StatusChip = ({ status }: { status?: ChatUser["status"] }) => {
    if (!status) return null;

    switch (status) {
        case "Waiting":
            return (
                <Chip variant="flat" className="border-yellow-500/20 bg-yellow-500/10 text-xs text-yellow-500">
                    Ожидает
                </Chip>
            );
        case "Submitted":
            return (
                <Chip variant="flat" className="border-blue-500/20 bg-blue-500/10 text-xs text-blue-500">
                    На рассмотрении
                </Chip>
            );
        case "Approved":
            return (
                <Chip variant="flat" className="border-green-500/20 bg-green-500/10 text-xs text-green-500">
                    Одобрено
                </Chip>
            );
        case "Rejected":
            return (
                <Chip variant="flat" className="border-red-500/20 bg-red-500/10 text-xs text-red-500">
                    Отклонено
                </Chip>
            );
        case "RevisionRequired":
            return (
                <Chip variant="flat" className="border-orange-500/20 bg-orange-500/10 text-xs text-orange-500">
                    Требует доработки
                </Chip>
            );
        default:
            return null;
    }
};

export function OpenDiscussion({ chatPartner, onBack }: DiscussionProps) {
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [newMessage, setNewMessage] = useState("");
    const [editingMessage, setEditingMessage] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [contextMenu, setContextMenu] = useState<{
        messageId: string;
        x: number;
        y: number;
    } | null>(null);
    const [, setIsContextMenuOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Убрана условная логика из хуков
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenu && chatRef.current && !chatRef.current.contains(event.target as Node)) {
                setContextMenu(null);
                setIsContextMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [contextMenu]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: "admin",
            timestamp: new Date(),
        };

        setMessages([...messages, message]);
        setNewMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleContextMenu = (e: React.MouseEvent, messageId: string, sender: string) => {
        if (sender !== "admin") return;

        e.preventDefault();
        setContextMenu({
            messageId,
            x: e.clientX,
            y: e.clientY,
        });
        setIsContextMenuOpen(true);
    };

    const handleEditMessage = (messageId: string) => {
        const message = messages.find((m) => m.id === messageId);
        if (message) {
            setEditingMessage(messageId);
            setEditText(message.text);
        }
        setContextMenu(null);
        setIsContextMenuOpen(false);
    };

    const handleSaveEdit = () => {
        if (!editText.trim()) return;

        setMessages(
            messages.map((msg) => (msg.id === editingMessage ? { ...msg, text: editText, isEdited: true } : msg)),
        );
        setEditingMessage(null);
        setEditText("");
        setIsContextMenuOpen(false);
    };

    const handleCancelEdit = () => {
        setEditingMessage(null);
        setEditText("");
        setIsContextMenuOpen(false);
    };

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((msg) => msg.id !== messageId));
        setContextMenu(null);
        setIsContextMenuOpen(false);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <div className="fixed right-6 bottom-6 z-50 h-[500px] w-96" ref={chatRef}>
                <Card className="flex h-full flex-col border-green-900/20 bg-black/90 backdrop-blur-sm">
                    <CardHeader className="border-b border-green-900/20 pb-3">
                        <div className="grid grid-cols-[auto_1fr_auto] items-center">
                            {onBack && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onPress={onBack}
                                    className="h-8 w-8 p-0 hover:bg-gray-500/20"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )}

                            <div className="flex items-center gap-2 justify-self-start">
                                <Avatar className="h-10 w-10" name={chatPartner.avatar || "?"} />
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-white">
                                        {chatPartner.name || "Неизвестный пользователь"}
                                    </span>
                                    <StatusChip status={chatPartner.status} />
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onPress={onBack}
                                className="h-8 w-8 justify-self-end p-0 hover:bg-red-500/20"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardBody className="flex-1 space-y-4 overflow-y-auto p-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] ${message.sender === "admin" ? "order-2" : "order-1"}`}
                                    onContextMenu={(e) => {
                                        handleContextMenu(e, message.id, message.sender);
                                    }}
                                >
                                    {editingMessage === message.id ? (
                                        <div className="rounded-lg border border-green-500/20 bg-gray-800 p-3">
                                            <Input
                                                value={editText}
                                                onChange={(e) => {
                                                    setEditText(e.target.value);
                                                }}
                                                className="mb-2 border-green-500/20 bg-transparent"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleSaveEdit();
                                                    } else if (e.key === "Escape") {
                                                        handleCancelEdit();
                                                    }
                                                }}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onPress={handleSaveEdit}
                                                    className="h-6 bg-green-500 px-2 hover:bg-green-600"
                                                >
                                                    <Check className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    onPress={handleCancelEdit}
                                                    className="h-6 border-red-500/20 px-2 hover:bg-red-500/20"
                                                >
                                                    <XIcon className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={`rounded-lg p-3 ${
                                                message.sender === "admin"
                                                    ? "bg-green-500 text-black"
                                                    : "border border-gray-700 bg-gray-800 text-white"
                                            }`}
                                        >
                                            <div className="text-sm">{message.text}</div>
                                            <div className="mt-1 flex items-center justify-between">
                                                <div
                                                    className={`text-xs ${message.sender === "admin" ? "text-black/70" : "text-gray-400"}`}
                                                >
                                                    {formatTime(message.timestamp)}
                                                </div>
                                                {message.isEdited && (
                                                    <div
                                                        className={`text-xs ${message.sender === "admin" ? "text-black/70" : "text-gray-400"}`}
                                                    >
                                                        изменено
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className={message.sender === "admin" ? "order-1 mr-2" : "order-2 ml-2"}>
                                    <Avatar
                                        className="h-6 w-6"
                                        name={
                                            message.sender === "admin" ? currentUser.avatar : chatPartner.avatar || "?"
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </CardBody>

                    <div className="border-t border-green-900/20 p-4">
                        <div className="flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                }}
                                onKeyDown={handleKeyPress}
                                placeholder="Введите сообщение..."
                                className="flex-1 border-gray-700 bg-gray-800 focus:border-green-500"
                            />
                            <Button
                                onPress={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Контекстное меню */}
            {contextMenu && (
                <div
                    className="fixed z-[60] min-w-[120px] rounded-md border border-gray-700 bg-gray-800 py-1 shadow-lg"
                    style={{
                        left: contextMenu.x,
                        top: contextMenu.y,
                    }}
                >
                    <button
                        onClick={() => {
                            handleEditMessage(contextMenu.messageId);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-700"
                    >
                        <Edit className="h-3 w-3" />
                        Редактировать
                    </button>
                    <button
                        onClick={() => {
                            handleDeleteMessage(contextMenu.messageId);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700"
                    >
                        <Trash2 className="h-3 w-3" />
                        Удалить
                    </button>
                </div>
            )}
        </>
    );
}
