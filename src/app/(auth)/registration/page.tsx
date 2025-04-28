"use client";

import { z } from "zod";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import PasswordInput from "@/components/password-input";
import { RegisterProps, api } from "@/lib/api";
import { Envelope } from "@/models/envelope";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button, Input } from "@heroui/react";
import { Tab, Tabs } from "@heroui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";

// Базовая схема с общими полями
const baseSchema = z.object({
    email: z.string().min(1, "Email обязателен").email("Некорректный email"),
    nickname: z.string().min(1, "Никнейм обязателен"),
    firstname: z.string().min(1, "Имя обязательно"),
    secondname: z.string().min(1, "Фамилия обязательна"),
    patronymic: z.string(),
    password: z
        .string()
        .min(8, "Пароль должен содержать минимум 8 символов")
        .regex(/[A-ZА-ЯЁ]/, "Пароль должен содержать хотя бы одну заглавную букву")
        .regex(/[a-zа-яё]/, "Пароль должен содержать хотя бы одну строчную букву")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
    passwordRepeat: z.string(),
});

// Схема для пользователя
const userSchema = baseSchema.refine((data) => data.password === data.passwordRepeat, {
    message: "Пароли не совпадают",
    path: ["passwordRepeat"],
});

export default function Page() {
    return (
        <main className="flex h-screen items-center justify-center">
            <Card className="w-96 bg-zinc-950 p-2">
                <CardHeader className="justify-center">
                    <p className="mx-2 my-4 text-2xl">Регистрация</p>
                </CardHeader>
                <CardBody>
                    <Tabs aria-label="RegisterForms" className="w-full" fullWidth>
                        <Tab key="user" title="Пользователь">
                            <UserForm />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </main>
    );
}

function UserForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof userSchema>> = async (data) => {
        try {
            setIsLoading(true);
            setMessage(null);
            setMessageType(null);

            console.log(data);

            const registerData: RegisterProps = {
                email: data.email,
                userName: data.nickname,
                firstName: data.firstname,
                secondName: data.secondname,
                patronymic: data.patronymic || null,
                password: data.password,
            };

            const response = await api.register(registerData);

            const result = (await response.json()) as Envelope;

            if (result.result === null) {
                setMessage(result.errors.map((e) => e.errorMessage).join(",") || "Ошибка регистрации");
                setMessageType("error");
            } else {
                router.push("/confirm-email");
            }
        } catch (error) {
            console.error(error);
            setMessage("Не получилось");
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e).catch(console.error);
    };
    //TODO: Пофиксить потом вывод ошибок на более красивое решение
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
                <Input
                    label="Никнейм"
                    type="text"
                    variant="bordered"
                    {...register("nickname")}
                    isInvalid={!!errors.nickname}
                    errorMessage={errors.nickname?.message}
                />
                <Input
                    label="Имя"
                    type="text"
                    variant="bordered"
                    {...register("firstname")}
                    isInvalid={!!errors.firstname}
                    errorMessage={errors.firstname?.message}
                />
                <Input
                    label="Фамилия"
                    type="text"
                    variant="bordered"
                    {...register("secondname")}
                    isInvalid={!!errors.secondname}
                    errorMessage={errors.secondname?.message}
                />
                <Input
                    label="Отчество"
                    type="text"
                    variant="bordered"
                    {...register("patronymic")}
                    isInvalid={!!errors.patronymic}
                    errorMessage={errors.patronymic?.message}
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
                {message && (
                    <div
                        className={`rounded p-4 text-center ${
                            messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                        {message}
                    </div>
                )}
                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    Регистрация
                </Button>
            </div>
        </form>
    );
}
