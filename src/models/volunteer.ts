import { Certificate } from "@/models/certificate";
import { Requisite } from "@/models/requisite";

export interface Volunteer {
    id: string;
    experience: number;
    certificates: Certificate[];
    requisites: Requisite[];
}
