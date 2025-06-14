import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { Envelope } from "@/models/envelope";
import { Result } from "@/models/result";

import { AddPetRequest } from "./dtos/pet/petDtos";

export async function addPetToVolunteer(
    volunteerId: string,
    request: AddPetRequest,
): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Volunteer/${volunteerId}/pet`, request);
}
