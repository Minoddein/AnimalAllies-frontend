"use client";

import React, {useEffect, useMemo, useState} from "react";

import {AnimalItem} from "@/types/AnimalItem";
import {MainCards} from "@/components/main-cards";
import Header from "@/components/header";
import AnimalsCards from "@/app/animals/_components/animals-cards"
import {Tab} from "@/types/tabs";
import {SearchCardOrDrawer} from "@/components/search/search-card-or-drawer";
import {SearchAnimalsParams} from "@/types/search";

interface Paged<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

export default function AnimalsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("animals");
    const [isLoading] = useState(false);
    const [animalsData, setAnimalsData] = useState<Paged<AnimalItem> | null>(null);
    const [page, setPage] = useState(1);
    const [searchParamsState, setSearchParamsState] = useState<SearchAnimalsParams>();

    const perPage = 8;

    useEffect(() => {
        setAnimalsData({
            items: Array.from({length: 14}, (_, index) => ({
                id: `id-${index}`,
                name: `Барсик-${index + 1}`,
                image: `https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1ueISv.img?w=1280&h=857&m=4&q=91`,
                age: `${index + 1} лет 2 месяца`,
                isVaccinated: index % 2 === 0,
                humanAttitude: 'Хорошее',
                animalsAttitude: 'Хорошее',
                hashtags: ['#м', '#пушистый', '#домашний']
            })),
            pagination: {
                page,
                pageSize: perPage,
                totalItems: 14,
                totalPages: 2,
            },
        });

    }, [page]);

    // Обработчик поиска
    const handleSearch = (params: SearchAnimalsParams) => {
        setSearchParamsState(params);
        console.log(searchParamsState);
        setPage(1);
    };

    const animalsPageItems = useMemo(() => {
        if (!animalsData) return [];
        const start = (page - 1) * animalsData.pagination.pageSize;
        const end = start + animalsData.pagination.pageSize;

        return animalsData.items.slice(start, end);
    }, [page, animalsData]);

    const totalAnimalsPages = animalsData?.pagination.totalPages ?? 1;

    return (<>
        <Header activeTab={activeTab} setActiveTabAction={setActiveTab}/>
        <div className="flex min-h-[100vh] w-full">
            <SearchCardOrDrawer onSearchAction={handleSearch}/>
            <div className="flex-1 p-4">
                <MainCards<AnimalItem>
                    isLoading={isLoading}
                    pageItems={animalsPageItems}
                    totalPages={totalAnimalsPages}
                    page={page}
                    setPageAction={setPage}
                    renderCardsAction={(items) => <AnimalsCards paginatedData={items}/>}
                />
            </div>
        </div>
    </>)
}


