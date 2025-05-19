import React, { useContext, useState } from "react";

import { refresh, updateProfile } from "@/api/accounts";
import { PersonalInfoProps } from "@/app/profile/page";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { UpdateProfileProps } from "@/models/requests/UpdateProfileProps";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";

export function EditProfileModal({ user }: PersonalInfoProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const updateUserData = useContext(AuthContext)!.updateUserData;
    const [formData, setFormData] = useState({
        firstName: user.firstName || "",
        secondName: user.secondName || "",
        patronymic: user.patronymic ?? undefined,
        phone: user.volunteer?.phone ?? undefined,
        experience: user.volunteer?.experience ?? undefined,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (onClose: () => void) => {
        try {
            const data: UpdateProfileProps = {
                firstName: formData.firstName,
                secondName: formData.secondName,
                patronymic: formData.patronymic,
                phone: formData.phone,
                experience: formData.experience,
            };

            const responseUpdateProfile = await updateProfile(data);
            if (responseUpdateProfile.status === 200) {
                const response = await refresh();
                updateUserData(response.data.result!);
            }
            onClose();
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <>
            <Button color="primary" onPress={onOpen} variant="solid" className="h-[30px]" radius={"sm"}>
                Редактировать
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Редактирование</ModalHeader>
                            <ModalBody>
                                <Input
                                    name="firstName"
                                    label="Имя"
                                    type="text"
                                    variant="bordered"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="secondName"
                                    label="Фамилия"
                                    type="text"
                                    variant="bordered"
                                    value={formData.secondName}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="patronymic"
                                    label="Отчество"
                                    type="text"
                                    variant="bordered"
                                    value={formData.patronymic}
                                    onChange={handleInputChange}
                                />
                                {user.volunteer && (
                                    <div className="flex flex-col gap-3">
                                        <Input
                                            name="phone"
                                            label="Номер телефона"
                                            type="text"
                                            variant="bordered"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                        <Input
                                            name="experience"
                                            label="Опыт работы"
                                            variant="bordered"
                                            type="number"
                                            value={formData.experience?.toString()}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Закрыть
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => {
                                        void handleSubmit(onClose);
                                    }}
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
