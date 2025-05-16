"use client";

import { z } from "zod";

import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { RegisterVolunteerProps } from "@/models/requests/RegisterVolunteerProps";
import { baseRegistrationSchema } from "@/schemas/base-registration-schema";
import { Textarea } from "@heroui/input";
import { Alert, Button, Input, NumberInput, addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";

const volunteerSchema = baseRegistrationSchema.extend({
    phoneNumber: z
        .string()
        .min(1, "Телефон обязателен")
        .regex(/^7\d{10}$/, "Введите корректный российский номер (7XXXXXXXXXX)"),
    workExperience: z.coerce.number().min(0).max(100),
    volunteerDescription: z.string().min(1, "Добавьте немного информации о себе"),
});

export default function VolunteerForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [, setMessageType] = useState<"success" | "error" | null>(null);

    const {
        control,
        register: registerValidator,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(volunteerSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof volunteerSchema>> = async (data) => {
        try {
            console.log("ТУТТТТТТТТТТТТТ!!!!!!!");
            setIsLoading(true);
            setMessage(null);
            setMessageType(null);

            console.log(data);

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
            console.log(registerData);

            await new Promise((resolve) => setTimeout(resolve, 500));
            // const response = await register(registerData);

            /*if (!response.data.result) {
                setMessage(response.data.errors.map((e) => e.errorMessage).join(",") || "Ошибка регистрации");
                setMessageType("error");
            } else {*/
            addToast({
                title: "Отправление заявки",
                description: "Мы отправили заявку на регистрацию Вас как волонтёра",
                color: "success",
                timeout: 5000,
                shouldShowTimeoutProgress: true,
            });
            //}
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
                <Input
                    label="Телефон"
                    type="number"
                    variant="bordered"
                    inputMode="tel"
                    {...registerValidator("phoneNumber")}
                    isInvalid={!!errors.phoneNumber}
                    errorMessage={errors.phoneNumber?.message}
                />
                <Controller
                    name="workExperience"
                    control={control}
                    render={({ field, fieldState }) => (
                        <NumberInput
                            label="Волонтёрский опыт"
                            variant="bordered"
                            type="number"
                            minValue={0}
                            maxValue={100}
                            value={field.value}
                            onChange={field.onChange}
                            isInvalid={!!fieldState.error}
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
                {message && <Alert color={"danger"} title={message} />}
                <Button type="submit" color="success" isLoading={isLoading} fullWidth className="mt-6">
                    Подать заявку
                </Button>
            </div>
        </form>
    );
}
