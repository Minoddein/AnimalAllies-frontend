"use client";

import { ArrowLeft, Clock, Heart, Mail, MessageCircle, Phone } from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { getDownloadPresignedUrl } from "@/api/files";
import { VolunteerDto, getVolunteerById } from "@/api/volunteer";
import MyAnimalsTab from "@/app/volunteers/[id]/_components/animals-tabs";
import { Certificates } from "@/app/volunteers/components/certificates";
import { PaymentDetails } from "@/app/volunteers/components/requisites";
import { SocialMedia } from "@/app/volunteers/components/socialMedia";
import { Avatar, Button, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";

export default function VolunteerProfilePage() {
    const [volunteer, setVolunteer] = useState<VolunteerDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const id = params.id as string;

    useEffect(() => {
        async function loadVolunteer() {
            try {
                setLoading(true);
                const response = await getVolunteerById(id);

                if (!response.data.result?.value) {
                    throw new Error("Волонтёр не найден");
                }

                const volunteer = response.data.result.value;
                const fileInfo = volunteer.avatarUrl.split(".");

                const presignedUrl = await getDownloadPresignedUrl(fileInfo[0], fileInfo[1]);

                volunteer.avatarUrl = presignedUrl.data.downloadUrl;

                setVolunteer(volunteer);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Произошла ошибка");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        void loadVolunteer();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div>Загрузка профиля...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!volunteer) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div>Профиль волонтёра не найден</div>
            </div>
        );
    }

    return (
        <div className="gradient-bg min-h-screen pl-6">
            <div className="container py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/volunteers"
                        className="text-primary hover:text-primary/80 inline-flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Назад к списку волонтёров
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="glass-effect sticky top-24 border-0 shadow-xl">
                            <CardBody className="pt-6">
                                <div className="text-center">
                                    {/* Avatar with status */}
                                    <div className="relative mb-4 inline-block">
                                        <Avatar
                                            className="ring-primary/20 h-32 w-32 ring-4"
                                            src={volunteer.avatarUrl}
                                        />
                                    </div>

                                    <h1 className="mb-2 text-2xl font-bold">
                                        {volunteer.firstName} {volunteer.secondName}
                                    </h1>
                                </div>

                                {/* Contact Info */}
                                <div className="mb-6 space-y-3">
                                    <div className="bg-background/50 flex items-center gap-3 rounded-lg p-3">
                                        <Clock className="text-primary h-4 w-4" />
                                        <span className="text-sm">Опыт: {volunteer.workExperience}</span>
                                    </div>
                                    <div className="bg-background/50 flex items-center gap-3 rounded-lg p-3">
                                        <Mail className="text-primary h-4 w-4" />
                                        <span className="text-sm">{volunteer.email}</span>
                                    </div>
                                    <div className="bg-background/50 flex items-center gap-3 rounded-lg p-3">
                                        <Phone className="text-primary h-4 w-4" />
                                        <span className="text-sm">{volunteer.phoneNumber}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <Button className="bg-primary hover:bg-primary/90 w-full space-y-2">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Написать сообщение
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                    {/* Main Content */}
                    <div className="space-y-8 lg:col-span-2">
                        <Tabs fullWidth>
                            <Tab key="description" title="Описание">
                                <div className="space-y-8">
                                    {/* Bio */}
                                    <Card className="glass-effect border-0 shadow-xl">
                                        <CardHeader>О волонтёре</CardHeader>
                                        <CardBody>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {volunteer.description}
                                            </p>
                                        </CardBody>
                                    </Card>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Card className="glass-effect border-0 shadow-lg">
                                            <CardBody className="pt-6 text-center">
                                                <Heart className="mx-auto mb-2 h-8 w-8 text-red-500" />
                                                <div className="text-2xl font-bold">{volunteer.animalsCount}</div>
                                                <p className="text-muted-foreground text-xs">Животных пристроено</p>
                                            </CardBody>
                                        </Card>
                                        <Card className="glass-effect border-0 shadow-lg">
                                            <CardBody className="pt-6 text-center">
                                                <Clock className="mx-auto mb-2 h-8 w-8 text-green-500" />
                                                <div className="text-2xl font-bold">120</div>
                                                <p className="text-muted-foreground text-xs">Часов помощи</p>
                                            </CardBody>
                                        </Card>
                                    </div>

                                    <Certificates volunteerId={id} />
                                    <PaymentDetails volunteerId={id} />
                                    <SocialMedia volunteerId={id} />

                                    {/* Activity Timeline */}
                                    {/*<Card className="glass-effect border-0 shadow-xl">
                                <CardHeader>Последняя активность</CardHeader>
                                <CardBody> Добавьте timeline если нужно </CardBody>
                                </Card>*/}
                                </div>
                            </Tab>
                            <Tab key="animals" title="Закреплённые животные">
                                <MyAnimalsTab />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
