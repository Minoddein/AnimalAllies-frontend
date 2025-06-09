import React, { useEffect, useState } from "react";

import { getUserById } from "@/api/accounts";
import { SocialNetwork } from "@/models/socialNetwork";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

interface SocialMediaProps {
    volunteerId: string;
}

export function SocialMedia({ volunteerId }: SocialMediaProps) {
    const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([]);

    useEffect(() => {
        const fetchSocialNetworks = async () => {
            try {
                const response = await getUserById(volunteerId);
                if (!response.data.result?.value) {
                    throw new Error("Error fetching social network");
                }

                setSocialNetworks(response.data.result.value.socialNetworks);
            } catch (error) {
                console.error("Error fetching social networks:", error);
            }
        };
        void fetchSocialNetworks();
    }, [volunteerId]);

    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Социальные сети</h4>
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="grid gap-4 md:grid-cols-1">
                    {socialNetworks.map((network) => (
                        <div key={`${network.title}-${network.url}`} className="flex items-center gap-2">
                            <Chip className="flex-1 px-3 py-1" color="default" variant="flat">
                                <div className="flex items-center gap-2">
                                    <Icon icon={`simple-icons:${network.title.toLowerCase()}`} width={16} height={16} />
                                    <span>{network.title + ":"} </span>
                                    <span>{network.url}</span>
                                </div>
                            </Chip>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}
