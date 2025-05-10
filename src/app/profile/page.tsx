"use client";

import { Mail, MapPin, Phone } from "lucide-react";

import { useContext } from "react";

import { AuthContext } from "@/contexts/auth/AuthContext";
import { User } from "@/models/user";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar, Button, Divider, Skeleton, Tab, Tabs } from "@heroui/react";

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
                            <div>
                                <ContactInfo />
                                <SocialMedia />
                            </div>
                        ) : null}
                    </div>
                </Tab>
                {user.roles.some((r) => r === "Volunteer") ? (
                    <Tab key="prof" title="Профессиональная" className="flex-1 py-4 text-center">
                        <Card>
                            <CardBody>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </CardBody>
                        </Card>
                    </Tab>
                ) : null}
                <Tab key="settings" title="Настройки" className="flex-1 py-4 text-center">
                    <Card>
                        <CardBody>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat.
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
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
                            <Mail className="h-4 w-4 text-white/60" />
                            <p className="text-medium font-medium text-white">{user.email}</p>
                        </div>
                    </div>
                    {user.roles.some((r) => r === "Volunteer") ? (
                        <div className="space-y-1">
                            <p className="text-sm text-white/60">Местоположение</p>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-white/60" />
                                <p className="text-medium font-medium text-white">Москва, Россия</p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </CardBody>
        </Card>
    );
}

function ContactInfo() {
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
                        <Phone className="text-muted-foreground h-4 w-4" />
                        <p className="text-medium font-medium text-white">+7 (999) 123-45-67</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

function SocialMedia() {
    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Контактная информация</h4>
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                        <p className="text-medium font-medium text-white">@ivanov_petr</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-medium font-medium text-white">facebook.com/ivanov.petr</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-medium font-medium text-white">@ivanov_petr</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-medium font-medium text-white">linkedin.com/in/ivanov-petr</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-medium font-medium text-white">github.com/ivanov-petr</p>
                    </div>
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
