import { Envelope } from "@/models/envelope";
import { RegisterProps } from "@/models/requests/RegisterProps";
import { LoginResponse } from "@/models/responses/loginResponse";
import { Result } from "@/models/result";
import axios, { AxiosResponse } from "axios";

const API_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;

export class AccountsService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<Envelope<LoginResponse>>> {
    return axios.post<Envelope<LoginResponse>>(
      API_URL + "Account/authentication",
      {
        email,
        password,
      }
    );
  }

  static async register(
    data: RegisterProps
  ): Promise<AxiosResponse<Envelope<Result>>> {
    return axios.post<Envelope<Result>>(API_URL + "Account/registration", {
      email: data.email,
      userName: data.userName,
      firstName: data.firstName,
      secondName: data.secondName,
      patronymic: data.patronymic,
      password: data.password,
    });
  }
}
