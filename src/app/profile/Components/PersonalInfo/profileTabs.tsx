import React from "react";

import { ContactInfo } from "@/app/profile/Components/PersonalInfo/contactInfo";
import { PersonalInfo } from "@/app/profile/Components/PersonalInfo/personalInfo";
import { SocialMedia } from "@/app/profile/Components/PersonalInfo/socialMedia";
import { ExperienceDetails } from "@/app/profile/Components/ProfessionInfo/experienceDetails";
import { Roles } from "@/app/profile/Components/ProfessionInfo/roles";
import { Settings } from "@/app/profile/Components/Settings/settings";
import { PersonalInfoProps } from "@/app/profile/page";
import { Tab, Tabs } from "@heroui/react";

export function ProfileTabs({ user }: PersonalInfoProps) {
    return (
        <div className="flex w-full flex-col pt-4">
            <Tabs aria-label="Options" fullWidth={true}>
                <Tab key="info" title="Личная информация" className="flex-1 py-4 text-center">
                    <div className="space-y-4">
                        <PersonalInfo user={user} />
                        {user.roles.some((r) => r === "Volunteer") ? (
                            <div className="space-y-4">
                                <ContactInfo user={user} />
                                <SocialMedia />
                            </div>
                        ) : null}
                    </div>
                </Tab>
                {user.roles.some((r) => r === "Volunteer") ? (
                    <Tab key="prof" title="Профессиональная" className="flex-1 py-4 text-center">
                        <div className="space-y-4">
                            <Roles user={user} />
                            {/*<PaymentDetails user={user} />
                            <Certificates user={user} />*/}
                            <ExperienceDetails user={user} />
                        </div>
                    </Tab>
                ) : null}
                <Tab key="settings" title="Настройки" className="flex-1 py-4 text-center">
                    <Settings user={user} />
                </Tab>
            </Tabs>
        </div>
    );
}
