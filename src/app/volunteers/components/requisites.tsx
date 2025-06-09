"use client";

import React, { useEffect, useState } from "react";

import { getUserById } from "@/api/accounts";
import { Requisite } from "@/models/requisite";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/react";

interface PaymentDetailsProps {
    volunteerId: string;
}

export function PaymentDetails({ volunteerId }: PaymentDetailsProps) {
    const [requisites, setRequisites] = useState<Requisite[]>([]);

    async function fetchRequisites() {
        try {
            const response = await getUserById(volunteerId);
            if (!response.data.result?.value) {
                throw new Error("Error fetching certificates");
            }

            setRequisites(response.data.result.value.volunteerAccount?.requisites ?? []);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        void fetchRequisites();
    }, [volunteerId]);

    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Реквизиты</h4>
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="flex flex-col gap-4">
                    {requisites.length === 0 ? (
                        <p className="text-default-500">Нет добавленных реквизитов</p>
                    ) : (
                        requisites.map((requisite, index) => (
                            <div key={`${index}_${requisite.title}`} className="flex flex-col gap-1">
                                <p className="text-medium font-medium">{requisite.title}</p>
                                <p className="text-small text-default-500">{requisite.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
