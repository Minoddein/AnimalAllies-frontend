import { Envelope } from "@/models/envelope";
import { RegisterProps } from "@/models/requests/RegisterProps";
import { LoginResponse } from "@/models/responses/loginResponse";
import { Result } from "@/models/result";
import axios, { AxiosResponse } from "axios";
import { api, API_URL } from "./api";

export async function login(
  email: string,
  password: string,
): Promise<AxiosResponse<Envelope<LoginResponse>>> {
  return api.post<Envelope<LoginResponse>>("Account/authentication", {
    email,
    password,
  });
}

export async function register(
  data: RegisterProps,
): Promise<AxiosResponse<Envelope<Result>>> {
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
