import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { Envelope } from "@/models/envelope";
import { RegisterVolunteerProps } from "@/models/requests/RegisterVolunteerProps";
import { Result, ResultWith } from "@/models/result";
import { VolunteerRequest } from "@/models/volunteerRequests";

export interface PagedResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export async function createVolunteerRequest(data: RegisterVolunteerProps): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}VolunteerRequests/creation-volunteer-request`, {
        firstName: data.firstName,
        secondName: data.secondName,
        patronymic: data.patronymic,
        email: data.email,
        phoneNumber: data.phoneNumber,
        workExperience: data.workExperience,
        volunteerDescription: data.volunteerDescription,
    });
}

export async function getVolunteerRequests(
    page: number,
    pageSize: number,
    status?: string,
    sortBy?: string,
    sortDirection?: string,
): Promise<AxiosResponse<Envelope<ResultWith<PagedResponse<VolunteerRequest>>>>> {
    return api.get<Envelope<ResultWith<PagedResponse<VolunteerRequest>>>>(
        `${API_URL}VolunteerRequests/volunteer-requests-in-waiting-with-pagination`,
        {
            params: {
                page,
                pageSize,
                status,
                sortBy,
                sortDirection,
            },
        },
    );
}
