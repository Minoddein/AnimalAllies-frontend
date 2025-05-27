import { Message } from "@/models/message";

export interface Discussion {
    id: string;
    firstMember: string;
    secondMember: string;
    firstMemberName: string;
    firstMemberSurname: string;
    secondMemberName: string;
    secondMemberSurname: string;
    relationId: string;
    messages: Message[];
}
