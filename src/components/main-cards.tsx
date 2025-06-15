"use client";

import React from "react";

import { Pagination } from "@heroui/react";

interface MainCardsProps<T> {
    isLoading: boolean;
    pageItems: T[];
    totalPages: number;
    page: number;
    setPageAction: (page: number) => void;
    renderCardsAction: (items: T[]) => React.ReactNode;
}

export function MainCards<T>({ pageItems, totalPages, page, setPageAction, renderCardsAction }: MainCardsProps<T>) {
    return (
        <div className="flex-1 p-4">
            {" "}
            {pageItems.length > 0 ? (
                renderCardsAction(pageItems)
            ) : (
                <div className="flex h-full items-center justify-center">
                    <p className="text-secondary text-2xl">Здесь пока ничего нет</p>
                </div>
            )}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination showControls page={page} total={totalPages} onChange={setPageAction} />
                </div>
            )}
        </div>
    );
}
