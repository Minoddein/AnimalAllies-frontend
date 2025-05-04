"use client";

import { api } from "@/api/api";
import { LoginResponse } from "@/models/responses/loginResponse";
import { User } from "@/models/user";
import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { login, logout, refresh } from "@/api/accounts";

interface AuthContextType {
  accessToken: string | undefined;
  user: User | undefined;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  hasRole: (role: string) => boolean | undefined;
  hasPermission: (permission: string) => boolean | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

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

    const user: User = {
      id: response.userId,
      email: response.email,
      userName: response.userName,
      firstName: response.firstName,
      secondName: response.secondName,
      patronymic: response.patronymic,
      roles: response.roles,
      permissions: response.permissions,
    };
    setUser(user);
  };

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
      config.headers.Authorization = accessToken
        ? `Bearer ${accessToken}`
        : config.headers.Authorization;

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
    if (response.data.result?.IsSucess) {
      setAccessToken(undefined);
      setUser(undefined);
    }
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
