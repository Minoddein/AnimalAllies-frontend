import axios, { AxiosResponse } from "axios";

import { Envelope } from "@/models/envelope";
import { RegisterProps } from "@/models/requests/RegisterProps";
import { SetNotificationSettingsProps } from "@/models/requests/SetNotificationSettingsProps";
import { LoginResponse } from "@/models/responses/loginResponse";
import { Result } from "@/models/result";

import { API_URL, api } from "./api";

export async function login(email: string, password: string): Promise<AxiosResponse<Envelope<LoginResponse>>> {
    return api.post<Envelope<LoginResponse>>("Account/authentication", {
        email,
        password,
    });
}

export async function register(data: RegisterProps): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>("Account/registration", {
        email: data.email,
        userName: data.userName,
        firstName: data.firstName,
        secondName: data.secondName,
        patronymic: data.patronymic,
        password: data.password,
    });
}

export async function logout(): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>("Account/logout", {});
}

export async function refresh() {
    return axios.post<Envelope<LoginResponse>>(
        `${API_URL}Account/refreshing`,
        {},
        {
            withCredentials: true,
        },
    );
}

export async function setNotificationSettings(
    data: SetNotificationSettingsProps,
): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post(`${API_URL}Account/notifications-settings`, {
        ...data,
    });
}
