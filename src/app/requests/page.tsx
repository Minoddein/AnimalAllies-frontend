"use client";

import { Check, RefreshCw, Search, X } from "lucide-react";

import { useEffect, useState } from "react";

import {
    approveVolunteerRequest,
    getVolunteerRequests,
    getVolunteerRequestsByAdminId,
    getVolunteerRequestsByUserId,
    rejectRequest,
    resendVolunteerRequest,
    sendForRevision,
    takeForASubmit,
    updateVolunteerRequest,
} from "@/api/requests";
import { useAuth } from "@/hooks/useAuth";
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

import { DiscussionList } from "../_components/discussion/discussionList";

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
    const { user } = useAuth();
    const isAdmin = user?.roles.includes("Admin");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [requestTypeFilter, setRequestTypeFilter] = useState<"all" | "my">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<VolunteerRequest | null>(null);
    const [commentText, setCommentText] = useState("");
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
    const [commentAction, setCommentAction] = useState<"reject" | "revision">("reject");
    const [pagedData, setPagedData] = useState<{ items: VolunteerRequest[]; totalCount: number }>({
        items: [],
        totalCount: 0,
    });
    const [, setIsLoading] = useState(false);
    const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
    const [editedRequest, setEditedRequest] = useState<VolunteerRequest | null>(null);
    const [editedDescription, setEditedDescription] = useState("");
    const [editedExperience, setEditedExperience] = useState("");
    const itemsPerPage = 4;

    const fetchRequests = async (page: number) => {
        setIsLoading(true);
        try {
            let response;
            if (isAdmin) {
                response =
                    requestTypeFilter === "all"
                        ? await getVolunteerRequests(
                              page,
                              itemsPerPage,
                              statusFilter === "all" ? undefined : statusFilter,
                          )
                        : await getVolunteerRequestsByAdminId(
                              page,
                              itemsPerPage,
                              statusFilter === "all" ? undefined : statusFilter,
                          );
            } else {
                response = await getVolunteerRequestsByUserId(
                    page,
                    itemsPerPage,
                    statusFilter === "all" ? undefined : statusFilter,
                );
                setRequestTypeFilter("my");
            }

            const validatedRequests =
                response.data.result?.value?.items.map((item) => ({
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
                })) ?? [];

            setPagedData({
                items: validatedRequests,
                totalCount: response.data.result?.value?.totalCount ?? 0,
            });
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(pagedData.totalCount / itemsPerPage);

    useEffect(() => {
        void fetchRequests(currentPage);
    }, [currentPage, statusFilter, itemsPerPage, requestTypeFilter]);

    const refreshAfterAction = async () => {
        if (pagedData.items.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1); // это вызовет useEffect -> fetchRequests(newPage)
        } else {
            await fetchRequests(currentPage);
        }
    };

    const handleApprove = async (request: VolunteerRequest) => {
        await approveVolunteerRequest(request.id);
        await refreshAfterAction();
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

        if (commentAction === "reject") {
            await rejectRequest(selectedRequest.id, commentText);
        } else {
            await sendForRevision(selectedRequest.id, commentText);
        }

        setIsCommentDialogOpen(false);
        await refreshAfterAction();
    };

    const handleTakeForASubmit = async (id: string) => {
        await takeForASubmit(id);
        await refreshAfterAction();
    };

    const handleEditRequest = (request: VolunteerRequest) => {
        setEditedRequest(request);
        setEditedDescription(request.volunteerDescription);
        setEditedExperience(request.workExperience);
        setIsEditModalOpen(true);
    };

    const handleSaveEdits = async () => {
        if (!editedRequest) return;

        try {
            setIsLoading(true);
            await updateVolunteerRequest(editedRequest.id, {
                volunteerDescription: editedDescription,
                workExperience: parseInt(editedExperience),
            });
            await refreshAfterAction();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Failed to save edits:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResubmitRequest = (request: VolunteerRequest) => {
        setSelectedRequest(request);
        setIsResubmitModalOpen(true);
    };

    const submitRevisedRequest = async () => {
        if (!selectedRequest) return;

        try {
            setIsLoading(true);
            await resendVolunteerRequest(selectedRequest.id);
            await refreshAfterAction();
            setIsResubmitModalOpen(false);
        } catch (error) {
            console.error("Failed to resubmit request:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
                {isAdmin ? (
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
                ) : null}

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
                                    <div
                                        className="relative max-h-[4.5rem] cursor-pointer overflow-hidden text-sm hover:underline"
                                        onClick={() => {
                                            setSelectedDescription(request.volunteerDescription);
                                            setDescriptionModalOpen(true);
                                        }}
                                    >
                                        {request.volunteerDescription}
                                        {request.volunteerDescription.length > 200 && (
                                            <span className="absolute right-0 bottom-0 bg-gradient-to-t from-gray-900 to-transparent px-2 text-xs text-blue-400">
                                                Читать полностью
                                            </span>
                                        )}
                                    </div>
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
                                    {isAdmin ? (
                                        <div>
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
                                                    <div className="flex flex-row justify-between gap-2">
                                                        <Button
                                                            variant="flat"
                                                            className="border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                            onPress={() => {
                                                                void handleApprove(request);
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
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        request.requestStatus === "RevisionRequired" && (
                                            <>
                                                <div className="flex w-full flex-wrap justify-end gap-2">
                                                    <Button
                                                        variant="flat"
                                                        className="border-yellow-500/20 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-400"
                                                        onPress={() => {
                                                            handleEditRequest(request);
                                                        }}
                                                    >
                                                        Редактировать
                                                    </Button>
                                                    <Button
                                                        variant="flat"
                                                        className="border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                                        onPress={() => {
                                                            handleResubmitRequest(request);
                                                        }}
                                                    >
                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                        Отправить на пересмотр
                                                    </Button>
                                                </div>
                                            </>
                                        )
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
            {pagedData.items.length > 0 && (
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
            <Modal
                isOpen={descriptionModalOpen}
                onClose={() => {
                    setDescriptionModalOpen(false);
                }}
                size="lg"
            >
                <ModalContent>
                    <ModalHeader className="text-lg font-semibold">Полное описание</ModalHeader>
                    <ModalBody className="max-h-[400px] overflow-y-auto">
                        <div className="text-sm whitespace-pre-wrap">{selectedDescription}</div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onPress={() => {
                                setDescriptionModalOpen(false);
                            }}
                        >
                            Закрыть
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                }}
                size="lg"
            >
                <ModalContent>
                    <ModalHeader className="text-lg font-semibold">Редактирование заявки</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <div>
                                <label className="text-muted-foreground mb-1 block text-sm">О себе:</label>
                                <Textarea
                                    value={editedDescription}
                                    onChange={(e) => {
                                        setEditedDescription(e.target.value);
                                    }}
                                    className="min-h-[100px] w-full"
                                />
                            </div>
                            <div>
                                <label className="text-muted-foreground mb-1 block text-sm">Опыт работы:</label>
                                <Textarea
                                    value={editedExperience}
                                    onChange={(e) => {
                                        setEditedExperience(e.target.value);
                                    }}
                                    className="min-h-[60px] w-full"
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="flat"
                            onPress={() => {
                                setIsEditModalOpen(false);
                            }}
                            className="mr-2"
                        >
                            Отмена
                        </Button>
                        <Button
                            onPress={() => {
                                void handleSaveEdits();
                            }}
                            color="primary"
                        >
                            Сохранить изменения
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Модалка подтверждения отправки */}
            <Modal
                isOpen={isResubmitModalOpen}
                onClose={() => {
                    setIsResubmitModalOpen(false);
                }}
                size="md"
            >
                <ModalContent>
                    <ModalHeader className="text-lg font-semibold">Отправить на пересмотр</ModalHeader>
                    <ModalBody>
                        <p>Вы уверены, что хотите отправить заявку на повторное рассмотрение?</p>
                        {selectedRequest?.rejectionComment && (
                            <div className="mt-3 rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                                <p className="text-sm font-medium">Комментарий администратора:</p>
                                <p className="text-sm">{selectedRequest.rejectionComment}</p>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="flat"
                            onPress={() => {
                                setIsResubmitModalOpen(false);
                            }}
                            className="mr-2"
                        >
                            Отмена
                        </Button>
                        <Button
                            onPress={() => {
                                void submitRevisedRequest();
                            }}
                            color="primary"
                        >
                            Отправить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <DiscussionList />
        </div>
    );
}
