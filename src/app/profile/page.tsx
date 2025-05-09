"use client";

import { useContext } from "react";

import { AuthContext } from "@/contexts/auth/AuthContext";
import { Avatar, Skeleton } from "@heroui/react";

export default function ProfilePage() {
    const user = useContext(AuthContext)!.user;

    console.log(user);

    if (!user) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="container mx-auto py-6">
            <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                <div className="flex flex-col items-center">
                    <Avatar className="h-34 w-34 text-large" src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                    <div className="pt-2 text-center">
                        {user.patronymic === undefined ? (
                            <h2 className="text-xl font-bold">{user.secondName + " " + user.firstName}</h2>
                        ) : (
                            <h2 className="text-xl font-bold">
                                {user.secondName + " " + user.firstName + " " + user.patronymic!}
                            </h2>
                        )}
                        <p className="text-muted-foreground text-sm">@{user.userName}</p>
                    </div>
                </div>
            </div>
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
