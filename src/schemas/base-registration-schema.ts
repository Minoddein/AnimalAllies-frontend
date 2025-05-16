import { z } from "zod";

export const baseRegistrationSchema = z.object({
    email: z.string().min(1, "Email обязателен").email("Некорректный email"),
    nickname: z.string().min(1, "Никнейм обязателен"),
    firstname: z.string().min(1, "Имя обязательно"),
    secondname: z.string().min(1, "Фамилия обязательна"),
    patronymic: z.string(),
});
