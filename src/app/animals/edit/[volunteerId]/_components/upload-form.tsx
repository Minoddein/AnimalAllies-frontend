"use client";

import { v4 as uuidv4 } from "uuid";

import React, { useCallback, useEffect } from "react";

import Image from "next/image";

import { FilePreview } from "@/types/file-preview";
import { Button, ScrollShadow } from "@heroui/react";

interface UploadFormProps {
    files: FilePreview[];
    setFiles: React.Dispatch<React.SetStateAction<FilePreview[]>>;
    onUpload: (files: File[]) => Promise<void>;
    isUploading: boolean;
    onRemoveFile: (id: string, isExisting: boolean) => void;
}

export function UploadForm({ files, setFiles, onUpload, isUploading }: UploadFormProps) {
    const generateId = () => uuidv4();

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const remainingSlots = 20 - files.length;
            const filesToAdd = acceptedFiles.slice(0, remainingSlots);

            const newFiles = filesToAdd.map((file) => {
                const fileWithId = new File([file], file.name, {
                    type: file.type,
                    lastModified: file.lastModified,
                });

                return Object.assign(fileWithId, {
                    preview: URL.createObjectURL(fileWithId),
                    id: generateId(),
                });
            });

            setFiles((prev) => [...prev, ...newFiles]);
        },
        [files.length, setFiles],
    );

    useEffect(() => {
        return () => {
            files.forEach((file) => {
                URL.revokeObjectURL(file.preview);
            });
        };
    }, [files]);

    const removeFile = (id: string) => {
        setFiles((prev) => {
            const newFiles = prev.filter((file) => file.id !== id);
            const removedFile = prev.find((file) => file.id === id);
            if (removedFile) URL.revokeObjectURL(removedFile.preview);
            return newFiles;
        });
    };

    const handleUpload = async () => {
        try {
            await onUpload(files);
            //setFiles([]);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <div className="w-full space-y-4">
            <ScrollShadow className="h-[200px] w-full">
                {files.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center select-none">
                        <Image
                            src="/fun.jpg" // Разместите файл в public/images/fun.jpg
                            alt="Нет изображений"
                            width={250}
                            height={250}
                            className="rounded-lg"
                            draggable={false}
                            onDragStart={(e) => {
                                e.preventDefault();
                            }}
                        />
                    </div>
                ) : (
                    <div className="space-y-2 pr-4">
                        {files.map((file, idx) => (
                            <div
                                key={file.id || `${file.name}-${idx}`}
                                className="bg-muted/50 flex items-center gap-4 rounded-md p-2"
                            >
                                <div className="relative h-16 w-16 flex-shrink-0">
                                    <Image
                                        fill
                                        src={file.preview}
                                        alt={file.name}
                                        className="rounded-md object-cover"
                                        sizes="64px"
                                        unoptimized
                                        draggable={false}
                                        onDragStart={(e) => {
                                            e.preventDefault();
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            removeFile(file.id);
                                        }}
                                        className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="max-w-[145px] min-w-0 flex-1 overflow-hidden">
                                    <p className="truncate text-sm font-medium">{file.name}</p>
                                    <p className="text-muted-foreground truncate text-xs">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollShadow>

            <div className="flex flex-col gap-2 select-none">
                <Button
                    variant="shadow"
                    color="secondary"
                    onPress={() => document.getElementById("file-input")?.click()}
                    disabled={isUploading || files.length >= 20}
                >
                    Выбрать изображения
                    <input
                        id="file-input"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files) {
                                onDrop(Array.from(e.target.files));
                            }
                        }}
                    />
                </Button>

                <Button onPress={() => void handleUpload()} disabled={files.length === 0 || isUploading}>
                    {isUploading ? "Загрузка..." : "Начать загрузку"}
                </Button>
            </div>
        </div>
    );
}
