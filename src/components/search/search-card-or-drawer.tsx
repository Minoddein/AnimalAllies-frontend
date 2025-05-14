"use client";

import * as React from "react";

import {useMediaQuery} from "@/hooks/use-media-query";
import {Tab} from "@/types/tabs";
import type {SearchAnimalsParams} from "@/types/search";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    useDisclosure
} from "@heroui/react";
import {Icon} from "@iconify/react";

import {SearchAnimalsForm} from "./search-animals-form";

// Убедитесь что тип определен

interface Props {
    onSearchAction: (params: SearchAnimalsParams) => void;
    tabType: Tab;
}

export function SearchCardOrDrawer({onSearchAction, tabType}: Props) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop
        ? SearchCard({onSearchAction, tabType})
        : SearchDrawer({isOpen, onOpen, onOpenChange, onSearchAction, tabType});
}

function SearchCard({onSearchAction, tabType}: { onSearchAction: Props["onSearchAction"]; tabType: Tab }) {
    return (
        <div className="w-full p-4 sm:w-1/4">
            <Card className="sticky top-20">
                <CardHeader className="text-xl">Поиск</CardHeader>
                <CardBody>
                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                        <SearchAnimalsForm onSubmitAction={onSearchAction} tabType={tabType}/>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

interface DrawerProps extends Props {
    isOpen: boolean;
    onOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    tabType: Tab;
}

function SearchDrawer({isOpen, onOpen, onOpenChange, onSearchAction, tabType}: DrawerProps) {
    return (
        <>
            <Button
                variant="bordered"
                className="m-4 h-12 w-12"
                onPress={() => {
                    onOpen(true);
                }}
            >
                <span className="flex items-center">
                    <Icon icon="iconoir:search" width={18} height={18} className="mr-1"/>
                </span>
            </Button>
            <Drawer placement="bottom" isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="p-4">
                    <DrawerHeader className="text-center text-2xl">Поиск</DrawerHeader>
                    <DrawerBody>
                        <SearchAnimalsForm onSubmitAction={onSearchAction} tabType={tabType}/>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
