"use client";

import axios from "axios";
import { z } from "zod";

import React, { useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { createVolunteerRequest } from "@/api/requests";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { RegisterVolunteerProps } from "@/models/requests/RegisterVolunteerProps";
import { baseRegistrationSchema } from "@/schemas/base-registration-schema";
import { Textarea } from "@heroui/input";
import { Alert, Button, Input, NumberInput, addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

interface VolunteerFormProps {
    onSuccess?: () => void;
}

const volunteerSchema = baseRegistrationSchema.extend({
    phoneNumber: z
        .string()
        .min(1, "Телефон обязателен")
        .regex(/^\+7\d{10}$/, "Введите корректный российский номер (+7XXXXXXXXXX)"),
    workExperience: z.coerce.number().min(0).max(100),
    volunteerDescription: z.string().min(1, "Добавьте немного информации о себе"),
});

export default function VolunteerForm({ onSuccess }: VolunteerFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const { user } = useContext(AuthContext)!;
    const [defaultValues, setDefaultValues] = useState<Partial<z.infer<typeof volunteerSchema>>>({});

    const {
        control,
        register: registerValidator,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<z.infer<typeof volunteerSchema>>({
        resolver: zodResolver(volunteerSchema),
        defaultValues,
    });

    // Автозаполнение формы при изменении пользователя
    useEffect(() => {
        if (user) {
            const values: Partial<z.infer<typeof volunteerSchema>> = {
                email: user.email || "",
                nickname: user.userName || "",
                firstname: user.firstName || "",
                secondname: user.secondName || "",
                patronymic: user.patronymic ?? undefined,
                phoneNumber: user.volunteer?.phone ?? "",
                workExperience: user.volunteer?.experience ?? 0,
                volunteerDescription: "",
            };
            setDefaultValues(values);
            reset(values);
        }
    }, [user, reset]);

    const onSubmit: SubmitHandler<z.infer<typeof volunteerSchema>> = async (data) => {
        try {
            setIsLoading(true);
            setMessage(null);

            const registerData: RegisterVolunteerProps = {
                email: data.email,
                userName: data.nickname,
                firstName: data.firstname,
                secondName: data.secondname,
                patronymic: data.patronymic || null,
                phoneNumber: data.phoneNumber,
                workExperience: data.workExperience,
                volunteerDescription: data.volunteerDescription,
            };

            console.log("Отправка данных:", registerData);
            const response = await createVolunteerRequest(registerData);
            console.log(response.data.errors);

            addToast({
                title: "Отправление заявки",
                description: "Мы отправили заявку на регистрацию Вас как волонтёра",
                color: "success",
                timeout: 5000,
                shouldShowTimeoutProgress: true,
            });

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                interface ApiErrorResponse {
                    errors?: {
                        errorCode: string;
                        message: string;
                    }[];
                }

                const errorData = error.response?.data as ApiErrorResponse | undefined;

                if (errorData?.errors) {
                    const prohibitedError = errorData.errors.find(
                        (e) => e.errorCode === "access.denied.request.prohibited",
                    );

                    if (prohibitedError) {
                        setMessage("Вам наложен запрет на создание заявок сроком 7 дней.");
                        return;
                    }

                    const otherErrors = errorData.errors
                        .filter((e) => e.errorCode !== "access.denied.request.prohibited")
                        .map((e) => e.message)
                        .join(", ");

                    if (otherErrors) {
                        setMessage(otherErrors);
                        return;
                    }
                }
            }

            setMessage("Не получилось отправить заявку");
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
                    isDisabled={!!user?.email}
                />

                <Input
                    label="Никнейм"
                    type="text"
                    variant="bordered"
                    {...registerValidator("nickname")}
                    isInvalid={!!errors.nickname}
                    errorMessage={errors.nickname?.message}
                    isDisabled={!!user?.userName}
                />

                <Input
                    label="Имя"
                    type="text"
                    variant="bordered"
                    {...registerValidator("firstname")}
                    isInvalid={!!errors.firstname}
                    errorMessage={errors.firstname?.message}
                    isDisabled={!!user?.firstName}
                />

                <Input
                    label="Фамилия"
                    type="text"
                    variant="bordered"
                    {...registerValidator("secondname")}
                    isInvalid={!!errors.secondname}
                    errorMessage={errors.secondname?.message}
                    isDisabled={!!user?.secondName}
                />

                <Input
                    label="Отчество"
                    type="text"
                    variant="bordered"
                    {...registerValidator("patronymic")}
                    isInvalid={!!errors.patronymic}
                    errorMessage={errors.patronymic?.message}
                    isDisabled={!!user?.patronymic}
                />

                <Input
                    label="Телефон"
                    type="tel"
                    variant="bordered"
                    inputMode="tel"
                    {...registerValidator("phoneNumber")}
                    isInvalid={!!errors.phoneNumber}
                    errorMessage={errors.phoneNumber?.message}
                    isDisabled={!!user?.volunteer?.phone}
                />

                <Controller
                    name="workExperience"
                    control={control}
                    render={({ field, fieldState }) => (
                        <NumberInput
                            label="Волонтёрский опыт (лет)"
                            variant="bordered"
                            minValue={0}
                            maxValue={100}
                            value={field.value}
                            onChange={field.onChange}
                            isInvalid={!!fieldState.error}
                            isDisabled={!!user?.volunteer?.experience}
                            errorMessage={fieldState.error?.message}
                        />
                    )}
                />

                <Textarea
                    label="О себе"
                    variant="bordered"
                    {...registerValidator("volunteerDescription")}
                    isInvalid={!!errors.volunteerDescription}
                    errorMessage={errors.volunteerDescription?.message}
                />

                {message && <Alert color="danger" title={message} />}

                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    {user?.volunteer ? "Обновить данные" : "Подать заявку"}
                </Button>
            </div>
        </form>
    );
}
