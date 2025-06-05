"use client";

import React from "react";

import { faqCategories } from "@/data/secondary/faq-categories";
import { CardHeader } from "@heroui/card";
import { Accordion, AccordionItem, Button, Card, CardBody, Tab, Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function DonationsPage() {
    return (
        <div className="flex min-h-[90vh] flex-col bg-black text-white">
            <section className="relative flex h-96 items-center justify-center">
                <div className="relative z-10 px-2 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <Icon icon="octicon:question-16" className="h-10 w-10 text-green-500" />
                        <h1 className="text-5xl font-bold">Справка по системе</h1>
                    </div>
                    <p className="mx-auto max-w-2xl text-xl text-gray-200">
                        Ответы на часто задаваемые вопросы о нашей платформе и работе с животными
                    </p>
                </div>
            </section>

            <main className="flex-1 px-6 py-12">
                <div className="mb-10">
                    <Tabs fullWidth>
                        {faqCategories.map((category) => (
                            <Tab
                                key={category.id}
                                title={
                                    <div className="flex items-center space-x-2">
                                        {category.icon}
                                        <span>{category.name}</span>
                                    </div>
                                }
                            >
                                <div className="m-2">
                                    <div className="mb-6 flex items-center space-x-2">
                                        {category.icon}
                                        <span className="font-bold md:text-xl">{category.name}</span>
                                    </div>
                                    <p className="text-gray-300">
                                        Ответы на часто задаваемые вопросы в категории &quot;{category.name}&quot;
                                    </p>
                                </div>

                                <Accordion variant="bordered">
                                    {category.questions.map((question, index) => (
                                        <AccordionItem
                                            key={index}
                                            aria-label={question.question}
                                            title={question.question}
                                        >
                                            {question.answer}
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </Tab>
                        ))}
                    </Tabs>
                </div>

                <Card className="mt-12 border-gray-700 bg-gray-900/50">
                    <CardHeader className="flex flex-col items-center text-center">
                        <h3 className="text-center font-bold text-white md:text-2xl">Не нашли ответ на свой вопрос?</h3>
                        <p className="text-center text-gray-400">Свяжитесь с нами, и мы с радостью поможем вам</p>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                                    <Icon icon="mdi-light:phone" className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 font-semibold">Телефон</h3>
                                <p className="text-gray-300">+7 (999) 123-45-67</p>
                                <p className="text-sm text-gray-400">Пн-Пт: 10:00-19:00</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                                    <Icon icon="material-symbols:mail-outline-rounded" className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 font-semibold">Email</h3>
                                <p className="text-gray-300">support@animalallies.ru</p>
                                <p className="text-sm text-gray-400">Ответ в течение 24 часов</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                                    <Icon icon="mdi-light:message" className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 font-semibold">Чат</h3>
                                <p className="text-gray-300">Онлайн-консультант</p>
                                <p className="text-sm text-gray-400">Ежедневно: 9:00-21:00</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <Button className="bg-green-500 hover:bg-green-600">Задать вопрос</Button>
                        </div>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
}
