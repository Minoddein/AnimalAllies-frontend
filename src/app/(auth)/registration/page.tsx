"use client";

import { z } from "zod";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import PasswordInput from "@/components/password-input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button, Input } from "@heroui/react";
import { Tab, Tabs } from "@heroui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";

// Базовая схема с общими полями
const baseSchema = z.object({
    email: z.string().min(1, "Email обязателен").email("Некорректный email"),
    password: z
        .string()
        .min(6, "Пароль должен содержать минимум 6 символов")
        .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
    passwordRepeat: z.string(),
});

// Схема для пользователя
const userSchema = baseSchema.refine((data) => data.password === data.passwordRepeat, {
    message: "Пароли не совпадают",
    path: ["passwordRepeat"],
});

// Схема для волонтера (добавляем поле ФИО)
const volunteerSchema = baseSchema
    .extend({
        fullName: z
            .string()
            .min(1, "ФИО обязательно")
            .min(3, "ФИО должно содержать минимум 3 символа")
            .regex(/^[а-яА-ЯёЁ\s]+$/, "ФИО должно содержать только кириллические буквы"),
    })
    .refine((data) => data.password === data.passwordRepeat, {
        message: "Пароли не совпадают",
        path: ["passwordRepeat"],
    });

export default function Page() {
    return (
        <main className="flex h-screen items-center justify-center">
            <Card className="bg-zinc-950 md:w-1/4">
                <CardHeader className="justify-center">
                    <p className="mx-2 my-4 text-2xl">Регистрация</p>
                </CardHeader>
                <CardBody>
                    <Tabs aria-label="RegisterForms" className="w-full" fullWidth>
                        <Tab key="user" title="Пользователь">
                            <UserForm />
                        </Tab>
                        <Tab key="volunteer" title="Волонтёр">
                            <VolunteerForm />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </main>
    );
}

function UserForm() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof userSchema>> = (data) => {
        try {
            setIsLoading(true);
            console.log(data);
            // await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e).catch(console.error);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-4">
                <Input
                    label="Email"
                    type="email"
                    variant="bordered"
                    {...register("email")}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                />
                <PasswordInput
                    {...register("password")}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                />
                <PasswordInput
                    label="Повторите пароль"
                    {...register("passwordRepeat")}
                    isInvalid={!!errors.passwordRepeat}
                    errorMessage={errors.passwordRepeat?.message}
                />
                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    Регистрация
                </Button>
            </div>
        </form>
    );
}

function VolunteerForm() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(volunteerSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof volunteerSchema>> = (data) => {
        try {
            setIsLoading(true);
            console.log(data);
            // await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e).catch(console.error);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-4">
                <Input
                    label="ФИО"
                    type="text"
                    variant="bordered"
                    {...register("fullName")}
                    isInvalid={!!errors.fullName}
                    errorMessage={errors.fullName?.message}
                />
                <Input
                    label="Email"
                    type="email"
                    variant="bordered"
                    {...register("email")}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                />
                <PasswordInput
                    label="Пароль"
                    {...register("password")}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                />
                <PasswordInput
                    label="Повторите пароль"
                    {...register("passwordRepeat")}
                    isInvalid={!!errors.passwordRepeat}
                    errorMessage={errors.passwordRepeat?.message}
                />
                <Button type="submit" color="success" isLoading={isLoading}>
                    Регистрация
                </Button>
            </div>
        </form>
    );
}
