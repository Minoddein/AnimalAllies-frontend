import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { PagedResponse } from "@/api/requests";
import { Envelope } from "@/models/envelope";
import { Result, ResultWith } from "@/models/result";

import { AddPetRequest, PetDto } from "./dtos/pet/petDtos";

export async function addPetToVolunteer(
    volunteerId: string,
    request: AddPetRequest,
): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Volunteer/${volunteerId}/pet`, request);
}

export async function getPetWithPaginationByVolunteerId(
    volunteerId: string,
    pageSize: number,
    page: number,
): Promise<AxiosResponse<Envelope<ResultWith<PagedResponse<PetDto>>>>> {
    return api.get<Envelope<ResultWith<PagedResponse<PetDto>>>>(`${API_URL}Volunteer/${volunteerId}/pet-dapper`, {
        params: {
            pageSize,
            page,
        },
    });
}
