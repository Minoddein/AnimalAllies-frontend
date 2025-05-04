import { AccountsService } from "@/api/accounts";
import { api } from "@/api/api";
import { LoginResponse } from "@/models/responses/loginResponse";
import { User } from "@/models/user";
import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { boolean } from "zod";

type AuthContextType = {
  accessToken: string | undefined;
  user: User | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => Boolean;
  hasPermission: (permission: string) => Boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type Props = { children: React.ReactNode };

export const AuthProvider = ({ children }: Props) => {
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [user, setUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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
    return user?.roles?.includes(role) || false;
  };

  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || false;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await AccountsService.refresh();
        initData(response.data.result!);
      } catch (error) {
        console.log("Auto-refresh failed");
      }
    };

    initializeAuth();
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
      async (error) => {
        if (error.response?.status === 401) {
          const originalRequest = error.config;

          try {
            const response = await AccountsService.refresh();
            initData(response.data.result!);

            originalRequest.headers.Authorization = `Bearer ${response.data.result!.accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            setAccessToken(undefined);
            setUser(undefined);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(refreshInterceptor);
  }, []);

  const logout = async () => {
    const response = await AccountsService.logout();
    console.log(response);
    if (response.data.result?.IsSucess) {
      setAccessToken(undefined);
      setUser(undefined);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await AccountsService.login(email, password);
      setIsLoading(false);

      if (!response.data.result) {
        throw new Error("auth error");
      } else {
        initData(response.data.result!);

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
      value={{ accessToken, user, login, logout, hasRole, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};
