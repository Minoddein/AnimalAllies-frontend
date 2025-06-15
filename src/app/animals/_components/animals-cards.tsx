"use client";

import { useState } from "react";

import AnimalDetails from "@/app/animals/_components/animal-details";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { AnimalItem } from "@/types/AnimalItem";
import { Card, CardBody, Checkbox, Image, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
    paginatedData: AnimalItem[];
}

export default function AnimalsCards({ paginatedData }: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleClick = (id: string) => {
        setSelected(id);
        onOpen();
    };

    return (
        <>
            {selected && (
                <ModalOrDrawer label="Животное" isOpen={isOpen} onOpenChangeAction={onOpenChange} size="4xl">
                    <AnimalDetails selectedAnimalId={selected} />
                </ModalOrDrawer>
            )}

            <div className="grid w-full auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {paginatedData.map((e) => (
                    <div
                        key={e.id}
                        onClick={() => {
                            handleClick(e.id);
                        }}
                        className="w-full cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    >
                        <Card className="h-full w-full">
                            <CardBody className="space-y-3 p-2">
                                <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl">
                                    <Image
                                        alt={e.name}
                                        src={e.image || "/placeholder.svg"}
                                        className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <h3 className="truncate text-lg leading-tight font-bold">{e.name}</h3>
                                        <span className="text-base font-medium text-slate-500">{e.age}</span>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center">
                                            <Icon
                                                icon="iconoir:healthcare"
                                                className="h-4 w-4 flex-shrink-0 text-green-600"
                                            />
                                            <p className="ml-2 text-sm font-semibold">Вакцинация:</p>
                                            <Checkbox
                                                isSelected={e.isVaccinated}
                                                color="success"
                                                radius="full"
                                                isReadOnly={true}
                                                className="ml-2"
                                                size="sm"
                                            />
                                        </div>

                                        <div className="flex items-start">
                                            <Icon
                                                icon="iconoir:accessibility"
                                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600"
                                            />
                                            <div className="ml-2 min-w-0">
                                                <p className="text-sm font-semibold">Отношение к людям:</p>
                                                <span className="text-foreground/70 text-sm">{e.humanAttitude}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Icon
                                                icon="fluent:animal-cat-16-regular"
                                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600"
                                            />
                                            <div className="ml-2 min-w-0">
                                                <p className="text-sm font-semibold">К другим животным:</p>
                                                <span className="text-foreground/70 text-sm">{e.animalsAttitude}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-divider border-t pt-1">
                                        <div className="flex flex-wrap gap-1">
                                            {e.hashtags.slice(0, 3).map((hashtag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-primary/10 text-primary inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                                                >
                                                    {hashtag}
                                                </span>
                                            ))}
                                            {e.hashtags.length > 3 && (
                                                <span className="bg-primary/10 text-primary inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                                                    +{e.hashtags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                ))}
            </div>
        </>
    );
}
