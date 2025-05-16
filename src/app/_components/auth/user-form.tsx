"use client";

import { z } from "zod";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { register } from "@/api/accounts";
import PasswordInput from "@/components/password-input";
import { RegisterProps } from "@/models/requests/RegisterProps";
import { baseRegistrationSchema } from "@/schemas/base-registration-schema";
import { Alert, Button, Input, addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = baseRegistrationSchema
    .extend({
        password: z
            .string()
            .min(8, "Пароль должен содержать минимум 8 символов")
            .regex(/[A-ZА-ЯЁ]/, "Пароль должен содержать хотя бы одну заглавную букву")
            .regex(/[a-zа-яё]/, "Пароль должен содержать хотя бы одну строчную букву")
            .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
        passwordRepeat: z.string(),
    })
    .refine((data) => data.password === data.passwordRepeat, {
        message: "Пароли не совпадают",
        path: ["passwordRepeat"],
    });

export default function UserForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [, setMessageType] = useState<"success" | "error" | null>(null);

    const {
        register: registerValidator,
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

            const response = await register(registerData);

            if (!response.data.result) {
                setMessage(response.data.errors.map((e) => e.errorMessage).join(",") || "Ошибка регистрации");
                setMessageType("error");
            } else {
                addToast({
                    title: "Подтверждение почты",
                    description: "Мы отправили Вам письмо с подтверждением на почту",
                    color: "success",
                    timeout: 5000,
                    shouldShowTimeoutProgress: true,
                });
            }
        } catch (error) {
            console.log(error);
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

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-4">
                <Input
                    label="Email"
                    type="email"
                    variant="bordered"
                    {...registerValidator("email")}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                />
                <Input
                    label="Никнейм"
                    type="text"
                    variant="bordered"
                    {...registerValidator("nickname")}
                    isInvalid={!!errors.nickname}
                    errorMessage={errors.nickname?.message}
                />
                <Input
                    label="Имя"
                    type="text"
                    variant="bordered"
                    {...registerValidator("firstname")}
                    isInvalid={!!errors.firstname}
                    errorMessage={errors.firstname?.message}
                />
                <Input
                    label="Фамилия"
                    type="text"
                    variant="bordered"
                    {...registerValidator("secondname")}
                    isInvalid={!!errors.secondname}
                    errorMessage={errors.secondname?.message}
                />
                <Input
                    label="Отчество"
                    type="text"
                    variant="bordered"
                    {...registerValidator("patronymic")}
                    isInvalid={!!errors.patronymic}
                    errorMessage={errors.patronymic?.message}
                />
                <PasswordInput
                    {...registerValidator("password")}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                />
                <PasswordInput
                    label="Повторите пароль"
                    {...registerValidator("passwordRepeat")}
                    isInvalid={!!errors.passwordRepeat}
                    errorMessage={errors.passwordRepeat?.message}
                />
                {message && <Alert color={"danger"} title={message} />}
                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    Регистрация
                </Button>
            </div>
        </form>
    );
}
