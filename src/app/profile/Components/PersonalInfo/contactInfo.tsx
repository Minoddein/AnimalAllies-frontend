import React from "react";

import { PersonalInfoProps } from "@/app/profile/page";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

export function ContactInfo({ user }: PersonalInfoProps) {
    return (
        <Card className="pt-3">
            <CardHeader>
                <h4 className="text-large font-medium text-white">Контактная информация</h4>
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-white/60">Номер телефона</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="luicide:phone" className="text-muted-foreground h-4 w-4" />
                        <p className="text-medium font-medium text-white">{user.firstName}</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
