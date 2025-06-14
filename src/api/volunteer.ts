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

export interface Skill {
    skillName: string;
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
    skills: Skill[];
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
    searchTerm?: string,
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
                searchTerm,
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

export interface SkillDto {
    skillName: string;
}

export async function updateSkills(id: string, skillsDtos: SkillDto[]): Promise<AxiosResponse<Envelope<Result>>> {
    return api.put<Envelope<Result>>(`${API_URL}Volunteer/${id}/skills`, { skillsDtos });
}

interface FullNameDto {
    firstName: string;
    secondName: string;
    patronymic?: string | null;
}

export interface UpdateVolunteerMainInfoDto {
    fullName: FullNameDto;
    workExperience: number;
    phoneNumber: string;
}

export async function updateVolunteer(
    id: string,
    dto: UpdateVolunteerMainInfoDto,
): Promise<AxiosResponse<Envelope<Result>>> {
    return api.put<Envelope<Result>>(`${API_URL}Volunteer/${id}/main-info`, { dto });
}
