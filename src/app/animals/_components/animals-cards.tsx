"use client";

import {useState} from "react";
import {Card, CardBody, Checkbox, Image, useDisclosure} from "@heroui/react";
import ModalOrDrawer from "@/components/modal-or-drawer";
import {Icon} from "@iconify/react";
import {AnimalItem} from "@/types/AnimalItem";

interface Props {
    paginatedData: AnimalItem[];
}

export default function AnimalsCards({paginatedData}: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const handleClick = (id: string) => {
        setSelected(id);
        onOpen();
    };
    return (
        <>
            {selected && (
                <ModalOrDrawer label="Животное" isOpen={isOpen} onOpenChangeAction={onOpenChange} size="3xl">
                    <p>Подробности пока не доступны</p>
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
                                <Image
                                    alt={e.name}
                                    src={e.image}
                                    className="w-full rounded-xl object-cover"
                                />
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">
                                        {e.name},
                                        <span className="text-slate-500 m-1">
                                            {e.age}
                                        </span>
                                    </h3>
                                    <div className="flex items-center pt-2">
                                        <Icon icon="iconoir:healthcare" className="h-5 w-5"/>
                                        <p className="text-sm font-bold mx-2">Вакцинация: </p>
                                        <Checkbox
                                            isSelected={e.isVaccinated}
                                            color="success"
                                            radius="full"
                                            isReadOnly={true}
                                        />
                                    </div>
                                    <div className="flex items-center pt-2">
                                        <Icon icon="iconoir:accessibility" className="h-5 w-5"/>
                                        <p className="text-sm font-bold mx-2">
                                            Отношение к людям:
                                            <span className="text-foreground/50 m-1">
                                                {e.humanAttitude}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center pt-2">
                                        <Icon icon="fluent:animal-cat-16-regular" className="h-5 w-5"/>
                                        <p className="text-sm font-bold mx-2">
                                            Отношение к другим животным:
                                            <span className="text-foreground/50 m-1">
                                                {e.animalsAttitude}
                                            </span>
                                        </p>
                                    </div>
                                    <p className="text-sm pt-2">{e.hashtags.map(hashtag => `${hashtag} `)}</p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                );
            })}
        </>
    );

}