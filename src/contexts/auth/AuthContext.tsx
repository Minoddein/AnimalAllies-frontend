"use client";

import { AxiosResponse } from "axios";

import { createContext, useEffect, useLayoutEffect, useState } from "react";

import { login, logout, refresh } from "@/api/accounts";
import { api } from "@/api/api";
import { getDeletePresignedUrl, getDownloadPresignedUrl } from "@/api/files";
import { extractFileInfoFromUrl } from "@/app/profile/Components/PersonalInfo/UploadAvatarModal";
import { LoginResponse } from "@/models/responses/loginResponse";
import { User } from "@/models/user";

interface AuthContextType {
    accessToken: string | undefined;
    user: User | undefined;
    handleLogin: (email: string, password: string) => Promise<void>;
    handleLogout: () => Promise<void>;
    hasRole: (role: string) => boolean | undefined;
    hasPermission: (permission: string) => boolean | undefined;
    updateUserData: (response: LoginResponse) => void;
    updateUserAvatar: (avatarUrl: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useState<string | undefined>();
    const [user, setUser] = useState<User | undefined>();
    const [, setIsLoading] = useState(false);
    const [, setIsError] = useState(false);

    const initData = (response: LoginResponse) => {
        setAccessToken(response.accessToken);

        console.log(response);

        const savedAvatarUrl = typeof window !== "undefined" ? localStorage.getItem(`avatar_${response.userId}`) : null;

        const user: User = {
            id: response.userId,
            email: response.email,
            userName: response.userName,
            firstName: response.firstName,
            secondName: response.secondName,
            patronymic: response.patronymic,
            roles: response.roles,
            permissions: response.permissions,
            socialNetworks: response.socialNetworks,
            volunteer: response.volunteerAccount
                ? {
                      id: response.volunteerAccount.id,
                      certificates: response.volunteerAccount.certificates,
                      requisites: response.volunteerAccount.requisites,
                      experience: response.volunteerAccount.experience,
                      phone: response.volunteerAccount.phone,
                  }
                : null,
            avatarUrl: savedAvatarUrl ?? undefined,
            avatarLastUpdated: new Date().toISOString(),
        };
        setUser(user);
    };

    const updateUserAvatar = async (avatarUrl: string) => {
        if (!user) return;

        if (user.avatarUrl) {
            const { fileId, extension } = extractFileInfoFromUrl(user.avatarUrl);
            const deleteResponse = await getDeletePresignedUrl([
                { bucketName: "photos", fileId: fileId, extension: `.${extension}` },
            ]);

            console.log(deleteResponse);

            await fetch(deleteResponse.data.deleteUrl, {
                method: "DELETE",
            });
        }

        setUser({
            ...user,
            avatarUrl: avatarUrl,
            avatarLastUpdated: new Date().toISOString(),
        });
        console.log(avatarUrl);
        localStorage.setItem(`avatar_${user.id}`, avatarUrl);
        localStorage.setItem("avatarLastUpdated", user.avatarLastUpdated!);
    };

    useEffect(() => {
        const checkAndRefreshAvatar = async () => {
            if (!user?.avatarUrl) return;

            const lastUpdated = localStorage.getItem("avatarLastUpdated") ?? new Date(Date.now());
            const expiryDate = new Date(lastUpdated);
            expiryDate.setDate(expiryDate.getDate() + 30);

            if (new Date() > expiryDate) {
                const { fileId, extension } = extractFileInfoFromUrl(user.avatarUrl);
                const urlResponse = await getDownloadPresignedUrl(fileId, extension);
                await updateUserAvatar(urlResponse.data.downloadUrl);
            }
        };

        void checkAndRefreshAvatar();
        const interval = setInterval(() => checkAndRefreshAvatar, 3600000);

        return () => {
            clearInterval(interval);
        };
    }, [updateUserAvatar, user]);

    const hasRole = (role: string) => {
        return user?.roles.includes(role);
    };

    const hasPermission = (permission: string) => {
        return user?.permissions.includes(permission);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const response = await refresh();
                initData(response.data.result!);
            } catch {
                console.log("Auto-refresh failed");
            }
        };

        void initializeAuth();
    }, []);

    useEffect(() => {
        const accessTokenInterceptor = api.interceptors.request.use((config) => {
            config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : config.headers.Authorization;

            return config;
        });

        return () => {
            api.interceptors.response.eject(accessTokenInterceptor);
        };
    }, [accessToken]);

    useLayoutEffect(() => {
        const refreshInterceptor = api.interceptors.response.use(
            (config) => config,
            async (error: AxiosResponse<Response, Error>) => {
                if (error.status === 401) {
                    const originalRequest = error.config;

                    try {
                        const response = await refresh();
                        initData(response.data.result!);

                        originalRequest.headers.Authorization = `Bearer ${response.data.result!.accessToken}`;
                        return await api(originalRequest);
                    } catch {
                        setAccessToken(undefined);
                        setUser(undefined);
                    }
                }
                return Promise.reject(new Error("Unauthorized"));
            },
        );

        return () => {
            api.interceptors.response.eject(refreshInterceptor);
        };
    }, []);

    const handleLogout = async () => {
        const response = await logout();
        console.log(response);
        if (response.data.result?.isSuccess) {
            setAccessToken(undefined);
            setUser(undefined);
        }
    };

    const updateUserData = (response: LoginResponse) => {
        initData(response);
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            setIsLoading(true);

            const response = await login(email, password);
            setIsLoading(false);

            if (!response.data.result) {
                throw new Error("auth error");
            } else {
                initData(response.data.result);

                setIsLoading(false);

                console.log(response);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                user,
                handleLogin,
                handleLogout,
                hasRole,
                hasPermission,
                updateUserData,
                updateUserAvatar,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
