import { AdminProfile } from "@/api/response/adminProfile";
import { ParticipantAccount } from "@/api/response/participantAccount";
import { Role } from "@/api/response/role";

export interface UserResponse {
    id: string;
    userName: string;
    email: string;
    photo: string | null;
    isBanned: boolean;
    roles: Role[];
    participantAccount: ParticipantAccount | null;
    participantAccountId: string | null;
    adminProfile: AdminProfile | null;
    adminProfileId: string;
}
