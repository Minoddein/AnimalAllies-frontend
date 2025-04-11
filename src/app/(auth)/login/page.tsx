"use client";

import { z } from "zod";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import PasswordInput from "@/components/password-input";
import { Link } from "@heroui/link";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    email: z.string().min(1, "Email обязателен").email("Некорректный email"),
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

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
        try {
            setIsLoading(true);
            console.log(data);
            await new Promise((resolve) => setTimeout(resolve, 100));
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
            <div className="w-1/4">
                <p className="mx-2 my-4 text-center text-2xl">Вход в аккаунт</p>
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
                        <PasswordInput />
                        <Button type="submit" color="success" isLoading={isLoading}>
                            Вход
                        </Button>
                    </div>
                </form>
                <div className="mx-2 my-4 flex justify-center">
                    <Link color="foreground" href="/registration">
                        Ещё нет аккаунта? Создать
                    </Link>
                </div>
            </div>
        </main>
    );
}
