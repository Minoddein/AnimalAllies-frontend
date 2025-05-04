import { Envelope } from "@/models/envelope";
import { RegisterProps } from "@/models/requests/RegisterProps";
import { LoginResponse } from "@/models/responses/loginResponse";
import { Result } from "@/models/result";
import axios, { AxiosResponse } from "axios";
import { api, API_URL } from "./api";

export class AccountsService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<Envelope<LoginResponse>>> {
    return api.post<Envelope<LoginResponse>>("Account/authentication", {
      email,
      password,
    });
  }

  static async register(
    data: RegisterProps
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

  static async refresh() {
    return axios.post<Envelope<LoginResponse>>(
      `${API_URL}Account/refreshing`,
      {},
      {
        withCredentials: true,
      }
    );
  }
}
