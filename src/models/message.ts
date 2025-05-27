export interface Message {
    messageId: string;
    text: string;
    createdAt: Date;
    isEdited: boolean;
    userId: string;
    firstName: string;
}
