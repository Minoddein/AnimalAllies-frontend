import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { PagedResponse } from "@/api/requests";
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
            SortBy: sortBy,
            SortDirection: sortDirection,
            Page: page,
            PageSize: pageSize,
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

export async function getAllSpeciesWithBreeds(): Promise<AxiosResponse<Envelope<ResultWith<Species[]>>>> {
    return api.get<Envelope<ResultWith<Species[]>>>(`${API_URL}Species/all-species-with-breeds`);
}

export async function getSpeciesWithBreedsBySearchTerm(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortDirection?: string,
    searchTerm?: string,
): Promise<AxiosResponse<Envelope<ResultWith<PagedResponse<Species>>>>> {
    return api.get<Envelope<ResultWith<PagedResponse<Species>>>>(`${API_URL}Species/by-search-term`, {
        params: {
            SearchTerm: searchTerm,
            SortBy: sortBy,
            SortDirection: sortDirection,
            Page: page,
            PageSize: pageSize,
        },
    });
}

interface TotalCountSpeciesAndBreedsResponse {
    speciesCount: number;
    breedCount: number;
}

export async function getSpeciesAndBreedsTotalCount(): Promise<
    AxiosResponse<Envelope<ResultWith<TotalCountSpeciesAndBreedsResponse>>>
> {
    return api.get<Envelope<ResultWith<TotalCountSpeciesAndBreedsResponse>>>(`${API_URL}Species/total-count`);
}
