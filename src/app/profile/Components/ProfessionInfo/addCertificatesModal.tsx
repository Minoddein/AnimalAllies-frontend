"use client";

import React, { useContext, useState } from "react";

import { refresh, updateCertificates } from "@/api/accounts";
import { AuthContext } from "@/contexts/auth/AuthContext";
import {
    Button,
    DateInput,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";

export function AddCertificateModal() {
    const user = useContext(AuthContext)!.user!;
    const updateUserData = useContext(AuthContext)!.updateUserData;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [certificate, setCertificate] = useState({
        title: "",
        description: "",
        issuingOrganization: "",
        issueDate: parseDate(new Date().toISOString().split("T")[0]),
        expirationDate: parseDate(
            new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
        ),
    });

    const handleInputChange = (field: keyof typeof certificate) => (value: string) => {
        setCertificate((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDateChange = (field: "issueDate" | "expirationDate") => (date: DateValue) => {
        setCertificate((prev) => ({
            ...prev,
            [field]: date,
        }));
    };

    const onAddCertificate = async (onClose: () => void) => {
        try {
            const newCertificate = {
                title: certificate.title,
                description: certificate.description,
                issuingOrganization: certificate.issuingOrganization,
                issueDate: certificate.issueDate.toString(),
                expirationDate: certificate.expirationDate.toString(),
            };

            const currentCertificates = user.volunteer?.certificates ? [...user.volunteer.certificates] : [];
            const updatedCertificates = [...currentCertificates, newCertificate];

            await updateCertificates(updatedCertificates);
            const response = await refresh();
            if (response.status === 200) {
                updateUserData(response.data.result!);
            }

            onClose();
        } catch (error) {
            console.error("Failed to add certificate:", error);
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
                Добавить сертификат
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Добавление сертификата</ModalHeader>
                            <ModalBody className="space-y-4">
                                <Input
                                    label="Название сертификата"
                                    type="text"
                                    variant="bordered"
                                    value={certificate.title}
                                    onChange={(e) => {
                                        handleInputChange("title")(e.target.value);
                                    }}
                                />

                                <Input
                                    label="Организация, выдавшая сертификат"
                                    type="text"
                                    variant="bordered"
                                    value={certificate.issuingOrganization}
                                    onChange={(e) => {
                                        handleInputChange("issuingOrganization")(e.target.value);
                                    }}
                                />

                                <Input
                                    label="Описание"
                                    type="text"
                                    variant="bordered"
                                    value={certificate.description}
                                    onChange={(e) => {
                                        handleInputChange("description")(e.target.value);
                                    }}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <DateInput
                                        label="Дата выдачи"
                                        variant="bordered"
                                        value={certificate.issueDate}
                                        onChange={void handleDateChange("issueDate")}
                                        //locale={ru}
                                    />

                                    <DateInput
                                        label="Действителен до"
                                        variant="bordered"
                                        value={certificate.expirationDate}
                                        onChange={void handleDateChange("expirationDate")}
                                        //locale={ru}
                                    />
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Закрыть
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => {
                                        void onAddCertificate(onClose);
                                    }}
                                    isDisabled={!certificate.title || !certificate.issuingOrganization}
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
