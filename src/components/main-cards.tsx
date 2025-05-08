"use client";

import React from "react";

import {CircularProgress, Pagination} from "@heroui/react";

interface MainCardsProps<T> {
    isLoading: boolean;
    pageItems: T[];
    totalPages: number;
    page: number;
    setPageAction: (page: number) => void;
    renderCardsAction: (items: T[]) => React.ReactNode;
}

export function MainCards<T>({
                                 isLoading,
                                 pageItems,
                                 totalPages,
                                 page,
                                 setPageAction,
                                 renderCardsAction,
                             }: MainCardsProps<T>) {
    return (
        <div className="container mx-auto w-full flex-1 px-4 py-8 sm:w-3/4">
            {pageItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? <CircularProgress aria-label="Loading..." size="lg"/> : renderCardsAction(pageItems)}
                </div>
            ) : (
                <div className="content-center justify-center">
                    <p className="text-secondary text-2xl">Здесь пока ничего нет</p>
                </div>
            )}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination showControls page={page} total={totalPages} onChange={setPageAction}/>
                </div>
            )}
        </div>
    );
}
