import React, { useContext, useEffect, useState } from "react";

import { refresh, updateSocialNetworks } from "@/api/accounts";
import { AddSocialNetworkModal } from "@/app/profile/Components/PersonalInfo/addSocialNetworkModal";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

export function SocialMedia() {
    const user = useContext(AuthContext)!.user!;
    const [socialNetworks, setSocialNetworks] = useState(user.socialNetworks);

    const onDeleteSocialMedia = async (index: number) => {
        const updatedNetworks = socialNetworks.filter((_, i) => i !== index);

        try {
            await updateSocialNetworks(updatedNetworks);
            setSocialNetworks(updatedNetworks);
            await refresh();
        } catch (error) {
            console.error("Failed to update social networks:", error);
        }
    };

    useEffect(() => {
        setSocialNetworks(user.socialNetworks);
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Социальные сети</h4>
            </CardHeader>
            <Divider className="bg-white/20" />
            <CardBody className="space-y-4">
                <div className="grid gap-4 md:grid-cols-1">
                    {user.socialNetworks.map((socialNetwork, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                className="h-6 w-6 min-w-6"
                                onPressEnd={() => {
                                    void onDeleteSocialMedia(index);
                                }}
                            >
                                <Icon icon="material-symbols:remove-rounded" width={16} height={16} />
                            </Button>
                            <Chip className="flex-1 px-3 py-1" color="default" variant="flat">
                                {socialNetwork.title}: {socialNetwork.url}
                            </Chip>
                        </div>
                    ))}
                </div>
                <div className="w-48">
                    <AddSocialNetworkModal />
                </div>
            </CardBody>
        </Card>
    );
}
