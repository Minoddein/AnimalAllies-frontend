import { SocialNetwork } from "@/models/socialNetwork";
import { Volunteer } from "@/models/volunteer";

export interface User {
    id: string;
    userName: string;
    email: string;
    firstName: string;
    secondName: string;
    patronymic: string | null | undefined;
    roles: string[];
    permissions: string[];
    isBanned: boolean;
    socialNetworks: SocialNetwork[];
    volunteer: Volunteer | null;
    avatarUrl: string | undefined;
    avatarLastUpdated: string | undefined;
}
