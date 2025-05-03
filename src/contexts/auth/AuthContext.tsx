import { AccountsService } from "@/api/accounts";
import { api } from "@/api/api";
import { User } from "@/models/user";
import { createContext, useState } from "react";

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
  const [refreshToken, setRefreshToken] = useState<string | undefined>();
  const [user, setUser] = useState<User | undefined>();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await AccountsService.login(email, password);
      setIsLoading(false);

      if (!response.data.result) {
        throw new Error("auth error");
      } else {
        setAccessToken(response.data.result!.accessToken);
        setRefreshToken(response.data.result!.refreshToken);
        setIsLoading(false);

        api.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${response.data.result!.accessToken}`;

          return config;
        });

        console.log(response);
      }

      return true;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsError(true);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login }}>
      {children}
    </AuthContext.Provider>
  );
};
