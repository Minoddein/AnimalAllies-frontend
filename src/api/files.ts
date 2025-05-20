import { AxiosResponse } from "axios";

import { FILES_URL, filesApi } from "@/api/api";

export async function getDownloadPresignedUrl(
    fileId: string,
    extension: string,
): Promise<AxiosResponse<{ downloadUrl: string }>> {
    return filesApi.post<{ downloadUrl: string }>(`${FILES_URL}files/presigned-for-downloading`, {
        bucketName: "photos",
        fileId: fileId,
        extension: extension,
    });
}

export async function getDeletePresignedUrl(data: DeleteRequest[]): Promise<AxiosResponse<{ deleteUrl: string }>> {
    return filesApi.post(`${FILES_URL}files/presigned-for-deletion`, {
        requests: data,
    });
}

export interface DeleteRequest {
    bucketName: string;
    fileId: string;
    extension: string;
}
