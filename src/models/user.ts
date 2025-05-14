import { SocialNetwork } from "@/models/socialNetwork";

export interface User {
    id: string;
    userName: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    secondName: string;
    patronymic: string | null | undefined;
    roles: string[];
    permissions: string[];
    socialNetworks: SocialNetwork[];
}
