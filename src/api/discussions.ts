import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { Discussion } from "@/models/discussion";
import { Envelope } from "@/models/envelope";
import { Result, ResultWith } from "@/models/result";

export async function getDiscussionsByUserId(): Promise<AxiosResponse<Envelope<ResultWith<Discussion[]>>>> {
    return api.get<Envelope<ResultWith<Discussion[]>>>(`${API_URL}Discussion/discussions-by-user-id`, {});
}

export async function getMessagesFromDiscussion(
    relationId: string,
): Promise<AxiosResponse<Envelope<ResultWith<Discussion>>>> {
    return api.get<Envelope<ResultWith<Discussion>>>(`${API_URL}Discussion/messages-by-relation-id`, {
        params: { RelationId: relationId },
    });
}

export async function markAsReadMessages(discussionId: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Discussion/mark-as-read`, {
        DiscussionId: discussionId,
    });
}

export async function postMessage(discussionId: string, text: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Discussion/posting-message`, {
        DiscussionId: discussionId,
        Text: text,
    });
}

export async function editMessage(
    discussionId: string,
    messageId: string,
    text: string,
): Promise<AxiosResponse<Envelope<Result>>> {
    return api.put<Envelope<Result>>(`${API_URL}Discussion/editing-message`, {
        DiscussionId: discussionId,
        MessageId: messageId,
        Text: text,
    });
}

export async function deleteMessage(discussionId: string, messageId: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.post<Envelope<Result>>(`${API_URL}Discussion/deletion-message`, {
        DiscussionId: discussionId,
        MessageId: messageId,
    });
}

export async function closeDiscussion(discussionId: string): Promise<AxiosResponse<Envelope<Result>>> {
    return api.put<Envelope<Result>>(`${API_URL}Discussion/${discussionId}/closing-discussion`, {
        DiscussionId: discussionId,
    });
}
