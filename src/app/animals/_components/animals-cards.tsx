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
            {paginatedData.map((e) => {
                return (
                    <div
                        key={e.id}
                        onClick={() => {
                            handleClick(e.id);
                        }}
                    >
                        <Card
                            key={e.id}
                            className="cursor-pointer transition-shadow hover:shadow-lg"
                            onPress={() => {
                                handleClick(e.id);
                            }}
                        >
                            <CardBody className="space-y-4">
                                <Image alt={e.name} src={e.image} className="w-full rounded-xl object-cover" />
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">
                                        {e.name},<span className="m-1 text-slate-500">{e.age}</span>
                                    </h3>
                                    <div className="flex items-center pt-2">
                                        <Icon icon="iconoir:healthcare" className="h-5 w-5" />
                                        <p className="mx-2 text-sm font-bold">Вакцинация: </p>
                                        <Checkbox
                                            isSelected={e.isVaccinated}
                                            color="success"
                                            radius="full"
                                            isReadOnly={true}
                                        />
                                    </div>
                                    <div className="flex items-center pt-2">
                                        <Icon icon="iconoir:accessibility" className="h-5 w-5" />
                                        <p className="mx-2 text-sm font-bold">
                                            Отношение к людям:
                                            <span className="text-foreground/50 m-1">{e.humanAttitude}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center pt-2">
                                        <Icon icon="fluent:animal-cat-16-regular" className="h-5 w-5" />
                                        <p className="mx-2 text-sm font-bold">
                                            Отношение к другим животным:
                                            <span className="text-foreground/50 m-1">{e.animalsAttitude}</span>
                                        </p>
                                    </div>
                                    <p className="pt-2 text-sm">{e.hashtags.map((hashtag) => `${hashtag} `)}</p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                );
            })}
        </>
    );
}
