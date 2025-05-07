import {z} from "zod";

export const baseRegistrationSchema = z.object({
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
}).refine((data) => data.password === data.passwordRepeat, {
    message: "Пароли не совпадают",
    path: ["passwordRepeat"],
});