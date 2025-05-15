"use client";

import React, { useContext, useEffect, useState } from "react";

import { refresh, updateRequisites } from "@/api/accounts";
import { AddRequisitesModal } from "@/app/profile/Components/ProfessionInfo/addRequisitesModal";
import { PersonalInfoProps } from "@/app/profile/page";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button, Divider, Input } from "@heroui/react";
import { Icon } from "@iconify/react";

export function PaymentDetails({ user }: PersonalInfoProps) {
    const [requisites, setRequisites] = useState(user.volunteer?.requisites ?? []);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ title: "", description: "" });
    const updateUserData = useContext(AuthContext)!.updateUserData;

    const onDeleteRequisite = async (index: number) => {
        const updatedRequisites = requisites.filter((_, i) => i !== index);
        await updateAndRefresh(updatedRequisites);
    };

    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditForm({
            title: requisites[index].title,
            description: requisites[index].description,
        });
    };

    const cancelEditing = () => {
        setEditingIndex(null);
    };

    const handleEditChange = (field: keyof typeof editForm) => (value: string) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const saveEditing = async () => {
        if (editingIndex === null) return;

        const updatedRequisites = [...requisites];
        updatedRequisites[editingIndex] = {
            ...updatedRequisites[editingIndex],
            ...editForm,
        };

        await updateAndRefresh(updatedRequisites);
        setEditingIndex(null);
    };

    const updateAndRefresh = async (updatedRequisites: typeof requisites) => {
        try {
            await updateRequisites(updatedRequisites);
            setRequisites(updatedRequisites);
            const response = await refresh();
            if (response.status === 200) {
                updateUserData(response.data.result!);
            }
        } catch (error) {
            console.error("Failed to update requisites:", error);
        }
    };

    useEffect(() => {
        setRequisites(user.volunteer?.requisites ?? []);
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Реквизиты</h4>
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="flex flex-col gap-4">
                    {requisites.map((requisite, index) => (
                        <div key={`${index}_${requisite.title}`} className="relative">
                            <div className="absolute top-0 right-0 flex gap-1">
                                {editingIndex === index ? (
                                    <>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            color="success"
                                            variant="light"
                                            className="h-6 w-6 min-w-6"
                                            onPress={() => {
                                                void saveEditing();
                                            }}
                                        >
                                            <Icon icon="material-symbols:check" width={16} height={16} />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            color="danger"
                                            variant="light"
                                            className="h-6 w-6 min-w-6"
                                            onPress={cancelEditing}
                                        >
                                            <Icon icon="material-symbols:close" width={16} height={16} />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            color="primary"
                                            variant="light"
                                            className="h-6 w-6 min-w-6"
                                            onPress={() => {
                                                startEditing(index);
                                            }}
                                        >
                                            <Icon icon="material-symbols:edit" width={16} height={16} />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            color="danger"
                                            variant="light"
                                            className="h-6 w-6 min-w-6"
                                            onPress={() => void onDeleteRequisite(index)}
                                        >
                                            <Icon icon="material-symbols:close" width={16} height={16} />
                                        </Button>
                                    </>
                                )}
                            </div>

                            {editingIndex === index ? (
                                <div className="flex flex-col gap-3 pt-6">
                                    <Input
                                        label="Название"
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => {
                                            handleEditChange("title")(e.target.value);
                                        }}
                                        size="sm"
                                    />
                                    <Input
                                        label="Описание"
                                        type="text"
                                        value={editForm.description}
                                        onChange={(e) => {
                                            handleEditChange("description")(e.target.value);
                                        }}
                                        size="sm"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1 pt-6">
                                    <p className="text-medium font-medium">{requisite.title}</p>
                                    <p className="text-small text-default-500">{requisite.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="w-48">
                    <AddRequisitesModal />
                </div>
            </CardBody>
        </Card>
    );
}
