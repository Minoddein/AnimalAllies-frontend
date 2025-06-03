import { Breed } from "@/models/breed";

export interface Species {
    speciesId: string;
    speciesName: string;
    breeds: Breed[] | null;
}
