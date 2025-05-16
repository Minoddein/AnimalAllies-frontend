"use client";

import React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";

interface Props {
    label: string;
    isOpen: boolean;
    onOpenChangeAction: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
    contentClassName?: string;
}

export default function ModalOrDrawer({ label, isOpen, onOpenChangeAction, children, size, contentClassName }: Props) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop
        ? ShowDialog({ label, isOpen, onOpenChangeAction, children, size, contentClassName })
        : ShowDrawer({ label, isOpen, onOpenChangeAction, children, size, contentClassName });
}

function ShowDialog({ label, isOpen, onOpenChangeAction, children, size = "md", contentClassName }: Props) {
    return (
        <Modal
            backdrop="blur"
            scrollBehavior="outside"
            isOpen={isOpen}
            onOpenChange={onOpenChangeAction}
            size={size}
            className={contentClassName}
        >
            <ModalContent>
                <ModalHeader className="text-center text-2xl">{label}</ModalHeader>
                <ModalBody className="p-5">{children}</ModalBody>
            </ModalContent>
        </Modal>
    );
}

function ShowDrawer({ label, isOpen, onOpenChangeAction, children, size = "full", contentClassName }: Props) {
    return (
        <Drawer
            placement="bottom"
            size={size}
            isOpen={isOpen}
            onOpenChange={onOpenChangeAction}
            className={contentClassName}
        >
            <DrawerContent className="p-4">
                <DrawerHeader className="text-center text-2xl">{label}</DrawerHeader>
                <DrawerBody>{children}</DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
