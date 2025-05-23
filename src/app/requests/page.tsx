"use client";

import { Check, RefreshCw, Search, X } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { getVolunteerRequests, getVolunteerRequestsByAdminId, rejectRequest, takeForASubmit } from "@/api/requests";
import { VolunteerRequest } from "@/models/volunteerRequests";
import { Chip } from "@heroui/chip";
import { Textarea } from "@heroui/input";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Select,
    SelectItem,
} from "@heroui/react";

const RequestStatusBadge = ({ status }: { status: VolunteerRequest["requestStatus"] }) => {
    switch (status) {
        case "Waiting":
            return (
                <Chip variant="flat" className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500">
                    Ожидает
                </Chip>
            );
        case "Submitted":
            return (
                <Chip variant="flat" className="border-blue-500/20 bg-blue-500/10 text-blue-500">
                    На рассмотрении
                </Chip>
            );
        case "Approved":
            return (
                <Chip variant="flat" className="border-green-500/20 bg-green-500/10 text-green-500">
                    Одобрено
                </Chip>
            );
        case "Rejected":
            return (
                <Chip variant="flat" className="border-red-500/20 bg-red-500/10 text-red-500">
                    Отклонено
                </Chip>
            );
        case "RevisionRequired":
            return (
                <Chip variant="flat" className="border-orange-500/20 bg-orange-500/10 text-orange-500">
                    Требует доработки
                </Chip>
            );
        default:
            return null;
    }
};

export default function VolunteerRequestsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [requestTypeFilter, setRequestTypeFilter] = useState<"all" | "my">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<VolunteerRequest | null>(null);
    const [commentText, setCommentText] = useState("");
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
    const [commentAction, setCommentAction] = useState<"reject" | "revision">("reject");
    const [requests, setRequests] = useState<VolunteerRequest[]>([]);
    const [pagedData, setPagedData] = useState<{
        items: VolunteerRequest[];
        totalCount: number;
    }>({ items: [], totalCount: 0 });
    const [totalCount, setTotalCount] = useState(0);
    const [, setIsLoading] = useState(false);
    const itemsPerPage = 4;

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            let response;

            if (requestTypeFilter === "all") {
                // Запрос для всех ожидающих заявок
                response = await getVolunteerRequests(
                    currentPage,
                    itemsPerPage,
                    statusFilter === "all" ? undefined : statusFilter,
                );
            } else {
                // Запрос для заявок текущего админа
                response = await getVolunteerRequestsByAdminId(
                    currentPage,
                    itemsPerPage,
                    statusFilter === "all" ? undefined : statusFilter,
                );
            }

            if (!response.data.result?.value) {
                console.error("No data received");
                return;
            }

            const validatedRequests = response.data.result.value.items.map((item) => ({
                ...item,
                volunteerInfo: {
                    firstName: item.firstName || "",
                    secondName: item.secondName || "",
                    patronymic: item.patronymic || "",
                    email: item.email || "",
                    phoneNumber: item.phoneNumber || "",
                    volunteerDescription: item.volunteerDescription || "",
                    workExperience: item.workExperience || "",
                },
            }));

            setRequests(validatedRequests);
            setPagedData({
                items: validatedRequests,
                totalCount: response.data.result.value.totalCount,
            });
            setTotalCount(response.data.result.value.totalCount);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, statusFilter, itemsPerPage, requestTypeFilter]);
    requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    useEffect(() => {
        void fetchRequests();
    }, [fetchRequests, currentPage, itemsPerPage, statusFilter]);

    const handleApprove = (request: VolunteerRequest) => {
        console.log("Approve request:", request.id);
    };

    const handleReject = (request: VolunteerRequest) => {
        setSelectedRequest(request);
        setCommentAction("reject");
        setCommentText("");
        setIsCommentDialogOpen(true);
    };

    const handleRevision = (request: VolunteerRequest) => {
        setSelectedRequest(request);
        setCommentAction("revision");
        setCommentText("");
        setIsCommentDialogOpen(true);
    };

    const submitComment = async () => {
        if (!selectedRequest || !commentText.trim()) return;

        console.log(
            commentAction === "reject" ? "Reject request:" : "Request revision:",
            selectedRequest.id,
            "Comment:",
            commentText,
        );

        if (commentAction === "reject") {
            await rejectRequest(selectedRequest.id, commentText);
        } else {
            // Логика для отправки на доработку
            console.log("Request revision:", selectedRequest.id, "Comment:", commentText);
        }

        setIsCommentDialogOpen(false);
    };

    async function handleTakeForASubmit(id: string) {
        await takeForASubmit(id);
    }

    return (
        <div className="container mx-auto max-w-7xl py-8">
            <h1 className="mb-8 text-3xl font-bold">Заявки на волонтёрство</h1>

            {/* Фильтры и поиск */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                        placeholder="Поиск по имени или email"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                        }}
                        className="pl-10"
                    />
                </div>

                {/* Фильтр по типу заявок */}
                <Select
                    placeholder="Тип заявок"
                    selectedKeys={[requestTypeFilter]}
                    onSelectionChange={(keys) => {
                        const newFilter = Array.from(keys)[0] as "all" | "my";
                        setRequestTypeFilter(newFilter);
                        setStatusFilter(newFilter === "all" ? "Waiting" : "all");
                        setCurrentPage(1);
                    }}
                    className="w-full md:w-[200px]"
                >
                    <SelectItem key="all">Все заявки</SelectItem>
                    <SelectItem key="my">Мои заявки</SelectItem>
                </Select>

                {/* Фильтр по статусу */}
                <Select
                    placeholder="Статус"
                    selectedKeys={[statusFilter]}
                    onSelectionChange={(keys) => {
                        setStatusFilter(Array.from(keys)[0] as string);
                        setCurrentPage(1);
                    }}
                    className="w-full md:w-[200px]"
                >
                    {requestTypeFilter === "all" ? (
                        <SelectItem key="Waiting">Ожидают рассмотрения</SelectItem>
                    ) : (
                        <>
                            <SelectItem key="all">Все статусы</SelectItem>
                            <SelectItem key="Submitted">На рассмотрении</SelectItem>
                            <SelectItem key="Approved">Одобрено</SelectItem>
                            <SelectItem key="Rejected">Отклонено</SelectItem>
                            <SelectItem key="RevisionRequired">Требует доработки</SelectItem>
                        </>
                    )}
                </Select>
            </div>

            {/* Список заявок */}
            <div className="grid gap-4">
                {pagedData.items.length > 0 ? (
                    pagedData.items.map((request) => (
                        <Card
                            shadow="md"
                            key={request.id}
                            className="border border-emerald-400 bg-gray-900 dark:border-emerald-500 dark:bg-black"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        {" "}
                                        {/* Добавлено flex-1 и min-w-0 */}
                                        <div className="truncate text-xl">
                                            {" "}
                                            {/* Добавлен truncate для длинных имен */}
                                            {request.secondName} {request.firstName} {request.patronymic}
                                        </div>
                                        <div className="text-muted-foreground mt-1 text-sm">
                                            {new Date(request.createdAt).toLocaleDateString("ru-RU", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        {" "}
                                        <RequestStatusBadge status={request.requestStatus} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody className="pb-2">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <div className="text-muted-foreground mb-1 text-sm">Контактная информация:</div>
                                        <div className="mb-1 text-sm">Email: {request.email}</div>
                                        <div className="text-sm">Телефон: {request.phoneNumber}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground mb-1 text-sm">Опыт работы:</div>
                                        <div className="text-sm">{request.workExperience}</div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-muted-foreground mb-1 text-sm">О себе:</div>
                                    <div className="text-sm">{request.volunteerDescription}</div>
                                </div>
                                {(request.requestStatus === "Rejected" ||
                                    request.requestStatus === "RevisionRequired") &&
                                    request.rejectionComment && (
                                        <div className="mt-4 rounded-md border border-red-500/20 bg-red-500/10 p-3">
                                            <div className="text-muted-foreground mb-1 text-sm">
                                                Комментарий администратора:
                                            </div>
                                            <div className="text-sm">{request.rejectionComment}</div>
                                        </div>
                                    )}
                            </CardBody>
                            <CardFooter className="pt-2">
                                <div className="flex w-full flex-wrap justify-end gap-2">
                                    {request.requestStatus === "Waiting" && (
                                        <Button
                                            variant="flat"
                                            className="border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                            onPress={() => {
                                                void handleTakeForASubmit(request.id);
                                            }}
                                        >
                                            Взять в работу
                                        </Button>
                                    )}
                                    {request.requestStatus === "Submitted" && (
                                        <>
                                            <Button
                                                variant="flat"
                                                className="border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                onPress={() => {
                                                    handleApprove(request);
                                                }}
                                            >
                                                <Check className="mr-2 h-4 w-4" />
                                                Одобрить
                                            </Button>
                                            <Button
                                                variant="flat"
                                                className="border-orange-500/20 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                                                onPress={() => {
                                                    handleRevision(request);
                                                }}
                                            >
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                На доработку
                                            </Button>
                                            <Button
                                                variant="flat"
                                                className="border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                                onPress={() => {
                                                    handleReject(request);
                                                }}
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Отклонить
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="text-muted-foreground py-8 text-center">Заявки не найдены</div>
                )}
            </div>

            {/* Пагинация */}
            {requests.length > 0 && (
                <Pagination
                    className="mt-6 flex justify-center"
                    initialPage={currentPage}
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

            {/* Диалог для комментария */}
            <Modal
                isOpen={isCommentDialogOpen}
                onClose={() => {
                    setIsCommentDialogOpen(false);
                }}
                size="md"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col">
                        <h3 className="text-lg font-semibold">
                            {commentAction === "reject" ? "Отклонить заявку" : "Отправить на доработку"}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Пожалуйста, укажите причину {commentAction === "reject" ? "отклонения" : "доработки"}{" "}
                            заявки.
                        </p>
                    </ModalHeader>

                    <ModalBody>
                        <Textarea
                            placeholder="Введите комментарий..."
                            value={commentText}
                            onChange={(e) => {
                                setCommentText(e.target.value);
                            }}
                            className="min-h-[100px] w-full"
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="flat"
                            onPress={() => {
                                setIsCommentDialogOpen(false);
                            }}
                            className="mr-2"
                        >
                            Отмена
                        </Button>
                        <Button
                            onPress={() => {
                                void submitComment();
                            }}
                            color={commentAction === "reject" ? "danger" : "warning"}
                        >
                            {commentAction === "reject" ? "Отклонить" : "Отправить на доработку"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
