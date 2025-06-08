import React from "react";

import { PersonalInfoProps } from "@/app/profile/page";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

export function ExperienceDetails({ user }: PersonalInfoProps) {
    return (
        <Card>
            <CardHeader>
                <h4 className="text-large font-medium text-white">Опыт работы</h4>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Icon icon="luicide:phone" className="text-muted-foreground h-4 w-4" />
                        <p className="text-medium font-medium text-white">
                            Общий: {user.volunteer?.experience} {pluralizeYears(user.volunteer!.experience)}
                        </p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export function pluralizeYears(years: number) {
    const lastDigit = years % 10;
    const lastTwoDigits = years % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return "лет";
    }
    if (lastDigit === 1) {
        return "год";
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
        return "года";
    }
    return "лет";
}
