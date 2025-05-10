"use client";

import { useContext } from "react";

import { AuthContext } from "@/contexts/auth/AuthContext";
import { Card, CardBody } from "@heroui/card";
import { Avatar, Button, Skeleton, Tab, Tabs } from "@heroui/react";

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
                    <ProfileTabs />
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

function ProfileTabs() {
    return (
        <div className="flex w-full flex-col pt-4">
            <Tabs aria-label="Options" className="w-full">
                <Tab key="info" title="Личная информация" className="flex-1 py-4 text-center" />
                <Tab key="prof" title="Профессиональная" className="flex-1 py-4 text-center" />
                <Tab key="settings" title="Настройки" className="flex-1 py-4 text-center" />
            </Tabs>
        </div>
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
