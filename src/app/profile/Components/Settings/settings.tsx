import { AxiosResponse } from "axios";

import React, { useLayoutEffect, useState } from "react";

import { getNotificationSettings, setNotificationSettings } from "@/api/accounts";
import { PersonalInfoProps } from "@/app/profile/page";
import { SetNotificationSettingsProps } from "@/models/requests/SetNotificationSettingsProps";
import { Card, CardBody } from "@heroui/card";
import { Divider, Switch } from "@heroui/react";

export function Settings({ user }: PersonalInfoProps) {
    const [isEmailNotification, setEmailNotification] = useState(false);
    const [isTelegramNotification, setTelegramNotification] = useState(false);
    const [isWebNotification, setWebNotification] = useState(false);

    useLayoutEffect(() => {
        void (async () => {
            const response: AxiosResponse<{
                id: string;
                userId: string;
                emailNotifications: boolean;
                telegramNotifications: boolean;
                webNotifications: boolean;
            }> = await getNotificationSettings(user.id);

            console.log(response);

            setEmailNotification(response.data.emailNotifications);
            setTelegramNotification(response.data.telegramNotifications);
            setWebNotification(response.data.webNotifications);
        })();
    }, [user.id]);

    function onTelegramNotificationChange() {
        const newTelegramNotification = !isTelegramNotification;
        setTelegramNotification(newTelegramNotification);
        console.log(newTelegramNotification);

        void (async () => {
            const data: SetNotificationSettingsProps = {
                emailNotifications: isEmailNotification,
                telegramNotifications: newTelegramNotification,
                webNotifications: isWebNotification,
            };
            const response = await setNotificationSettings(data);
            if (response.data.result === null) console.log(response.data.errors);
        })();
    }

    function onWebNotificationChange() {
        const newWebNotification = !isWebNotification;
        setWebNotification(newWebNotification);
        console.log(newWebNotification);

        void (async () => {
            const data: SetNotificationSettingsProps = {
                emailNotifications: isEmailNotification,
                telegramNotifications: isTelegramNotification,
                webNotifications: newWebNotification,
            };
            const response = await setNotificationSettings(data);
            if (response.data.result === null) console.log(response.data.errors);
        })();
    }

    function onEmailNotificationChange() {
        const newEmailNotification = !isEmailNotification;
        setEmailNotification(newEmailNotification);
        console.log(newEmailNotification);

        void (async () => {
            const data = {
                emailNotifications: newEmailNotification,
                telegramNotifications: isTelegramNotification,
                webNotifications: isWebNotification,
            };
            const response = await setNotificationSettings(data);
            if (response.data.result === null) console.log(response.data.errors);
        })();
    }

    return (
        <Card>
            <CardBody className="space-y-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <h4 className="text-large font-medium text-white">Уведомления на почту</h4>
                        </div>
                        <Switch
                            id="email-notification"
                            onChange={onEmailNotificationChange}
                            isSelected={isEmailNotification}
                        />
                    </div>
                    <Divider />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="space-y-0.5">
                                <h4 className="text-large font-medium text-white">Уведомления на telegram</h4>
                            </div>
                        </div>
                        <Switch
                            id="telegram-notification"
                            onChange={onTelegramNotificationChange}
                            isSelected={isTelegramNotification}
                        />
                    </div>
                    <Divider />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="space-y-0.5">
                                <h4 className="text-large font-medium text-white">Уведомления на веб-аккаунт</h4>
                            </div>
                        </div>
                        <Switch
                            id="web-notification"
                            onChange={onWebNotificationChange}
                            isSelected={isWebNotification}
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
