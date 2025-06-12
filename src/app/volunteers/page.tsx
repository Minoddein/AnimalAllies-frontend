"use client";

import { Award, Clock, Users } from "lucide-react";

import { useState } from "react";

import VolunteerSearch from "@/app/volunteers/components/volunteer-search";
import VolunteersList from "@/app/volunteers/components/volunteers-list";

export default function VolunteersPage() {
    const [searchParams, setSearchParams] = useState({
        searchTerm: "",
        experienceFrom: undefined as number | undefined,
        experienceTo: undefined as number | undefined,
    });
    const handleSearch = (searchTerm: string, experienceFrom: number | undefined, experienceTo: number | undefined) => {
        setSearchParams({ searchTerm, experienceFrom, experienceTo });
    };

    return (
        <div className="gradient-bg min-h-screen pl-10">
            <div className="container py-8 pl-4">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <h1 className="from-primary mb-4 bg-gradient-to-r to-green-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                        Наши волонтёры
                    </h1>
                    <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
                        Познакомьтесь с удивительными людьми, которые посвящают своё время помощи животным
                    </p>

                    {/* Stats */}
                    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="glass-effect rounded-2xl p-6">
                            <Users className="text-primary mx-auto mb-2 h-8 w-8" />
                            <div className="text-2xl font-bold">150+</div>
                            <div className="text-muted-foreground text-sm">Активных волонтёров</div>
                        </div>
                        <div className="glass-effect rounded-2xl p-6">
                            <Award className="text-primary mx-auto mb-2 h-8 w-8" />
                            <div className="text-2xl font-bold">500+</div>
                            <div className="text-muted-foreground text-sm">Животных пристроено</div>
                        </div>
                        <div className="glass-effect rounded-2xl p-6">
                            <Clock className="text-primary mx-auto mb-2 h-8 w-8" />
                            <div className="text-2xl font-bold">2000+</div>
                            <div className="text-muted-foreground text-sm">Часов помощи</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <VolunteerSearch
                            onSearch={handleSearch}
                            initialSearchTerm={searchParams.searchTerm}
                            initialExperienceFrom={searchParams.experienceFrom}
                            initialExperienceTo={searchParams.experienceTo}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <VolunteersList
                            searchTermProps={searchParams.searchTerm}
                            experienceFromProps={searchParams.experienceFrom}
                            experienceToProps={searchParams.experienceTo}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
