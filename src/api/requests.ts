import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { Envelope } from "@/models/envelope";
import { RegisterVolunteerProps } from "@/models/requests/RegisterVolunteerProps";
import { Result, ResultWith } from "@/models/result";
import { SocialNetwork } from "@/models/socialNetwork";
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

export async function takeForASubmit(id: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}VolunteerRequests/${id}/taking-request-for-submitting`);
}

export async function rejectRequest(id: string, rejectComment: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<ResultWith<PagedResponse<VolunteerRequest>>>>(
        `${API_URL}VolunteerRequests/rejecting-request`,
        {
            volunteerRequestId: id,
            rejectComment: rejectComment,
        },
    );
}

export async function getVolunteerRequestsByAdminId(
    page: number,
    pageSize: number,
    status?: string,
    sortBy?: string,
    sortDirection?: string,
): Promise<AxiosResponse<Envelope<ResultWith<PagedResponse<VolunteerRequest>>>>> {
    return api.get<Envelope<ResultWith<PagedResponse<VolunteerRequest>>>>(
        `${API_URL}VolunteerRequests/filtered-volunteer-requests-by-admin-id-with-pagination`,
        {
            params: {
                requestStatus: status,
                sortBy: sortBy,
                sortDirection: sortDirection,
                page: page,
                pageSize: pageSize,
            },
        },
    );
}

export async function getVolunteerRequestsByUserId(
    page: number,
    pageSize: number,
    status?: string,
    sortBy?: string,
    sortDirection?: string,
): Promise<AxiosResponse<Envelope<ResultWith<PagedResponse<VolunteerRequest>>>>> {
    return api.get<Envelope<ResultWith<PagedResponse<VolunteerRequest>>>>(
        `${API_URL}VolunteerRequests/filtered-volunteer-requests-by-user-id-with-pagination`,
        {
            params: {
                requestStatus: status,
                sortBy: sortBy,
                sortDirection: sortDirection,
                page: page,
                pageSize: pageSize,
            },
        },
    );
}

export async function approveVolunteerRequest(volunteerRequestId: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<ResultWith<PagedResponse<VolunteerRequest>>>>(
        `${API_URL}VolunteerRequests/${volunteerRequestId}approving-request`,
    );
}

export async function sendForRevision(
    volunteerRequestId: string,
    rejectComment: string,
): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}VolunteerRequests/sending-for-revision`, {
        volunteerRequestId,
        rejectComment,
    });
}

export async function updateVolunteerRequest(
    volunteerRequestId: string,
    data: {
        firstName?: string;
        secondName?: string;
        patronymic?: string;
        email?: string;
        phoneNumber?: string;
        workExperience?: number;
        volunteerDescription?: string;
        socialNetworks?: SocialNetwork[];
    },
): Promise<AxiosResponse<Envelope<Result>>> {
    return api.put<Envelope<Result>>(`${API_URL}VolunteerRequests/update-volunteer-request`, {
        volunteerRequestId: volunteerRequestId,
        ...data,
    });
}
