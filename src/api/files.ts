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

export interface FileKey {
    fileId: string;
    extension: string;
}

export interface ManyDownloadPresignedUrlRequest {
    bucketName: string;
    fileKeys: FileKey[];
}

export async function getManyDownloadPresignedUrls(
    request: ManyDownloadPresignedUrlRequest,
): Promise<AxiosResponse<string[]>> {
    return filesApi.post<string[]>(`${FILES_URL}files/many-presigned-for-downloading`, {
        bucketName: request.bucketName,
        fileKeys: request.fileKeys.map((k) => ({
            FileId: k.fileId,
            Extension: k.extension,
        })),
    });
}
