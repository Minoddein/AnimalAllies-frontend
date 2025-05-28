"use client";

import { ArrowLeft, Check, Edit, Send, Trash2, X, XIcon } from "lucide-react";

import React, { useEffect, useRef, useState } from "react";

import {
    deleteMessage,
    editMessage,
    getMessagesFromDiscussion,
    markAsReadMessages,
    postMessage,
} from "@/api/discussions";
import { Discussion } from "@/models/discussion";
import { Message } from "@/models/message";
import { CardBody, CardHeader } from "@heroui/card";
import { Avatar, Button, Card, Chip, Input } from "@heroui/react";

interface DiscussionProps {
    relationId: string;
    chatPartner: {
        id: string;
        name: string;
        surname: string;
        avatar: string;
        status?: "Waiting" | "Submitted" | "Rejected" | "RevisionRequired" | "Approved";
    };
    currentUser: {
        id: string;
        name: string;
        surname: string;
        avatar: string;
    };
    onBack?: () => void;
}

const StatusChip = ({ status }: { status?: DiscussionProps["chatPartner"]["status"] }) => {
    if (!status) return null;

    switch (status) {
        case "Waiting":
            return <Chip className="border-yellow-500/20 bg-yellow-500/10 text-xs text-yellow-500">Ожидает</Chip>;
        case "Submitted":
            return <Chip className="border-blue-500/20 bg-blue-500/10 text-xs text-blue-500">На рассмотрении</Chip>;
        case "Approved":
            return <Chip className="border-green-500/20 bg-green-500/10 text-xs text-green-500">Одобрено</Chip>;
        case "Rejected":
            return <Chip className="border-red-500/20 bg-red-500/10 text-xs text-red-500">Отклонено</Chip>;
        case "RevisionRequired":
            return (
                <Chip className="border-orange-500/20 bg-orange-500/10 text-xs text-orange-500">Требует доработки</Chip>
            );
        default:
            return null;
    }
};

export function OpenDiscussion({ relationId, chatPartner, currentUser, onBack }: DiscussionProps) {
    const [discussion, setDiscussion] = useState<Discussion | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState(""); // Поле ввода для нового или редактируемого сообщения
    const [isEditing, setIsEditing] = useState(false); // Флаг редактирования
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null); // ID редактируемого сообщения
    const [contextMenu, setContextMenu] = useState<{ messageId: string; x: number; y: number } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Прокрутка вниз
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Загрузка обсуждения
    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                const response = await getMessagesFromDiscussion(relationId);
                if (response.data.result?.value) {
                    const data = response.data.result.value;
                    setDiscussion(data);
                    setMessages(
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        data.messages ? data.messages.filter((msg): msg is Message => !!msg && "userId" in msg) : [],
                    );
                    await markAsReadMessages(response.data.result.value.id);
                }
            } catch (err) {
                console.error("Error fetching discussion:", err);
            }
        };
        void fetchDiscussion();
    }, [relationId]);

    // Прокрутка вниз при обновлении сообщений
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Отправка нового сообщения или сохранение изменений
    const handleSendMessageOrEdit = async () => {
        if (isEditing && editingMessageId) {
            await editMessage(discussion!.id, editingMessageId, newMessage);
            const updatedMessages = messages.map((msg) =>
                msg.messageId === editingMessageId ? { ...msg, text: newMessage, isEdited: true } : msg,
            );
            setMessages(updatedMessages);
            setIsEditing(false);
            setEditingMessageId(null);
            setNewMessage("");
        } else {
            // Режим отправки нового сообщения
            if (!newMessage.trim()) return;
            const message: Message = {
                messageId: Date.now().toString(),
                text: newMessage,
                createdAt: new Date(),
                isEdited: false,
                userId: currentUser.id,
                firstName: currentUser.name,
            };
            await postMessage(discussion!.id, message.text);
            setMessages([...messages, message]);
            setNewMessage("");
        }
    };

    // Загрузка сообщения для редактирования
    const handleEditMessage = (messageId: string) => {
        const message = messages.find((m) => m.messageId === messageId);
        if (message) {
            setNewMessage(message.text);
            setIsEditing(true);
            setEditingMessageId(messageId);
        }
        setContextMenu(null);
    };

    // Удаление сообщения
    const handleDeleteMessage = async (messageId: string) => {
        setMessages(messages.filter((msg) => msg.messageId !== messageId));
        setContextMenu(null);
        await deleteMessage(discussion!.id, messageId);
    };

    // Отмена редактирования
    const cancelEdit = () => {
        setIsEditing(false);
        setEditingMessageId(null);
        setNewMessage("");
    };

    // Обработчик контекстного меню
    const handleContextMenu = (e: React.MouseEvent, messageId: string, isCurrentUser: boolean) => {
        if (!isCurrentUser) return;
        e.preventDefault();
        setContextMenu({
            messageId,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <div className="fixed right-6 bottom-6 z-50 h-[500px] w-96">
                <Card className="flex h-full flex-col border-green-900/20 bg-black/90 backdrop-blur-sm">
                    <CardHeader className="border-b border-green-900/20 pb-3">
                        <div className="grid grid-cols-3 items-center">
                            <div className="justify-self-start">
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
                            </div>

                            <div className="flex items-center gap-2 justify-self-center">
                                <Avatar className="h-10 w-10" name={chatPartner.avatar || "?"} />
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-white">
                                        {`${chatPartner.name} ${chatPartner.surname}`}
                                    </span>
                                    <StatusChip status={chatPartner.status} />
                                    {discussion?.discussionStatus === "Closed" && (
                                        <Chip className="border-red-500/20 bg-red-500/10 text-xs text-red-500">
                                            Дискуссия закрыта
                                        </Chip>
                                    )}
                                </div>
                            </div>

                            <div className="justify-self-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onPress={onBack}
                                    className="h-8 w-8 p-0 hover:bg-red-500/20"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="flex-1 space-y-4 overflow-y-auto p-4">
                        {messages.length > 0 ? (
                            messages.map((message) => {
                                const isCurrentUser = message.userId === currentUser.id;
                                return (
                                    <div
                                        key={message.messageId}
                                        className={`flex ${isCurrentUser ? "flex-row-reverse" : ""} gap-2`}
                                        onContextMenu={(e) => {
                                            handleContextMenu(e, message.messageId, isCurrentUser);
                                        }}
                                    >
                                        {!isCurrentUser && (
                                            <Avatar
                                                className="h-8 w-8 flex-shrink-0"
                                                name={chatPartner.avatar || "?"}
                                            />
                                        )}
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${
                                                isCurrentUser
                                                    ? "bg-green-500 text-black"
                                                    : "border border-gray-700 bg-gray-800 text-white"
                                            }`}
                                        >
                                            <div className="text-sm">{message.text}</div>
                                            <div className="mt-1 flex items-center justify-between gap-2">
                                                {message.isEdited && (
                                                    <div
                                                        className={`text-xs ${
                                                            isCurrentUser ? "text-black/70" : "text-gray-400"
                                                        }`}
                                                    >
                                                        изменено
                                                    </div>
                                                )}
                                                <div
                                                    className={`text-xs ${
                                                        isCurrentUser ? "text-black/70" : "text-gray-400"
                                                    }`}
                                                >
                                                    {formatTime(new Date(message.createdAt))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                Диалог пуст. Начните общение!
                            </div>
                        )}
                        {discussion?.discussionStatus === "Closed" && (
                            <div className="flex flex-col items-center justify-center py-4">
                                <div className="rounded-lg bg-red-900/20 p-3 text-center text-sm text-red-400">
                                    Дискуссия закрыта для новых сообщений
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardBody>
                    <div className="border-t border-green-900/20 p-4">
                        {discussion?.discussionStatus === "Closed" ? (
                            <div className="text-center text-sm text-gray-500">
                                Невозможно отправить сообщение в закрытую дискуссию
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            void handleSendMessageOrEdit();
                                        }
                                    }}
                                    placeholder={isEditing ? "Редактирование сообщения..." : "Введите сообщение..."}
                                    className="flex-1 border-gray-700 bg-gray-800 focus:border-green-500"
                                />
                                <Button
                                    onPress={() => void handleSendMessageOrEdit()}
                                    disabled={!newMessage.trim()}
                                    className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
                                >
                                    {isEditing ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                                </Button>
                                {isEditing && (
                                    <Button onPress={cancelEdit} className="bg-red-500 hover:bg-red-600">
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
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
                            void handleDeleteMessage(contextMenu.messageId);
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
