"use client";

import React from "react";
import {Tab, Tabs} from "@heroui/tabs";
import UserForm from "@/app/_components/auth/user-form";


export default function RegistrationFrom() {
    return (
        <Tabs aria-label="RegisterForms" className="w-full" fullWidth>
            <Tab key="user" title="Пользователь">
                <UserForm/>
            </Tab>
        </Tabs>
    );
}


