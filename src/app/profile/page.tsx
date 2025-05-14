"use client";

import { AxiosResponse } from "axios";

import { useContext, useLayoutEffect, useState } from "react";

import { getNotificationSettings, setNotificationSettings } from "@/api/accounts";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { SetNotificationSettingsProps } from "@/models/requests/SetNotificationSettingsProps";
import { User } from "@/models/user";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar, Button, Divider, Input, Skeleton, Switch, Tab, Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";

interface PersonalInfoProps {
    user: User;
}

export default function ProfilePage() {
    const user = useContext(AuthContext)!.user;

    console.log(user);

    if (!user) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="container mx-auto py-6">
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <div className="flex flex-col items-center">
                    <Card>
                        <CardBody className="flex flex-col items-center space-y-4 p-6">
                            <Avatar
                                className="h-32 w-32 text-large"
                                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                            />
                            <div className="pt-2 text-center">
                                {user.patronymic === undefined ? (
                                    <h2 className="text-xl font-bold">{user.secondName + " " + user.firstName}</h2>
                                ) : (
                                    <h2 className="text-xl font-bold">
                                        {user.secondName + " " + user.firstName + " " + user.patronymic!}
                                    </h2>
                                )}
                                <p className="text-muted-foreground pt-2 text-sm">@{user.userName}</p>
                            </div>
                            <Button color="primary" variant="solid" className="h-[30px]" radius={"sm"}>
                                Редактировать
                            </Button>
                        </CardBody>
                    </Card>
                </div>
                <div className="flex flex-col">
                    <ProfileHeader />
                    <div className="max-w-full">
                        <ProfileTabs user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileHeader() {
    return (
        <div className="space-y-2 pl-3">
            <h1 className="text-3xl font-bold tracking-tight">Профиль пользователя</h1>
        </div>
    );
}

function ProfileTabs({ user }: PersonalInfoProps) {
    return (
        <div className="flex w-full flex-col pt-4">
            <Tabs aria-label="Options" fullWidth={true}>
                <Tab key="info" title="Личная информация" className="flex-1 py-4 text-center">
                    <div className="space-y-4">
                        <PersonalInfo user={user} />
                        {user.roles.some((r) => r === "Volunteer") ? (
                            <div className="space-y-4">
                                <ContactInfo user={user} />
                                <SocialMedia user={user} />
                            </div>
                        ) : null}
                    </div>
                </Tab>
                {user.roles.some((r) => r === "Volunteer") ? (
                    <Tab key="prof" title="Профессиональная" className="flex-1 py-4 text-center">
                        <div className="space-y-4">
                            <Roles user={user} />
                            <PaymentDetails user={user} />
                        </div>
                    </Tab>
                ) : null}
                <Tab key="settings" title="Настройки" className="flex-1 py-4 text-center">
                    <Settings user={user} />
                </Tab>
            </Tabs>
        </div>
    );
}

function Settings({ user }: PersonalInfoProps) {
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

function PersonalInfo({ user }: PersonalInfoProps) {
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
                        <p className="text-medium font-medium text-white">
                            {user.patronymic === undefined ? (
                                <h2 className="text-xl font-bold">{user.secondName + " " + user.firstName}</h2>
                            ) : (
                                <h2 className="text-xl font-bold">
                                    {user.secondName + " " + user.firstName + " " + user.patronymic!}
                                </h2>
                            )}
                        </p>
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
                    {user.roles.some((r) => r === "Volunteer") ? (
                        <div className="space-y-1">
                            <p className="text-sm text-white/60">Местоположение</p>
                            <div className="flex items-center gap-2">
                                <Icon icon="luicide:map-pin" className="h-4 w-4 text-white/60" />
                                <p className="text-medium font-medium text-white">Москва, Россия</p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </CardBody>
        </Card>
    );
}

function ContactInfo({ user }: PersonalInfoProps) {
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

function SocialMedia({ user }: PersonalInfoProps) {
    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Социальные сети</h4>
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="grid gap-4 md:grid-cols-1">
                    {user.socialNetworks.map((socialNetwork, index) => (
                        <Chip key={index} className="px-4 py-2" color="default" variant="flat">
                            {socialNetwork.title}: {socialNetwork.url}
                        </Chip>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}

function Roles({ user }: PersonalInfoProps) {
    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Роли</h4>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="flex flex-wrap gap-2">
                    {user.roles.map((role, index) => (
                        <Chip key={index} className="px-4 py-2" color="warning" variant="shadow">
                            {role}
                        </Chip>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}

function PaymentDetails({ user }: PersonalInfoProps) {
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
            </CardBody>
        </Card>
    );
}

function ProfileSkeleton() {
    return (
        <div className="container mx-auto py-6">
            <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                <div className="flex flex-col items-center">
                    <Skeleton className="h-[136px] w-[136px] rounded-full" />
                    <div className="w-full pt-2 text-center">
                        <Skeleton className="mx-auto my-2 h-6 w-48" />
                        <Skeleton className="mx-auto h-4 w-32" />
                    </div>
                </div>
            </div>
        </div>
    );
}
