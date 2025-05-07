"use client";

import React from "react";

import {Tab, Tabs} from "@heroui/react";
import LoginForm from "@/app/_components/auth/login-form";
import RegistrationFrom from "@/app/_components/auth/registration-from";

export default function AuthForm() {
    return (
        <Tabs aria-label="RegisterForms" className="w-full" fullWidth>
            <Tab key="login" title="Вход">
                <LoginForm/>
            </Tab>
            <Tab key="register" title="Регистрация">
                <RegistrationFrom/>
            </Tab>
        </Tabs>
    );
}


