import axios, { AxiosResponse } from "axios";

import { PagedResponse } from "@/api/requests";
import { UserResponse } from "@/api/response/userResponse";
import { UserDto } from "@/models/UserDto";
import { Certificate } from "@/models/certificate";
import { Envelope } from "@/models/envelope";
import { RegisterProps } from "@/models/requests/RegisterProps";
import { SetNotificationSettingsProps } from "@/models/requests/SetNotificationSettingsProps";
import { UpdateProfileProps } from "@/models/requests/UpdateProfileProps";
import { Requisite } from "@/models/requisite";
import { LoginResponse } from "@/models/responses/loginResponse";
import { UploadUrlResponse } from "@/models/responses/uploadUrlResponse";
import { Result, ResultWith } from "@/models/result";
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
        experience: data.experience,
    });
}

export async function updateCertificates(
    data: (
        | Certificate
        | {
              title: string;
              description: string;
              issuingOrganization: string;
              issueDate: string;
              expirationDate: string;
          }
    )[],
): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Account/certificates-to-user`, {
        certificates: data,
    });
}

export async function updateRequisites(data: Requisite[]): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Account/requisite-to-user`, {
        requisites: data,
    });
}

export async function uploadAvatar(
    fileName: string,
    contentType: string,
): Promise<AxiosResponse<Envelope<ResultWith<UploadUrlResponse>>>> {
    return api.post<Envelope<ResultWith<UploadUrlResponse>>>(`${API_URL}Account/avatar`, {
        uploadFileDto: {
            bucketName: "photos",
            fileName: fileName,
            contentType: contentType,
        },
    });
}

export interface UsersCount {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    volunteerUsers: number;
}

export async function getUsersCount(): Promise<AxiosResponse<Envelope<ResultWith<UsersCount>>>> {
    return api.get<Envelope<ResultWith<UsersCount>>>(`${API_URL}Account/`);
}

export async function getUsersByPage(
    page: number,
    pageSize: number,
): Promise<AxiosResponse<Envelope<ResultWith<PagedResponse<UserResponse>>>>> {
    return api.get<Envelope<ResultWith<PagedResponse<UserResponse>>>>(`${API_URL}Account/all-users-by-page`, {
        params: { page, pageSize },
    });
}

export async function getUserById(id: string): Promise<AxiosResponse<Envelope<ResultWith<UserDto>>>> {
    return api.get<Envelope<ResultWith<UserDto>>>(`${API_URL}Account/${id}`);
}

export async function BanUser(userId: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<ResultWith<PagedResponse<UserResponse>>>>(`${API_URL}Account/ban-user`, {
        UserId: userId,
    });
}
