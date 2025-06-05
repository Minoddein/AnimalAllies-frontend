"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { steps } from "@/data/secondary/steps";
import { volunteerTypes } from "@/data/secondary/volunteer-types";
import { CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Accordion, AccordionItem, Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function HowComeVolunteerPage() {
    const router = useRouter();

    const handleStartNow = () => {
        router.push("/?openModal=volunteer");
    };

    return (
        <div className="flex min-h-[90vh] flex-col bg-black text-white">
            <section className="relative flex h-96 items-center justify-center">
                <div className="relative z-10 px-2 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <Icon icon="material-symbols:group-outline" className="h-10 w-10 text-green-500" />
                        <h1 className="text-xl font-bold md:text-5xl">Стать волонтёром</h1>
                    </div>
                    <p className="mx-auto max-w-2xl text-gray-200 md:text-xl">
                        Присоединяйтесь к нашей команде добрых сердец и помогайте животным обрести счастье
                    </p>
                </div>
            </section>

            <main className="flex-1 px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <h3 className="mb-6 text-center font-bold md:text-3xl">Почему стоит стать волонтёром?</h3>
                    {/* Impact Stats */}
                    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <Card className="border-gray-700 bg-gray-900/50">
                            <CardBody className="flex flex-col items-center pt-6">
                                <Icon icon="mdi:heart-outline" className="mb-2 h-12 w-12 text-green-500" />
                                <h3 className="mb-2 text-xl font-bold">Спасайте жизни</h3>
                                <p className="text-center text-gray-300">
                                    Каждое ваше действие помогает животному найти дом и счастье
                                </p>
                            </CardBody>
                        </Card>
                        <Card className="border-gray-700 bg-gray-900/50">
                            <CardBody className="flex flex-col items-center pt-6">
                                <Icon icon="mingcute:group-line" className="mb-2 h-12 w-12 text-green-500" />
                                <h3 className="mb-2 text-xl font-bold">Найдите друзей</h3>
                                <p className="text-center text-gray-300">
                                    Познакомьтесь с единомышленниками и обретите новых друзей
                                </p>
                            </CardBody>
                        </Card>
                        <Card className="border-gray-700 bg-gray-900/50">
                            <CardBody className="flex flex-col items-center pt-6">
                                <Icon icon="prime:check-circle" className="mb-2 h-12 w-12 text-green-500" />
                                <h3 className="mb-2 text-xl font-bold">Получите опыт</h3>
                                <p className="text-center text-gray-300">
                                    Развивайте навыки и получайте ценный жизненный опыт
                                </p>
                            </CardBody>
                        </Card>
                    </div>

                    <h3 className="my-6 text-center font-bold md:text-3xl">Как стать волонтёром: пошаговый гайд</h3>

                    <div className="mb-12 grid grid-cols-1 gap-8">
                        <Accordion variant="bordered">
                            {steps.map((step, index) => (
                                <AccordionItem
                                    key={index}
                                    aria-label={step.title}
                                    startContent={
                                        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                                            {index + 1}
                                        </div>
                                    }
                                    title={
                                        <div className="flex items-center gap-2">
                                            <div>{step.icon}</div>
                                            <p className="font-bold md:text-2xl">{step.title}</p>
                                        </div>
                                    }
                                    subtitle={<p className="text-gray-400">{step.description}</p>}
                                >
                                    {step.details.map((detail, i) => (
                                        <div key={i} className="my-2 flex items-center gap-2">
                                            <Icon icon="bxs:right-arrow" className="h-6 w-6 text-green-500" />
                                            <p className="md:text-xl">{detail}</p>
                                        </div>
                                    ))}
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    <h3 className="my-6 text-center font-bold md:text-3xl">Виды волонтёрской деятельности</h3>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {volunteerTypes.map((type, index) => (
                            <Card className="border-gray-700 bg-gray-900/50" key={index}>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="text-green-500">{type.icon}</div>
                                        <p className="font-bold">{type.title}</p>
                                    </div>
                                </CardHeader>
                                <CardBody className="text-gray-300">
                                    <p className="mb-4">{type.description}</p>
                                    <Chip color="success" variant="flat">
                                        {type.time}
                                    </Chip>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>

                <Card className="mt-10 border-gray-700 bg-gray-900/50">
                    <CardHeader className="flex flex-col items-center">
                        <h3 className="text-center font-bold text-white md:text-2xl">Остались вопросы?</h3>
                        <p className="text-center text-gray-400">Свяжитесь с нашим координатором волонтёров</p>
                    </CardHeader>
                    <CardBody>
                        <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Icon icon="mdi-light:phone" className="h-5 w-5 text-green-500" />
                                <span>+7 (999) 123-45-67</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Icon icon="material-symbols:mail-outline-rounded" className="h-5 w-5 text-green-500" />
                                <span>volunteers@animalallies.ru</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <Button className="bg-green-500 hover:bg-green-600" onPress={handleStartNow}>
                                Начать прямо сейчас
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
}
