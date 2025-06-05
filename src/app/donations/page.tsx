"use client";

import React, { useState } from "react";

import { CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function DonationsPage() {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(label);
            setTimeout(() => { setCopiedText(null); }, 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const donationMethods = [
        {
            title: "Банковская карта",
            icon: <Icon icon="f7:creditcard-fill" className="h-6 w-6" />,
            description: "Быстрый и безопасный способ",
            details: [
                { label: "Номер карты", value: "2202 2061 4567 8901", copyable: true },
                { label: "Получатель", value: "Фонд AnimalAllies" },
                { label: "Банк", value: "Сбербанк России" },
            ],
        },
        {
            title: "Банковский перевод",
            icon: <Icon icon="mdi:bank" className="h-6 w-6" />,
            description: "Для крупных пожертвований",
            details: [
                { label: "Расчётный счёт", value: "40703810938000123456", copyable: true },
                { label: "БИК", value: "044525225", copyable: true },
                { label: "ИНН", value: "7707083893", copyable: true },
                { label: "КПП", value: "770701001", copyable: true },
                { label: "Банк", value: "ПАО Сбербанк" },
                { label: "Назначение", value: "Благотворительное пожертвование" },
            ],
        },
        {
            title: "Электронные кошельки",
            icon: <Icon icon="ic:twotone-smartphone" className="h-6 w-6" />,
            description: "Удобные онлайн-платежи",
            details: [
                { label: "ЮMoney", value: "4100117812345678", copyable: true },
                { label: "QIWI", value: "+7 (949) 123-45-67", copyable: true },
                { label: "WebMoney", value: "R123456789012", copyable: true },
            ],
        },
    ];

    return (
        <div className="flex min-h-[90vh] flex-col bg-black text-white">
            <section className="relative flex h-96 items-center justify-center">
                <div className="relative z-10 px-2 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <Icon icon="mdi:heart" className="h-8 w-8 text-green-500" />
                        <h1 className="text-5xl font-bold">Пожертвования</h1>
                    </div>
                    <p className="mx-auto max-w-2xl text-xl text-gray-200">
                        Ваша поддержка помогает нам спасать жизни животных, обеспечивать им медицинскую помощь и
                        находить любящие дома
                    </p>
                </div>
            </section>

            <main className="flex-1 px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    {/* Impact Stats */}
                    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <Card className="border-gray-700 bg-gray-900/50">
                            <CardBody className="flex flex-col items-center pt-6">
                                <div className="mb-2 block text-3xl font-bold text-green-500">247</div>
                                <p className="text-gray-300">Животных спасено в этом году</p>
                            </CardBody>
                        </Card>
                        <Card className="border-gray-700 bg-gray-900/50">
                            <CardBody className="flex flex-col items-center pt-6">
                                <div className="mb-2 text-3xl font-bold text-green-500">89</div>
                                <p className="text-gray-300">Животных нашли дом</p>
                            </CardBody>
                        </Card>
                        <Card className="border-gray-700 bg-gray-900/50">
                            <CardBody className="flex flex-col items-center pt-6">
                                <div className="mb-2 text-3xl font-bold text-green-500">156</div>
                                <p className="text-gray-300">Операций проведено</p>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {donationMethods.map((method, index) => (
                            <Card
                                key={index}
                                className="border-gray-700 bg-gray-900/50 transition-colors hover:border-green-500/50"
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20 text-green-500">
                                            {method.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-white">{method.title}</h3>
                                            <p className="text-gray-400">{method.description}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody className="space-y-3">
                                    {method.details.map((detail, detailIndex) => (
                                        <div key={detailIndex} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">{detail.label}:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm text-white">{detail.value}</span>
                                                {detail.copyable && (
                                                    <button
                                                        onClick={() => {
                                                            void copyToClipboard(detail.value, detail.label);
                                                        }}
                                                        className="rounded p-1 transition-colors hover:bg-gray-700"
                                                        title="Копировать"
                                                    >
                                                        {copiedText === detail.label ? (
                                                            <Icon
                                                                icon="material-symbols:check"
                                                                className="h-4 w-4 text-green-500"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                icon="solar:copy-bold"
                                                                className="h-4 w-4 text-gray-400"
                                                            />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    <Card className="mb-12 border-gray-700 bg-gray-900/50">
                        <CardHeader className="flex flex-col items-center">
                            <h3 className="text-center font-bold text-white md:text-2xl">
                                Рекомендуемые суммы пожертвований
                            </h3>
                            <p className="text-center text-gray-400">
                                Каждый рубль имеет значение, но вот что можно сделать с разными суммами
                            </p>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-lg bg-gray-800/50 p-4 text-center">
                                    <div className="mb-2 text-2xl font-bold text-green-500">500₽</div>
                                    <p className="text-sm text-gray-300">Корм для животного на неделю</p>
                                </div>
                                <div className="rounded-lg bg-gray-800/50 p-4 text-center">
                                    <div className="mb-2 text-2xl font-bold text-green-500">1500₽</div>
                                    <p className="text-sm text-gray-300">Вакцинация одного животного</p>
                                </div>
                                <div className="rounded-lg bg-gray-800/50 p-4 text-center">
                                    <div className="mb-2 text-2xl font-bold text-green-500">5000₽</div>
                                    <p className="text-sm text-gray-300">Стерилизация кошки или собаки</p>
                                </div>
                                <div className="rounded-lg bg-gray-800/50 p-4 text-center">
                                    <div className="mb-2 text-2xl font-bold text-green-500">15000₽</div>
                                    <p className="text-sm text-gray-300">Сложная операция</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <Card className="border-gray-700 bg-gray-900/50">
                            <CardHeader>
                                <h3 className="font-bold text-white md:text-2xl">Налоговые льготы</h3>
                            </CardHeader>
                            <CardBody className="text-gray-300">
                                <p className="mb-4">
                                    Как зарегистрированная благотворительная организация, мы можем предоставить справку
                                    для получения налогового вычета.
                                </p>
                                <Chip color="success" variant="flat">
                                    До 13% возврат с суммы пожертвования
                                </Chip>
                            </CardBody>
                        </Card>

                        <Card className="border-gray-700 bg-gray-900/50">
                            <CardHeader>
                                <h3 className="font-bold text-white md:text-2xl">Прозрачность</h3>
                            </CardHeader>
                            <CardBody className="text-gray-300">
                                <p className="mb-4">
                                    Мы публикуем ежемесячные отчёты о том, как используются пожертвования. Каждый рубль
                                    идёт на помощь животным.
                                </p>
                                <Button
                                    variant="outline"
                                    className="border-green-500 text-green-400 hover:bg-green-500/10"
                                >
                                    Посмотреть отчёты
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
