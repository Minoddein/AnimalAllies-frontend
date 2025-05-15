import axios, { AxiosResponse } from "axios";

import { Envelope } from "@/models/envelope";
import { RegisterProps } from "@/models/requests/RegisterProps";
import { SetNotificationSettingsProps } from "@/models/requests/SetNotificationSettingsProps";
import { UpdateProfileProps } from "@/models/requests/UpdateProfileProps";
import { LoginResponse } from "@/models/responses/loginResponse";
import { Result } from "@/models/result";
import { SocialNetwork } from "@/models/socialNetwork";

import { API_URL, NOTIFICATION_URL, api, notificationApi } from "./api";

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

export async function getNotificationSettings(userId: string) {
    return notificationApi.get<{
        id: string;
        userId: string;
        emailNotifications: boolean;
        telegramNotifications: boolean;
        webNotifications: boolean;
    }>(`${NOTIFICATION_URL}Notifications/user-notification-settings/${userId}`, {});
}

export async function updateSocialNetworks(socialNetworks: SocialNetwork[]) {
    return api.post(`${API_URL}Account/social-networks-to-user`, {
        socialNetworkRequests: socialNetworks.map(({ title, url }) => ({ title, url })),
    });
}

export async function updateProfile(data: UpdateProfileProps): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Account/updating-info`, {
        firstName: data.firstName,
        secondName: data.secondName,
        patronymic: data.patronymic,
        phone: data.phone,
    });
}
