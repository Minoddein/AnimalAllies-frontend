import React from "react";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider, Skeleton } from "@heroui/react";

export function ProfileSkeleton() {
    return (
        <div className="container mx-auto py-6">
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                {/* Sidebar Skeleton */}
                <div className="flex flex-col items-center">
                    <Card>
                        <CardBody className="flex flex-col items-center space-y-4 p-6">
                            <Skeleton className="h-32 w-32 rounded-full" />
                            <div className="w-full pt-2 text-center">
                                <Skeleton className="mx-auto h-6 w-48" />
                                <Skeleton className="mx-auto mt-2 h-4 w-32" />
                            </div>
                            <Skeleton className="h-9 w-full rounded-md" />
                        </CardBody>
                    </Card>
                </div>

                {/* Main Content Skeleton */}
                <div className="flex flex-col">
                    {/* Header Skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-full max-w-md" />
                    </div>

                    {/* Tabs Skeleton */}
                    <div className="mt-4 w-full">
                        <div className="flex border-b border-white/20">
                            <div className="border-primary flex-1 border-b-2 px-4 py-2 text-center">
                                <Skeleton className="mx-auto h-5 w-32" />
                            </div>
                            <div className="flex-1 px-4 py-2 text-center">
                                <Skeleton className="mx-auto h-5 w-32" />
                            </div>
                            <div className="flex-1 px-4 py-2 text-center">
                                <Skeleton className="mx-auto h-5 w-32" />
                            </div>
                        </div>

                        {/* Tab Content Skeleton */}
                        <div className="mt-4 space-y-4">
                            {/* Personal Info Card Skeleton */}
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-48" />
                                </CardHeader>
                                <Divider className="bg-white/20" />
                                <CardBody className="space-y-4">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-6 w-full" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-6 w-full" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-36" />
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4 rounded-full" />
                                                <Skeleton className="h-6 w-full" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-28" />
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4 rounded-full" />
                                                <Skeleton className="h-6 w-full" />
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Contact Info Card Skeleton */}
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-48" />
                                </CardHeader>
                                <Divider className="bg-white/20" />
                                <CardBody className="space-y-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-4 rounded-full" />
                                            <Skeleton className="h-6 w-full max-w-md" />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Social Media Card Skeleton */}
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-48" />
                                </CardHeader>
                                <Divider className="bg-white/20" />
                                <CardBody className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                            <Skeleton className="h-10 w-full rounded-md" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                            <Skeleton className="h-10 w-full rounded-md" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                            <Skeleton className="h-10 w-full rounded-md" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-5 w-5 rounded-full" />
                                            <Skeleton className="h-10 w-full rounded-md" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-9 w-full rounded-md" />
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ProfileHeaderSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full max-w-md" />
        </div>
    );
}

export function PersonalInfoSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export function ContactInfoSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-6 w-full max-w-md" />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export function SocialMediaSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </div>
                <Skeleton className="h-9 w-full rounded-md" />
            </CardBody>
        </Card>
    );
}

export function RolesSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody>
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-36 rounded-full" />
                    <Skeleton className="h-6 w-28 rounded-full" />
                </div>
            </CardBody>
        </Card>
    );
}

export function PaymentDetailsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </div>
                <Skeleton className="h-4 w-full max-w-md" />
            </CardBody>
        </Card>
    );
}

export function CertificatesSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="space-y-4">
                    <div className="rounded-lg border border-white/20 p-4">
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="mt-2 h-4 w-full max-w-md" />
                    </div>
                    <div className="rounded-lg border border-white/20 p-4">
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="mt-2 h-4 w-full max-w-md" />
                    </div>
                    <div className="rounded-lg border border-white/20 p-4">
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="mt-2 h-4 w-full max-w-md" />
                    </div>
                </div>
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-9 w-full rounded-md" />
            </CardBody>
        </Card>
    );
}

export function SettingsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-6 w-10 rounded-full" />
                    </div>
                    <Divider className="bg-white/20" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-6 w-10 rounded-full" />
                    </div>
                    <Divider className="bg-white/20" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-6 w-10 rounded-full" />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export function ProfileTabsSkeleton() {
    return (
        <div className="flex w-full flex-col pt-4">
            <div className="flex border-b border-white/20">
                <div className="border-primary flex-1 border-b-2 px-4 py-2 text-center">
                    <Skeleton className="mx-auto h-5 w-32" />
                </div>
                <div className="flex-1 px-4 py-2 text-center">
                    <Skeleton className="mx-auto h-5 w-32" />
                </div>
                <div className="flex-1 px-4 py-2 text-center">
                    <Skeleton className="mx-auto h-5 w-32" />
                </div>
            </div>

            <div className="mt-4 space-y-4">
                <PersonalInfoSkeleton />
                <ContactInfoSkeleton />
                <SocialMediaSkeleton />
            </div>
        </div>
    );
}
