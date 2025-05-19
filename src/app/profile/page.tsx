"use client";

import React, { useContext, useEffect, useState } from "react";

import { UploadAvatarModal } from "@/app/profile/Components/PersonalInfo/UploadAvatarModal";
import { EditProfileModal } from "@/app/profile/Components/PersonalInfo/editProfileModal";
import { ProfileHeader } from "@/app/profile/Components/PersonalInfo/profileHeader";
import { ProfileTabs } from "@/app/profile/Components/PersonalInfo/profileTabs";
import { ProfileSkeleton } from "@/app/profile/Components/skeleton";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { User } from "@/models/user";
import { Card, CardBody } from "@heroui/card";

export interface PersonalInfoProps {
    user: User;
}

export default function ProfilePage() {
    const { user } = useContext(AuthContext)!;
    const [isLoading, setIsLoading] = useState(true);

    console.log(user);

    useEffect(() => {
        if (user) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [user]);

    if (isLoading || !user) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="container mx-auto py-6">
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <div className="flex flex-col items-center">
                    <Card>
                        <CardBody className="flex flex-col items-center space-y-4 p-6">
                            <UploadAvatarModal />
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
                            <EditProfileModal user={user} />
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
