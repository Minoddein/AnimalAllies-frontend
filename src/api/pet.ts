import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { PagedResponse } from "@/api/requests";
import { Envelope } from "@/models/envelope";
import { Result, ResultWith } from "@/models/result";

import { AddPetRequest, PetDto } from "./dtos/pet/petDtos";

export async function addPetToVolunteer(
    volunteerId: string,
    request: AddPetRequest,
): Promise<AxiosResponse<Envelope<ResultWith<string>>>> {
    return api.post<Envelope<ResultWith<string>>>(`${API_URL}Volunteer/${volunteerId}/pet`, request);
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

export interface UploadFileDto {
    bucketName: string;
    fileName: string;
    contentType: string;
}

export interface AddPetPhotosResponse {
    fileUrls: string[];
}

export async function addPetPhotos(
    volunteerId: string,
    petId: string,
    dtos: UploadFileDto[],
): Promise<AxiosResponse<Envelope<ResultWith<AddPetPhotosResponse>>>> {
    return api.post<Envelope<ResultWith<AddPetPhotosResponse>>>(
        `${API_URL}Volunteer/${volunteerId}/${petId}/petPhoto`,
        {
            Files: dtos,
        },
    );
}

export async function deletePetSoft(volunteerId: string, petId: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.delete<Envelope<Result>>(`${API_URL}Volunteer/${volunteerId}/${petId}/pet-removing-soft`);
}

interface PositionDto {
    position: number;
}

export async function movePet(
    volunteerId: string,
    petId: string,
    position: number,
): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Volunteer/${volunteerId}/${petId}/pet-position`, {
        Position: { position } as PositionDto,
    });
}
