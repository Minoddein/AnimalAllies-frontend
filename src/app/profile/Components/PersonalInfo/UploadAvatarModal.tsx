import { ChangeEvent, useRef, useState } from "react";

import { uploadAvatar } from "@/api/accounts";
import { getDownloadPresignedUrl } from "@/api/files";
import { useAuth } from "@/hooks/useAuth";
import {
    Button,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Progress,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export function UploadAvatarModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, updateUserAvatar } = useAuth();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!/image.*/.exec(file.type)) {
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadFileToS3 = async (presignedUrl: string, file: File) => {
        return fetch(presignedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        });
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            console.log(selectedFile.type);
            const response = await uploadAvatar(selectedFile.name, selectedFile.type);
            if (!response.data.result) {
                throw new Error("Failed to upload");
            }
            const uploadResponse = await uploadFileToS3(response.data.result.value!.uploadAvatarUrl, selectedFile);
            if (!uploadResponse.ok) {
                throw new Error("Failed to upload");
            }

            const uploadUrl = response.data.result.value!.uploadAvatarUrl;

            const { fileId, extension } = extractFileInfoFromUrl(uploadUrl);
            const urlResponse = await getDownloadPresignedUrl(fileId, extension);

            console.log(urlResponse.data.downloadUrl);
            await updateUserAvatar(urlResponse.data.downloadUrl);
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setIsUploading(false);
            onClose();
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <div className="relative cursor-pointer" onClick={onOpen} title="Сменить аватар">
                <Image
                    src={user?.avatarUrl ?? "https://i.pravatar.cc/150?u=a04258114e29026708c"}
                    alt="User avatar"
                    className="h-32 w-32 rounded-full border-2 border-gray-200 transition-opacity hover:opacity-80"
                />
                <div className="bg-opacity-0 hover:bg-opacity-30 absolute inset-0 flex items-center justify-center rounded-full bg-black transition-all">
                    <Icon
                        icon="mdi:camera"
                        className="text-2xl text-white opacity-0 transition-opacity hover:opacity-100"
                    />
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Загрузка аватарки</ModalHeader>
                    <ModalBody className="flex flex-col items-center gap-4">
                        <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-gray-200">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                    <Icon icon="mdi:account" className="text-5xl text-gray-400" />
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                        />

                        <Button onPress={triggerFileInput} variant="bordered" startContent={<Icon icon="mdi:upload" />}>
                            Выбрать файл
                        </Button>

                        {selectedFile && (
                            <div className="mt-2 w-full text-center">
                                <p className="text-sm text-gray-600">
                                    Выбран: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                                </p>
                                <p className="text-xs text-gray-500">Тип: {selectedFile.type}</p>
                            </div>
                        )}

                        {isUploading && (
                            <>
                                <Progress value={uploadProgress} className="mt-4 w-full" color="primary" />
                                <p className="text-sm text-gray-500">
                                    {uploadProgress < 100 ? "Загрузка..." : "Обработка..."}
                                </p>
                            </>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onPress={onClose} variant="light" disabled={isUploading}>
                            Отмена
                        </Button>
                        <Button
                            onPress={() => {
                                void handleUpload();
                            }}
                            color="primary"
                            isLoading={isUploading}
                            disabled={!selectedFile || isUploading}
                            startContent={!isUploading && <Icon icon="mdi:upload" />}
                        >
                            {isUploading ? "Загрузка..." : "Загрузить"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export const extractFileInfoFromUrl = (url: string) => {
    try {
        const cleanUrl = url.split("?")[0];

        const parts = cleanUrl.split("/");

        const fullFilename = parts[parts.length - 1];

        const lastDotIndex = fullFilename.lastIndexOf(".");
        const fileId = fullFilename.substring(0, lastDotIndex);
        const extension = fullFilename.substring(lastDotIndex + 1);

        return { fileId, extension };
    } catch (error) {
        console.error("Error parsing URL:", error);
        return { fileId: "", extension: "" };
    }
};
