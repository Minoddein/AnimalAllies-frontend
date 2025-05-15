import { format } from "date-fns";
import { ru } from "date-fns/locale";

import React, { useContext, useEffect, useState } from "react";

import { refresh, updateCertificates } from "@/api/accounts";
import { AddCertificateModal } from "@/app/profile/Components/ProfessionInfo/addCertificatesModal";
import { PersonalInfoProps } from "@/app/profile/page";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

export function Certificates({ user }: PersonalInfoProps) {
    const [certificates, setCertificates] = useState(user.volunteer?.certificates ?? []);
    const updateUserData = useContext(AuthContext)!.updateUserData;

    const onDeleteCertificate = async (index: number) => {
        const updatedCertificates = certificates.filter((_, i) => i !== index);

        try {
            await updateCertificates(updatedCertificates);
            setCertificates(updatedCertificates);
            const response = await refresh();
            if (response.status === 200) {
                updateUserData(response.data.result!);
            }
        } catch (error) {
            console.error("Failed to delete certificate:", error);
        }
    };

    useEffect(() => {
        setCertificates(user.volunteer?.certificates ?? []);
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Сертификаты</h4>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
                <div className="space-y-4">
                    {certificates.map((certificate, index) => {
                        const issueDate = new Date(certificate.issueDate);
                        const expirationDate = new Date(certificate.expirationDate);

                        return (
                            <Card key={index} className="relative">
                                <Button
                                    isIconOnly
                                    size="sm"
                                    color="danger"
                                    variant="light"
                                    className="absolute top-2 right-2 z-10 h-6 w-6 min-w-6"
                                    onPress={() => {
                                        void onDeleteCertificate(index);
                                    }}
                                >
                                    <Icon icon="material-symbols:close" width={16} height={16} />
                                </Button>
                                <CardBody className="rounded-lg p-4">
                                    <div className="pr-6 font-medium">{certificate.title}</div>
                                    <Divider />
                                    <div className="font-small">{certificate.description}</div>
                                    <div className="text-default-500 text-sm">
                                        {certificate.issuingOrganization} • Выдан:{" "}
                                        {format(issueDate, "LLLL yyyy", { locale: ru })} • Действителен до:{" "}
                                        {format(expirationDate, "LLLL yyyy", { locale: ru })}
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
                <div className="w-48">
                    <AddCertificateModal />
                </div>
            </CardBody>
        </Card>
    );
}
