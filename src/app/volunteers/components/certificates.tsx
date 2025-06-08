import { format } from "date-fns";
import { ru } from "date-fns/locale";

import React, { useEffect, useState } from "react";

import { getUserById } from "@/api/accounts";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/react";

interface Certificate {
    title: string;
    description: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate: string;
}

interface CertificatesProps {
    volunteerId: string;
}

export function Certificates({ volunteerId }: CertificatesProps) {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCertificates = async () => {
            try {
                const response = await getUserById(volunteerId);
                if (!response.data.result?.value) {
                    throw new Error("Error fetching certificates");
                }

                const certificates =
                    response.data.result.value.volunteerAccount?.certificates.map(
                        (certificates) =>
                            ({
                                title: certificates.title,
                                description: certificates.description,
                                issuingOrganization: certificates.issuingOrganization,
                                issueDate: certificates.issueDate,
                                expirationDate: certificates.expirationDate,
                            }) as unknown as Certificate,
                    ) ?? [];

                setCertificates(certificates);
            } catch (err) {
                setError("Не удалось загрузить сертификаты");
                console.error("Failed to load certificates:", err);
            } finally {
                setIsLoading(false);
            }
        };

        void loadCertificates();
    }, [volunteerId]);

    if (isLoading) {
        return <div className="text-default-500 p-4">Загрузка сертификатов...</div>;
    }

    if (error) {
        return <div className="text-danger p-4">{error}</div>;
    }

    if (certificates.length === 0) {
        return <div className="text-default-500 p-4">Нет доступных сертификатов</div>;
    }

    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Сертификаты</h4>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
                {certificates.map((certificate, index) => {
                    const issueDate = new Date(certificate.issueDate);
                    const expirationDate = new Date(certificate.expirationDate);

                    return (
                        <Card key={index}>
                            <CardBody className="rounded-lg p-4">
                                <div className="font-medium">{certificate.title}</div>
                                <Divider />
                                <div className="text-small">{certificate.description}</div>
                                <div className="text-default-500 text-sm">
                                    {certificate.issuingOrganization} • Выдан:{" "}
                                    {format(issueDate, "LLLL yyyy", { locale: ru })} • Действителен до:{" "}
                                    {format(expirationDate, "LLLL yyyy", { locale: ru })}
                                </div>
                            </CardBody>
                        </Card>
                    );
                })}
            </CardBody>
        </Card>
    );
}
