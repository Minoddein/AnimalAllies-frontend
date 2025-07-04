"use client";

import { AxiosError, InternalAxiosRequestConfig } from "axios";

import { createContext, useEffect, useLayoutEffect, useRef, useState } from "react";

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

interface FailedQueueItem {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}

export const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useState<string | undefined>();
    const [user, setUser] = useState<User | undefined>();
    const [, setIsLoading] = useState(false);
    const [, setIsError] = useState(false);
    const didRun = useRef(false);

    const initData = (response: LoginResponse) => {
        const savedAvatarUrl = typeof window !== "undefined" ? localStorage.getItem(`avatar_${response.userId}`) : null;
        const savedAvatarUpdated = localStorage.getItem("avatarLastUpdated");

        const user: User = {
            id: response.userId,
            email: response.email,
            userName: response.userName,
            firstName: response.firstName,
            secondName: response.secondName,
            patronymic: response.patronymic,
            roles: response.roles,
            permissions: response.permissions,
            isBanned: response.isBanned,
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
            avatarLastUpdated: savedAvatarUpdated ?? new Date().toISOString(),
        };

        setAccessToken(response.accessToken);
        setUser(user);

        sessionStorage.setItem("accessToken", response.accessToken);
        sessionStorage.setItem("user", JSON.stringify(user));
    };

    const updateUserAvatar = async (avatarUrl: string) => {
        if (!user) return;

        if (user.avatarUrl) {
            const { fileId, extension } = extractFileInfoFromUrl(user.avatarUrl);
            const deleteResponse = await getDeletePresignedUrl([
                { bucketName: "photos", fileId, extension: `.${extension}` },
            ]);
            await fetch(deleteResponse.data.deleteUrl, { method: "DELETE" });
        }

        const updatedUser = {
            ...user,
            avatarUrl,
            avatarLastUpdated: new Date().toISOString(),
        };

        setUser(updatedUser);
        localStorage.setItem(`avatar_${user.id}`, avatarUrl);
        localStorage.setItem("avatarLastUpdated", updatedUser.avatarLastUpdated);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const hasRole = (role: string) => user?.roles.includes(role);
    const hasPermission = (permission: string) => user?.permissions.includes(permission);

    useEffect(() => {
        const checkAndRefreshAvatar = async () => {
            if (!user?.avatarUrl) return;

            const lastUpdated = localStorage.getItem("avatarLastUpdated") ?? new Date(Date.now()).toISOString();
            const expiryDate = new Date(lastUpdated);
            expiryDate.setDate(expiryDate.getDate() + 30);

            if (new Date() > expiryDate) {
                const { fileId, extension } = extractFileInfoFromUrl(user.avatarUrl);
                const urlResponse = await getDownloadPresignedUrl(fileId, extension);
                await updateUserAvatar(urlResponse.data.downloadUrl);
            }
        };

        void checkAndRefreshAvatar();
        const interval = setInterval(() => {
            void checkAndRefreshAvatar();
        }, 3600000);
        return () => {
            clearInterval(interval);
        };
    }, [updateUserAvatar, user]);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const initializeAuth = async () => {
            try {
                const storedToken = sessionStorage.getItem("accessToken");
                const storedUser = sessionStorage.getItem("user");

                if (storedToken && storedUser) {
                    setAccessToken(storedToken);
                    setUser(JSON.parse(storedUser) as User);
                }

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
            api.interceptors.request.eject(accessTokenInterceptor);
        };
    }, [accessToken]);

    useLayoutEffect(() => {
        let isRefreshing = false;
        let failedQueue: FailedQueueItem[] = [];

        const processQueue = (error: unknown, token?: string) => {
            failedQueue.forEach((promise) => {
                if (error) {
                    promise.reject(error);
                } else {
                    promise.resolve(token!);
                }
            });
            failedQueue = [];
        };

        const refreshInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

                // Если ошибка не 401 или запрос на /refreshing - пропускаем
                if (error.response?.status !== 401 || originalRequest.url === "/api/Account/refreshing") {
                    return Promise.reject(new Error("Unauthorized"));
                }

                // Если уже обновляем токен - ставим запрос в очередь
                if (isRefreshing) {
                    return new Promise<string>((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.set("Authorization", `Bearer ${token}`);
                            return api(originalRequest);
                        })
                        .catch((err: unknown) => Promise.reject(err as Error));
                }

                // Запускаем обновление токена
                isRefreshing = true;
                try {
                    const response = await refresh();
                    const newAccessToken = response.data.result?.accessToken;

                    if (!newAccessToken) throw new Error("No access token");

                    setAccessToken(newAccessToken);
                    sessionStorage.setItem("accessToken", newAccessToken);

                    api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

                    // Повторяем запросы из очереди
                    processQueue(null, newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return await api(originalRequest);
                } catch (refreshError: unknown) {
                    // Если refresh не удался - разлогиниваем
                    processQueue(refreshError);
                    await handleLogout();
                    window.location.href = "/login";
                    return await Promise.reject(refreshError as Error);
                } finally {
                    isRefreshing = false;
                }
            },
        );

        return () => {
            api.interceptors.response.eject(refreshInterceptor);
        };
    }, []);

    /*useLayoutEffect(() => {
        let isRefreshing = false;
        let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

        const processQueue = (error: any, token?: string) => {
            failedQueue.forEach((promise) => {
                if (error) {
                    promise.reject(error);
                } else {
                    promise.resolve(token!);
                }
            });
            failedQueue = [];
        };

        const refreshInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Если ошибка не 401 или запрос на /refreshing - пропускаем
                if (error.response?.status !== 401 || originalRequest.url === "/api/Account/refreshing") {
                    return Promise.reject(new Error("Unauthorized"));
                }

                // Если уже обновляем токен - ставим запрос в очередь
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return api(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                // Запускаем обновление токена
                isRefreshing = true;
                try {
                    const response = await refresh();
                    const newAccessToken = response.data.result?.accessToken;

                    if (!newAccessToken) throw new Error("No access token");

                    setAccessToken(newAccessToken);
                    sessionStorage.setItem("accessToken", newAccessToken);

                    api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

                    // Повторяем запросы из очереди
                    processQueue(null, newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return await api(originalRequest);
                } catch (refreshError) {
                    // Если refresh не удался - разлогиниваем
                    processQueue(refreshError);
                    await handleLogout();
                    window.location.href = "/";
                    return await Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            },
        );

        return () => {
            api.interceptors.response.eject(refreshInterceptor);
        };
    }, []);*/

    const handleLogout = async () => {
        const response = await logout();
        if (response.data.result?.isSuccess) {
            setAccessToken(undefined);
            setUser(undefined);
            sessionStorage.clear();
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

            if (!response.data.result) throw new Error("auth error");

            initData(response.data.result);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            setIsError(true);
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
