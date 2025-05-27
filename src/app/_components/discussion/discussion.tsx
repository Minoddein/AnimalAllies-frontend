"use client";

import { ArrowLeft, Check, Edit, Send, Trash2, X, XIcon } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { getMessagesFromDiscussion, markAsReadMessages, postMessage } from "@/api/discussions";
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
    const [newMessage, setNewMessage] = useState("");
    const [editingMessage, setEditingMessage] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [contextMenu, setContextMenu] = useState<{ messageId: string; x: number; y: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                setIsLoading(true);
                const response = await getMessagesFromDiscussion(relationId);

                if (response.data.result?.value) {
                    const data = response.data.result.value;
                    setDiscussion(data);
                    setMessages(data.messages);
                    await markAsReadMessages(response.data.result.value.id);
                }
            } catch (err) {
                setError("Не удалось загрузить обсуждение");
                console.error("Error fetching discussion:", err);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchDiscussion();
    }, [relationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenu && chatRef.current && !chatRef.current.contains(event.target as Node)) {
                setContextMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [contextMenu]);

    const handleSendMessage = async () => {
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
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSendMessage();
        }
    };

    const handleContextMenu = (e: React.MouseEvent, messageId: string, isCurrentUser: boolean) => {
        if (!isCurrentUser) return;

        e.preventDefault();
        setContextMenu({
            messageId,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleEditMessage = (messageId: string) => {
        const message = messages.find((m) => m.messageId === messageId);
        if (message) {
            setEditingMessage(messageId);
            setEditText(message.text);
        }
        setContextMenu(null);
    };

    const handleSaveEdit = () => {
        if (!editText.trim()) return;

        setMessages(
            messages.map((msg) =>
                msg.messageId === editingMessage ? { ...msg, text: editText, isEdited: true } : msg,
            ),
        );
        setEditingMessage(null);
        setEditText("");
    };

    const handleCancelEdit = () => {
        setEditingMessage(null);
        setEditText("");
    };

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((msg) => msg.messageId !== messageId));
        setContextMenu(null);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className="fixed right-6 bottom-6 z-50 h-[500px] w-96">
                <Card className="flex h-full flex-col border-green-900/20 bg-black/90 backdrop-blur-sm">
                    <CardHeader className="border-b border-green-900/20 pb-3">{/* Заголовок */}</CardHeader>
                    <CardBody className="flex items-center justify-center">
                        <div className="text-gray-400">Загрузка сообщений...</div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed right-6 bottom-6 z-50 h-[500px] w-96">
                <Card className="flex h-full flex-col border-green-900/20 bg-black/90 backdrop-blur-sm">
                    <CardHeader className="border-b border-green-900/20 pb-3">{/* Заголовок */}</CardHeader>
                    <CardBody className="flex items-center justify-center">
                        <div className="text-red-400">{error}</div>
                    </CardBody>
                </Card>
            </div>
        );
    }

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
                                        {`${chatPartner.name} ${chatPartner.surname}`}
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
                        {messages.map((message) => {
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
                                        <Avatar className="h-8 w-8 flex-shrink-0" name={chatPartner.avatar || "?"} />
                                    )}

                                    {/* Сообщение */}
                                    <div className={`max-w-[80%] ${isCurrentUser ? "text-right" : "text-left"}`}>
                                        {editingMessage === message.messageId ? (
                                            <div className="rounded-lg border border-green-500/20 bg-gray-800 p-3">
                                                <Input
                                                    value={editText}
                                                    onChange={(e) => {
                                                        setEditText(e.target.value);
                                                    }}
                                                    className="mb-2 border-green-500/20 bg-transparent"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleSaveEdit();
                                                        else if (e.key === "Escape") handleCancelEdit();
                                                    }}
                                                />
                                                <div className="flex justify-end gap-2">
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
                                                    isCurrentUser
                                                        ? "bg-green-500 text-black"
                                                        : "border border-gray-700 bg-gray-800 text-white"
                                                }`}
                                            >
                                                <div className="text-sm">{message.text}</div>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <div
                                                        className={`text-xs ${
                                                            isCurrentUser ? "text-black/70" : "text-gray-400"
                                                        }`}
                                                    >
                                                        {formatTime(new Date(message.createdAt))}
                                                    </div>
                                                    {message.isEdited && (
                                                        <div
                                                            className={`text-xs ${
                                                                isCurrentUser ? "text-black/70" : "text-gray-400"
                                                            }`}
                                                        >
                                                            изменено
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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
                                onPress={() => void handleSendMessage()}
                                disabled={!newMessage.trim()}
                                className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
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
