import React from "react";

import { PersonalInfoProps } from "@/app/profile/page";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";

export function EditProfileModal({ user }: PersonalInfoProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                                <Input label="Имя" type="text" variant="bordered" />
                                <Input label="Фамилия" type="text" variant="bordered" />
                                <Input label="Отчество" type="text" variant="bordered" />
                                <Input label="Адрес" type="text" variant="bordered" />
                                {user.volunteer ? (
                                    <Input label="Номер телефона" type="text" variant="bordered" />
                                ) : null}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Закрыть
                                </Button>
                                <Button color="primary" onPress={onClose}>
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
