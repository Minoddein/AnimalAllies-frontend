"use client";

import { useEffect, useState } from "react";

import { getDiscussionsByUserId } from "@/api/discussions";
import { getVolunteerRequestsByRelationUser } from "@/api/requests";
import { OpenDiscussion } from "@/app/_components/discussion/discussion";
import { useAuth } from "@/hooks/useAuth";
import { Discussion } from "@/models/discussion";
import { VolunteerRequest } from "@/models/volunteerRequests";
import { Avatar, Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

// Компонент для отображения статуса заявки
const StatusChip = ({ status }: { status: VolunteerRequest["requestStatus"] }) => {
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

export function DiscussionList() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState<Discussion | null>(null);
    const [chats, setChats] = useState<Discussion[]>([]);
    const [requests, setRequests] = useState<VolunteerRequest[]>([]);
    const [, setIsLoading] = useState(false);
    const [, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (isOpen) {
                await loadDiscussions();
            }
        };

        void fetchData();
    }, [isOpen]);

    const formatTime = (date: Date) => {
        const d = new Date(date);
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - d.getTime()) / (1000 * 60 * 60);
        return diffInHours < 24
            ? d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
            : d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
    };

    const loadDiscussions = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const discussionsRes = await getDiscussionsByUserId();
            const discussions = discussionsRes.data.result?.value ?? [];

            const relationIds = discussions.map((d) => d.relationId);
            const allRequestsRes = await getVolunteerRequestsByRelationUser();
            if (!allRequestsRes.data.result) throw new Error("Не удалось получить заявки");

            const allRequests = allRequestsRes.data.result.value!;
            const relatedRequests = allRequests.filter((req) => relationIds.includes(req.id));

            setChats(discussions);
            setRequests(relatedRequests);
        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить чаты");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChatSelect = (chat: Discussion) => {
        setSelectedChat(chat);
    };

    if (!isOpen) {
        return (
            <div className="fixed right-6 bottom-6 z-50">
                <Button
                    onPress={() => {
                        setIsOpen(true);
                    }}
                    className="h-14 w-14 rounded-full bg-green-500 shadow-lg hover:bg-green-600"
                >
                    <Icon icon="lucide:message-circle" className="h-6 w-6" />
                </Button>
            </div>
        );
    }

    return (
        <>
            {selectedChat ? (
                <OpenDiscussion
                    relationId={selectedChat.relationId}
                    chatPartner={{
                        id:
                            selectedChat.firstMember === user?.id
                                ? selectedChat.secondMember
                                : selectedChat.firstMember,
                        name:
                            selectedChat.firstMember === user?.id
                                ? selectedChat.secondMemberName
                                : selectedChat.firstMemberName,
                        surname:
                            selectedChat.firstMember === user?.id
                                ? selectedChat.secondMemberSurname
                                : selectedChat.firstMemberSurname,
                        avatar:
                            selectedChat.firstMember === user?.id
                                ? selectedChat.secondMemberName[0] + (selectedChat.secondMemberSurname[0] || "")
                                : selectedChat.firstMemberName[0] + (selectedChat.firstMemberSurname[0] || ""),
                        status: requests.find((r) => r.id === selectedChat.relationId)?.requestStatus,
                    }}
                    currentUser={{
                        id: user?.id ?? "",
                        name: user?.firstName ?? "",
                        surname: user?.secondName ?? "",
                        avatar: (user?.firstName[0] ?? "") + (user?.secondName[0] ?? ""),
                    }}
                    onBack={() => {
                        setSelectedChat(null);
                        void loadDiscussions();
                    }}
                />
            ) : (
                <div className="fixed right-6 bottom-6 z-50 h-[400px] w-80">
                    <Card className="flex h-full flex-col border-green-900/20 bg-black/90 backdrop-blur-sm">
                        <CardHeader className="gap-8 border-b border-green-900/20 pb-3">
                            <div className="flex items-center justify-between gap-22">
                                <h3 className="text-base font-semibold text-white">Чаты по заявкам</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onPress={() => {
                                        setIsOpen(false);
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-red-500/20"
                                >
                                    <Icon icon="lucide:x" className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardBody className="flex-1 overflow-y-auto p-0">
                            {chats.map((chat) => {
                                const isCurrentUserAdmin = chat.firstMember === user?.id;

                                const partnerData = isCurrentUserAdmin
                                    ? {
                                          id: chat.secondMember,
                                          name: `${chat.secondMemberName} ${chat.secondMemberSurname}`,
                                      }
                                    : {
                                          id: chat.firstMember,
                                          name: `${chat.firstMemberName} ${chat.firstMemberSurname}`,
                                      };

                                // Генерируем инициалы для аватара
                                const avatarInitials = partnerData.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase();

                                const unreadCount = chat.unreadMessagesCount;
                                const relatedRequest = requests.find((req) => req.id === chat.relationId);
                                const status = relatedRequest?.requestStatus ?? "Submitted";

                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() => {
                                            handleChatSelect(chat);
                                        }}
                                        className="cursor-pointer border-b border-gray-800/50 p-3 last:border-b-0 hover:bg-gray-800/30"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="relative">
                                                <Avatar className="h-10 w-10" name={avatarInitials} />
                                                {unreadCount > 0 && (
                                                    <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-black">
                                                        {unreadCount}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center justify-between">
                                                    <h4 className="truncate text-sm font-medium text-white">
                                                        {partnerData.name}
                                                    </h4>
                                                    <span className="text-xs text-gray-400">
                                                        {chat.lastMessage
                                                            ? formatTime(new Date(chat.lastMessageDate))
                                                            : ""}
                                                    </span>
                                                </div>

                                                <div className="mb-1">
                                                    <StatusChip status={status} />
                                                </div>

                                                <p className="truncate text-xs text-gray-400">{chat.lastMessage}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardBody>
                    </Card>
                </div>
            )}
        </>
    );
}
