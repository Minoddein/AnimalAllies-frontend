import { AccountsService } from "@/api/accounts";
import { api } from "@/api/api";
import { User } from "@/models/user";
import { createContext, useEffect, useLayoutEffect, useState } from "react";

type AuthContextType = {
  accessToken: string | undefined;
  user: User | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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

  const updateAuthData = (data: any) => {
    setAccessToken(data.accessToken);
    setUser({
      id: data.userId,
      email: data.email,
      userName: data.userName,
      firstName: data.firstName,
      secondName: data.secondName,
      patronymic: data.patronymic,
    });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const response = await AccountsService.refresh();
        if (response.data.result) {
          updateAuthData(response.data.result);
        }
      } catch (error) {
        console.log("Auto-refresh failed");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log(`access interceptor`);
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const response = await AccountsService.refresh();
            if (response.data.result) {
              updateAuthData(response.data.result);
              console.log(`refresh interceptor` + response);
              originalRequest.headers.Authorization = `Bearer ${response.data.result.accessToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            setAccessToken(undefined);
            setUser(undefined);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setIsError(false);

      const response = await AccountsService.login(email, password);
      if (response.data.result) {
        updateAuthData(response.data.result);
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(undefined);
    setUser(undefined);
    // Здесь можно добавить вызов API для logout
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
