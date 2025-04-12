"use client";

import { z } from "zod";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import PasswordInput from "@/components/password-input";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    email: z.string().min(1, "Email обязателен").email("Некорректный email"),
    password: z
        .string()
        .min(6, "Пароль должен содержать минимум 6 символов")
        .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
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
        <main className="flex h-screen items-center justify-center">
            <Card className="bg-zinc-950 md:w-1/4">
                <CardHeader className="justify-center">
                    <p className="mx-2 my-4 text-2xl">Вход в аккаунт</p>
                </CardHeader>
                <CardBody>
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
                            <Button type="submit" color="success" isLoading={isLoading}>
                                Вход
                            </Button>
                        </div>
                    </form>
                </CardBody>
                <CardFooter className="mx-2 my-4 flex justify-center">
                    <Link color="foreground" href="/registration">
                        Ещё нет аккаунта? Создать
                    </Link>
                </CardFooter>
            </Card>
        </main>
    );
}
