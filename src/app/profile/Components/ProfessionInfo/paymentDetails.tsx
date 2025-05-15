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
    const updateUserData = useContext(AuthContext)!.updateUserData;

    const onDeleteRequisite = async (index: number) => {
        const updatedRequisites = requisites.filter((_, i) => i !== index);

        try {
            await updateRequisites(updatedRequisites);
            setRequisites(updatedRequisites);
            const response = await refresh();
            if (response.status === 200) {
                updateUserData(response.data.result!);
            }
        } catch (error) {
            console.error("Failed to delete requisite:", error);
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
                <div className="grid gap-4 md:grid-cols-1">
                    {requisites.map((requisite, index) => (
                        <div
                            key={`${index}_${requisite.title}`}
                            className="group relative mb-6 flex w-full flex-wrap gap-4 md:mb-0 md:flex-nowrap"
                        >
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                className="absolute -top-2 -right-2 z-10 h-6 w-6 min-w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                onPress={() => {
                                    void onDeleteRequisite(index);
                                }}
                            >
                                <Icon icon="material-symbols:close" width={16} height={16} />
                            </Button>

                            <Input label="Название" type="title" defaultValue={requisite.title} readOnly />
                            <Input label="Описание" type="description" defaultValue={requisite.description} readOnly />
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
