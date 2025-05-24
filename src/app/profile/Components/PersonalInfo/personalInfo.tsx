import React from "react";

import { PersonalInfoProps } from "@/app/profile/page";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

export function PersonalInfo({ user }: PersonalInfoProps) {
    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Личная информация</h4>
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-sm text-white/60">ФИО</p>
                        <div>
                            {user.patronymic === undefined ? (
                                <h2 className="text-l m-0 font-bold text-white">
                                    {user.secondName + " " + user.firstName}
                                </h2>
                            ) : (
                                <h2 className="text-l m-0 font-bold text-white">
                                    {user.secondName + " " + user.firstName + " " + user.patronymic!}
                                </h2>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-white/60">Имя пользователя</p>
                        <p className="text-medium font-medium text-white">@{user.userName}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-white/60">Электронная почта</p>
                        <div className="flex items-center gap-2">
                            <Icon icon="luicide:mail" className="h-4 w-4 text-white/60" />
                            <p className="text-medium font-medium text-white">{user.email}</p>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
