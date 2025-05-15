import React, { useContext, useState } from "react";

import { refresh, updateSocialNetworks } from "@/api/accounts";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

export function AddSocialNetworkModal() {
    const user = useContext(AuthContext)!.user!;
    const updateUserData = useContext(AuthContext)!.updateUserData;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [socialNetwork, setSocialNetwork] = useState({
        title: "",
        url: "",
    });

    const onAddSocialMedia = async () => {
        try {
            const updatedNetworks = [...user.socialNetworks, socialNetwork];

            await updateSocialNetworks(updatedNetworks);
            const response = await refresh();
            if (response.status === 200) {
                updateUserData(response.data.result!);
            }

            onOpenChange();
        } catch (error) {
            console.error("Failed to add social network:", error);
        }
    };

    const handleInputChange = (field: keyof typeof socialNetwork) => (value: string) => {
        setSocialNetwork((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <>
            <Button
                color="primary"
                size="sm"
                startContent={<Icon icon="ri:add-fill" />}
                variant="flat"
                onPress={onOpen}
            >
                Добавить
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Добавление социальной сети</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Название"
                                    type="text"
                                    variant="bordered"
                                    value={socialNetwork.title}
                                    onChange={(e) => {
                                        handleInputChange("title")(e.target.value);
                                    }}
                                />
                                <Input
                                    label="Ссылка"
                                    type="text"
                                    variant="bordered"
                                    value={socialNetwork.url}
                                    onChange={(e) => {
                                        handleInputChange("url")(e.target.value);
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
                                        void onAddSocialMedia();
                                    }}
                                    isDisabled={!socialNetwork.title || !socialNetwork.url}
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
