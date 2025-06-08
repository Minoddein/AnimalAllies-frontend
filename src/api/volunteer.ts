import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { PagedResponse } from "@/api/requests";
import { Envelope } from "@/models/envelope";
import { Result, ResultWith } from "@/models/result";

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
    relationId: string;
    requisites: Requisite[];
}

export interface VolunteerDto {
    id: string;
    firstName: string;
    secondName: string;
    patronymic: string;
    phoneNumber: string;
    email: string;
    workExperience: number;
    avatarUrl: string;
    userId: string;
    isDeleted: boolean;
    description: string;
    animalsCount: number;
}

export async function createVolunteer(data: VolunteerCreateDto): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Volunteer`, data);
}

export async function getVolunteersWithPagination(
    page: number,
    pageSize: number,
    firstName?: string,
    secondName?: string,
    patronymic?: string,
    workExperienceFrom?: number,
    workExperienceTo?: number,
    sortBy?: string,
    sortDirection?: string,
): Promise<AxiosResponse<Envelope<ResultWith<PagedResponse<VolunteerDto>>>>> {
    return api.get<Envelope<ResultWith<PagedResponse<VolunteerDto>>>>(
        `${API_URL}Volunteer/get-volunteers-with-pagination-dapper`,
        {
            params: {
                page,
                pageSize,
                firstName,
                secondName,
                patronymic,
                workExperienceFrom,
                workExperienceTo,
                sortBy,
                sortDirection,
            },
        },
    );
}

export async function getVolunteerById(id: string): Promise<AxiosResponse<Envelope<ResultWith<VolunteerDto>>>> {
    return api.get<Envelope<ResultWith<VolunteerDto>>>(`${API_URL}Volunteer/${id}`);
}
