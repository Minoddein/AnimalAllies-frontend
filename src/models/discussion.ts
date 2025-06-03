import { Message } from "@/models/message";

export interface Discussion {
    id: string;
    firstMember: string;
    secondMember: string;
    firstMemberName: string;
    firstMemberSurname: string;
    secondMemberName: string;
    secondMemberSurname: string;
    lastMessage: string;
    lastMessageDate: Date;
    unreadMessagesCount: number;
    relationId: string;
    discussionStatus: string;
    messages: Message[] | null;
}
