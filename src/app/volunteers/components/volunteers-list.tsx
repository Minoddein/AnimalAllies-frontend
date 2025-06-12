"use client";

import { Clock, Heart, MessageCircle, User } from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";

import { FileKey, getManyDownloadPresignedUrls } from "@/api/files";
import { getVolunteersWithPagination } from "@/api/volunteer";
import { pluralizeYears } from "@/app/profile/Components/ProfessionInfo/experienceDetails";
import { Avatar, Button, Card, CardBody, Chip, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Volunteer {
    id: string;
    userId: string;
    name: string;
    avatar: string;
    /*location: string;*/
    /*joinDate: string;*/
    experience: string;
    skills: string[];
    /*badges: string[];*/
    status: "active" | "inactive";
    /*rating: number;*/
    animalsHelped: number;
    description: string;
}

interface VolunteersListProps {
    searchTermProps: string;
    experienceFromProps?: number | undefined;
    experienceToProps?: number | undefined;
}

export default function VolunteersList({
    searchTermProps,
    experienceFromProps,
    experienceToProps,
}: VolunteersListProps) {
    const [isAsc, setIsAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagedData, setPagedData] = useState<{ items: Volunteer[]; totalCount: number }>({
        items: [],
        totalCount: 0,
    });
    const [searchTerm, setSearchTerm] = useState(searchTermProps);
    const [experienceFrom, setExperienceFrom] = useState<number | undefined>(experienceFromProps);
    const [experienceTo, setExperienceTo] = useState<number | undefined>(experienceToProps);
    const itemsPerPage = 4;

    const totalPages = Math.ceil(pagedData.totalCount / itemsPerPage);

    async function loadVolunteers() {
        try {
            const response = await getVolunteersWithPagination(
                currentPage,
                itemsPerPage,
                undefined,
                undefined,
                undefined,
                searchTerm,
                experienceFrom,
                experienceTo,
                "work_experience",
                isAsc ? "asc" : "desc",
            );
            if (!response.data.result?.value) {
                throw new Error("cannot load volunteers data");
            }

            const mappedVolunteers: Volunteer[] = response.data.result.value.items.map(
                (volunteer) =>
                    ({
                        id: volunteer.id,
                        userId: volunteer.userId,
                        name: volunteer.firstName + " " + volunteer.secondName,
                        avatar: volunteer.avatarUrl,
                        description: volunteer.description,
                        experience:
                            volunteer.workExperience.toString() + " " + pluralizeYears(volunteer.workExperience),
                        animalsHelped: volunteer.animalsCount,
                        joinDate: new Date().toString(),
                        status: "active",
                        skills: volunteer.skills.map((s) => s.skillName),
                    }) as Volunteer,
            );

            const fileKeys: FileKey[] = mappedVolunteers
                .filter((v) => v.avatar)
                .map((v) => {
                    const parts = v.avatar.split(".");
                    return {
                        fileId: parts[0],
                        extension: parts.slice(1).join("."),
                    };
                });

            const responseUrls = await getManyDownloadPresignedUrls({ bucketName: "photos", fileKeys });

            for (let i = 0; i < responseUrls.data.length; i++) {
                mappedVolunteers[i].avatar = responseUrls.data[i];
            }

            setPagedData({ items: mappedVolunteers, totalCount: response.data.result.value.totalCount });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setSearchTerm(searchTermProps);
        setExperienceFrom(experienceFromProps);
        setExperienceTo(experienceToProps);
    }, [searchTermProps, experienceFromProps, experienceToProps]);

    /*const handleSearch = (term: string, from: number | undefined, to: number | undefined) => {
        setSearchTerm(term);
        setExperienceFrom(from);
        setExperienceTo(to);
        setCurrentPage(1);
    };*/

    useEffect(() => {
        void loadVolunteers();
    }, [currentPage, searchTerm, experienceFrom, experienceTo]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Найдено {pagedData.totalCount} волонтёров</h2>
                <div className="flex gap-2">
                    <Button
                        variant="flat"
                        size="md"
                        onPress={() => {
                            void loadVolunteers();
                        }}
                    >
                        По опыту
                    </Button>
                    <Button
                        isIconOnly
                        aria-label="asc-desc"
                        variant="faded"
                        onPress={() => {
                            setIsAsc(!isAsc);
                        }}
                    >
                        <Icon
                            icon={isAsc ? "heroicons-solid:sort-ascending" : "ci:sort-ascending"}
                            className="h-5 w-5"
                        />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {pagedData.items.map((volunteer) => (
                    <Card
                        key={volunteer.id}
                        className="card-hover glass-effect group relative min-h-[320px] overflow-hidden border-0 shadow-lg"
                    >
                        <CardBody className="h-full p-0">
                            {/* Градиент на всю высоту */}
                            <div className="from-primary/10 absolute inset-0 rounded-lg bg-gradient-to-br via-transparent to-green-500/10" />

                            <div className="relative flex h-full flex-col p-6">
                                <div className="flex flex-grow items-start gap-4">
                                    {/* Аватар */}
                                    <div className="relative flex-shrink-0">
                                        <Avatar className="ring-primary/20 h-20 w-20 ring-4" src={volunteer.avatar} />
                                    </div>

                                    {/* Основная информация */}
                                    <div className="flex h-full min-w-0 flex-1 flex-col">
                                        {/* Заголовок и опыт */}
                                        <div>
                                            <h3 className="group-hover:text-primary text-xl font-bold transition-colors">
                                                {volunteer.name}
                                            </h3>
                                            <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{volunteer.experience}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Описание */}
                                        <p className="text-muted-foreground my-4 line-clamp-2 min-h-[40px] text-sm">
                                            {volunteer.description || "\u00A0"}
                                        </p>

                                        {/* Навыки */}
                                        <div className="mb-4 min-h-[56px]">
                                            {volunteer.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {volunteer.skills.slice(0, 5).map((skill, index) => (
                                                        <Chip
                                                            key={`skill-${index}`}
                                                            color="success"
                                                            variant="flat"
                                                            size="sm"
                                                            className="text-xs font-medium"
                                                        >
                                                            {skill}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Кнопки - прижаты к низу */}
                                        <div className="mt-auto">
                                            <div className="mb-4 flex items-center gap-4">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Heart className="h-4 w-4 text-red-500" />
                                                    <span className="font-medium">{volunteer.animalsHelped}</span>
                                                    <span className="text-muted-foreground">животных</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button size="sm" variant="flat" className="flex-1">
                                                    <MessageCircle className="mr-2 h-4 w-4" />
                                                    Написать
                                                </Button>
                                                <Link href={`/volunteers/${volunteer.userId}`} className="flex-1">
                                                    <Button size="sm" className="bg-primary hover:bg-primary/90 w-full">
                                                        <User className="mr-2 h-4 w-4" />
                                                        Профиль
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Пагинация */}
            {pagedData.items.length > 0 && (
                <Pagination
                    className="mt-6 flex justify-center"
                    initialPage={currentPage}
                    page={currentPage}
                    total={totalPages}
                    onChange={(page) => {
                        setCurrentPage(page);
                    }}
                    showControls
                    showShadow={true}
                    siblings={1}
                    boundaries={1}
                />
            )}
        </div>
    );
}
