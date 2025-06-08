import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { Envelope } from "@/models/envelope";
import { Result } from "@/models/result";

interface FullName {
    firstName: string;
    secondName: string;
    patronymic?: string;
}

interface Requisite {
    title: string;
    description: string;
}

export interface VolunteerCreateDto {
    fullName: FullName;
    email: string;
    description: string;
    workExperience: number;
    phoneNumber: string;
    requisites: Requisite[];
}

export async function createVolunteer(data: VolunteerCreateDto): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Volunteer`, data);
}
