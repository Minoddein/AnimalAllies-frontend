import { AxiosResponse } from "axios";

import { API_URL, api } from "@/api/api";
import { Discussion } from "@/models/discussion";
import { Envelope } from "@/models/envelope";
import { ResultWith } from "@/models/result";

export async function getDiscussionsByUserId(): Promise<AxiosResponse<Envelope<ResultWith<Discussion[]>>>> {
    return api.get<Envelope<ResultWith<Discussion[]>>>(`${API_URL}Discussion/discussions-by-user-id`, {});
}
