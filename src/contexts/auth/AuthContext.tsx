import { AccountsService } from "@/api/accounts";
import { api } from "@/api/api";
import { User } from "@/models/user";
import { createContext, useEffect, useLayoutEffect, useState } from "react";

type AuthContextType = {
  accessToken: string | undefined;
  user: User | undefined;
  login: (email: string, password: string) => Promise<void>;
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
        if (error.response.status === 401) {
          const originalRequest = error.config;
          try {
            const response = await AccountsService.refresh();

            setAccessToken(response.data.result!.accessToken);

            const user: User = {
              id: response.data.result!.userId,
              email: response.data.result!.email,
              userName: response.data.result!.userName,
              firstName: response.data.result!.firstName,
              secondName: response.data.result!.secondName,
              patronymic: response.data.result?.patronymic,
            };

            setUser(user);

            originalRequest.headers.Authorization = `Bearer ${response.data.result!.accessToken}`;

            return api(originalRequest);
          } catch {
            setAccessToken(undefined);
            setUser(undefined);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await AccountsService.login(email, password);
      setIsLoading(false);

      if (!response.data.result) {
        throw new Error("auth error");
      } else {
        setAccessToken(response.data.result!.accessToken);

        const user: User = {
          id: response.data.result!.userId,
          email: response.data.result!.email,
          userName: response.data.result!.userName,
          firstName: response.data.result!.firstName,
          secondName: response.data.result!.secondName,
          patronymic: response.data.result?.patronymic,
        };

        setUser(user);

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
    <AuthContext.Provider value={{ accessToken, user, login }}>
      {children}
    </AuthContext.Provider>
  );
};
