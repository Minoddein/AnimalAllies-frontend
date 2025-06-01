import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { PagedResponse } from "@/api/requests";
import { Breed } from "@/models/breed";
import { Envelope } from "@/models/envelope";
import { Result, ResultWith } from "@/models/result";
import { Species } from "@/models/species";

export async function getSpecies(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortDirection?: string,
): Promise<AxiosResponse<Envelope<ResultWith<PagedResponse<Species>>>>> {
    return api.get<Envelope<ResultWith<PagedResponse<Species>>>>(`${API_URL}Species`, {
        params: {
            sortBy,
            sortDirection,
            page,
            pageSize,
        },
    });
}

export async function createSpecies(name: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Species`, { name });
}

export async function createBreed(speciesId: string, name: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Species/${speciesId}`, { name });
}

export async function deleteSpecies(speciesId: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.delete<Envelope<Result>>(`${API_URL}Species/${speciesId}`);
}

export async function deleteBreed(speciesId: string, breedId: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.delete<Envelope<Result>>(`${API_URL}Species/${speciesId}/${breedId}`);
}

export async function getBreedsBySpeciesId(
    speciesId: string,
): Promise<AxiosResponse<Envelope<ResultWith<PagedResponse<Breed>>>>> {
    return api.get<Envelope<ResultWith<PagedResponse<Breed>>>>(`${API_URL}Species/${speciesId}`);
}
