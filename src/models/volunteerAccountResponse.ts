import { Certificate } from "@/models/certificate";
import { Requisite } from "@/models/requisite";

export interface VolunteerAccountResponse {
    id: string;
    certificates: Certificate[];
    requisites: Requisite[];
    experience: number;
    phone: string;
}
