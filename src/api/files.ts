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
