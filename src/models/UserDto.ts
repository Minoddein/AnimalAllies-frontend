import { SocialNetwork } from "@/models/socialNetwork";
import { Volunteer } from "@/models/volunteer";

export interface UserDto {
    id: string;
    userName: string;
    email: string;
    firstName: string;
    secondName: string;
    patronymic: string | null;
    roles: string[];
    permissions: string[];
    isBanned: boolean;
    socialNetworks: SocialNetwork[];
    volunteerAccount: Volunteer | null;
    avatarUrl?: string;
    avatarLastUpdated?: string;
}
