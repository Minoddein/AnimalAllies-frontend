export interface RegisterProps {
    email: string;
    userName: string;
    firstName: string;
    secondName: string;
    patronymic: string | null;
    password: string;
}

export const api = {
    async register(data: RegisterProps): Promise<Response> {
        return await fetch(`http://localhost:8080/api/Account/registration`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    },
};
