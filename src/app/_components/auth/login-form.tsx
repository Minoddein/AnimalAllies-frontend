"use client";

import {z} from "zod";

import React, {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";

import {useRouter} from "next/navigation";

import PasswordInput from "@/components/password-input";
import {useAuth} from "@/hooks/useAuth";
import {Button, Input} from "@heroui/react";
import {zodResolver} from "@hookform/resolvers/zod";

const formSchema = z.object({
    email: z.string().min(1, "Email обязателен").email("Некорректный email"),
    password: z
        .string()
        .min(6, "Пароль должен содержать минимум 6 символов")
        .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
});

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [, setIsError] = useState(false);
    const router = useRouter();

    const {handleLogin, accessToken} = useAuth();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
        try {
            setIsLoading(true);
            await handleLogin(data.email, data.password);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            router.push("/");
        }
    }, [accessToken, router]);

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
                <Button type="submit" color="success" isLoading={isLoading}>
                    Вход
                </Button>
            </div>
        </form>
    );
}
