"use client";

import React, { useContext, useState } from "react";

import { refresh, updateRequisites } from "@/api/accounts";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

export function AddRequisitesModal() {
    const user = useContext(AuthContext)!.user!;
    const updateUserData = useContext(AuthContext)!.updateUserData;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [requisite, setRequisite] = useState({
        title: "",
        description: "",
    });

    const handleInputChange = (field: keyof typeof requisite) => (value: string) => {
        setRequisite((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const onAddRequisite = async (onClose: () => void) => {
        try {
            const updatedRequisites = [...(user.volunteer?.requisites ?? []), requisite];

            await updateRequisites(updatedRequisites);
            const response = await refresh();
            if (response.status === 200) {
                updateUserData(response.data.result!);
            }

            onClose();
            setRequisite({ title: "", description: "" }); // Сброс формы
        } catch (error) {
            console.error("Failed to add requisite:", error);
        }
    };

    return (
        <>
            <Button
                color="primary"
                size="sm"
                startContent={<Icon icon="ri:add-fill" />}
                variant="flat"
                onPress={onOpen}
                className="w-48"
            >
                Добавить
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Добавление реквизитов</ModalHeader>
                            <ModalBody className="space-y-4">
                                <Input
                                    label="Название"
                                    type="text"
                                    variant="bordered"
                                    value={requisite.title}
                                    onChange={(e) => {
                                        handleInputChange("title")(e.target.value);
                                    }}
                                />

                                <Input
                                    label="Описание"
                                    type="text"
                                    variant="bordered"
                                    value={requisite.description}
                                    onChange={(e) => {
                                        handleInputChange("description")(e.target.value);
                                    }}
                                />
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Закрыть
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => {
                                        void onAddRequisite(onClose);
                                    }}
                                    isDisabled={!requisite.title || !requisite.description}
                                >
                                    Сохранить
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
