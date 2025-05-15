import React from "react";

import { PersonalInfoProps } from "@/app/profile/page";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/react";

export function Roles({ user }: PersonalInfoProps) {
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
