import React from "react";

import { PersonalInfoProps } from "@/app/profile/page";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button, Divider, Input } from "@heroui/react";
import { Icon } from "@iconify/react";

export function PaymentDetails({ user }: PersonalInfoProps) {
    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Реквизиты</h4>
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="grid gap-4 md:grid-cols-1">
                    {user.volunteer?.requisites.map((requisite, index) => (
                        <div key={index} className="mb-6 flex w-full flex-wrap gap-4 md:mb-0 md:flex-nowrap">
                            <Input label="Название" type="title" defaultValue={requisite.title} />
                            <Input label="Описание" type="description" defaultValue={requisite.description} />
                        </div>
                    ))}
                </div>
                <div className="w-48">
                    <Button color="primary" size="sm" startContent={<Icon icon="ri:add-fill" />} variant="flat">
                        Добавить
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
