"use client";

import * as React from "react";
import { useContext, useEffect, useState } from "react";

import VolunteerForm from "@/app/_components/auth/volunteer-register-form";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { Badge, Button, Card, CardBody, Divider, addToast, cn, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function App() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { user, accessToken } = useContext(AuthContext)!;

    const carouselItems = [
        {
            image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000",
            name: "Барсик",
            type: "Кот",
            age: "2 года",
            description: "Дружелюбный и игривый кот, который ищет любящий дом.",
        },
        {
            image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1000",
            name: "Рекс",
            type: "Собака",
            age: "3 года",
            description: "Умный и преданный пес, хорошо ладит с детьми.",
        },
        {
            image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1000",
            name: "Пушинка",
            type: "Кролик",
            age: "1 год",
            description: "Милый и пушистый кролик, который принесет радость в ваш дом.",
        },
    ];

    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;
        if (autoplay) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
            }, 5000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [autoplay, carouselItems.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
        setAutoplay(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
        setAutoplay(false);
    };

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] overflow-hidden">
                {/* Carousel */}
                <div className="relative h-full w-full">
                    {carouselItems.map((item, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentSlide ? "opacity-100" : "pointer-events-none opacity-0"
                            }`}
                        >
                            <div className="from-background absolute inset-0 z-10 bg-gradient-to-t via-transparent to-transparent" />
                            <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute right-0 bottom-0 left-0 z-20 p-8">
                                <div className="container mx-auto">
                                    <div className="max-w-lg">
                                        <Badge color="success" className="mb-2">
                                            {item.type}
                                        </Badge>
                                        <h2 className="mb-2 text-4xl font-bold">{item.name}</h2>
                                        <div className="mb-4 flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <Icon icon="lucide:paw-print" width={16} height={16} /> {item.age}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Icon icon="lucide:map-pin" width={16} height={16} /> Москва
                                            </span>
                                        </div>
                                        <p className="mb-6 text-lg">{item.description}</p>
                                        <Button color="success" className="font-medium">
                                            Познакомиться{" "}
                                            <Icon icon="lucide:arrow-right" className="ml-2" width={16} height={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Carousel Controls */}
                    <div className="absolute right-8 bottom-8 z-30 flex items-center gap-2">
                        <Button
                            isIconOnly
                            variant="bordered"
                            size="sm"
                            className="border-foreground hover:bg-foreground/20 rounded-full"
                            onPress={prevSlide}
                        >
                            <Icon icon="lucide:chevron-left" width={16} height={16} />
                        </Button>
                        <div className="flex gap-1">
                            {carouselItems.map((_, index) => (
                                <button
                                    key={index}
                                    className={cn(
                                        "h-2 w-2 rounded-full",
                                        index === currentSlide ? "bg-foreground/100" : "bg-foreground/50",
                                    )}
                                    onClick={() => {
                                        setCurrentSlide(index);
                                        setAutoplay(false);
                                    }}
                                />
                            ))}
                        </div>
                        <Button
                            isIconOnly
                            variant="bordered"
                            size="sm"
                            className="border-foreground hover:bg-foreground/20 rounded-full"
                            onPress={nextSlide}
                        >
                            <Icon icon="lucide:chevron-right" width={16} height={16} />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                            Добро пожаловать в <span className="text-emerald-500">AnimalAllies</span>
                        </h2>
                        <p className="text-foreground/65 mb-8 text-lg">
                            Мы помогаем животным найти любящий дом и объединяем людей, которые хотят помочь. Наша миссия
                            — сделать мир лучше для наших четвероногих друзей.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button color="success">Найти питомца</Button>
                            <Button
                                variant="bordered"
                                color="success"
                                onPress={() => {
                                    if (!accessToken)
                                        addToast({
                                            title: "Не авторизован",
                                            description: "Для начала нужно авторизоваться как пользователь",
                                            color: "danger",
                                            timeout: 5000,
                                            shouldShowTimeoutProgress: true,
                                        });
                                    else if (user?.volunteer) {
                                        addToast({
                                            title: "Уже волонтёр",
                                            description: "Вы уже волонтёр",
                                            color: "danger",
                                            timeout: 5000,
                                            shouldShowTimeoutProgress: true,
                                        });
                                    } else onOpen();
                                }}
                            >
                                Стать волонтёром
                            </Button>
                            <ModalOrDrawer
                                label="Стать волонтёром"
                                isOpen={isOpen}
                                onOpenChangeAction={onOpenChange}
                                size="2xl"
                            >
                                <VolunteerForm
                                    onSuccess={() => {
                                        onOpenChange();
                                    }}
                                />
                            </ModalOrDrawer>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-background/80 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <Card className="bg-background/50 border-emerald-900">
                            <CardBody className="p-6">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/30 dark:bg-emerald-900/30">
                                    <Icon icon="lucide:heart" className="h-6 w-6 text-emerald-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">Помощь животным</h3>
                                <p className="text-foreground/65">
                                    Мы спасаем, лечим и находим дом для бездомных животных. Каждый питомец заслуживает
                                    любви и заботы.
                                </p>
                            </CardBody>
                        </Card>

                        <Card className="bg-background/50 border-emerald-900">
                            <CardBody className="p-6">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/30 dark:bg-emerald-900/30">
                                    <Icon icon="lucide:paw-print" className="h-6 w-6 text-emerald-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">Поиск пропавших</h3>
                                <p className="text-foreground/65">
                                    Наша система помогает находить потерявшихся питомцев и воссоединять их с хозяевами.
                                </p>
                            </CardBody>
                        </Card>

                        <Card className="bg-background/50 border-emerald-900">
                            <CardBody className="p-6">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/30 dark:bg-emerald-900/30">
                                    <Icon icon="lucide:calendar" className="h-6 w-6 text-emerald-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">События и акции</h3>
                                <p className="text-foreground/65">
                                    Регулярно проводим мероприятия, выставки и акции для помощи животным и привлечения
                                    внимания к их проблемам.
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="from-background bg-gradient-to-b to-emerald-200 py-16 dark:to-emerald-950">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="mb-6 text-3xl font-bold">Присоединяйтесь к нам сегодня</h2>
                        <p className="text-foreground/65 mb-8 text-lg">
                            Вместе мы можем сделать больше для животных, которые нуждаются в нашей помощи. Станьте
                            частью сообщества AnimalAllies!
                        </p>
                        <Button color="success" size="lg" className="px-8 py-6 font-medium">
                            Начать помогать
                        </Button>
                    </div>
                </div>
            </section>
            <footer className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <Icon icon="lucide:paw-print" width={24} height={24} className="text-emerald-500" />
                                <span className="text-xl font-bold">AnimalAllies</span>
                            </div>
                            <p className="text-foreground/45">Помогаем животным найти дом и заботу с 2024 года.</p>
                            <div className="mt-4 flex space-x-4">
                                <a href="#" className="text-foreground/45 transition-colors hover:text-emerald-500">
                                    <Icon icon="lucide:facebook" width={20} height={20} />
                                </a>
                                <a href="#" className="text-foreground/45 transition-colors hover:text-emerald-500">
                                    <Icon icon="lucide:instagram" width={20} height={20} />
                                </a>
                                <a href="#" className="text-foreground/45 transition-colors hover:text-emerald-500">
                                    <Icon icon="lucide:twitter" width={20} height={20} />
                                </a>
                                <a href="#" className="text-foreground/45 transition-colors hover:text-emerald-500">
                                    <Icon icon="lucide:youtube" width={20} height={20} />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-4 font-bold">Помощь</h3>
                            <ul className="text-foreground/45 space-y-2">
                                <li>
                                    <a href="#" className="transition-colors hover:text-emerald-500">
                                        Как помочь
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-emerald-500">
                                        Пожертвования
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-emerald-500">
                                        Стать волонтёром
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-emerald-500">
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-bold">Контакты</h3>
                            <ul className="text-foreground/45 space-y-3">
                                <li className="flex items-start gap-2">
                                    <Icon icon="lucide:mail" width={18} height={18} className="mt-0.5 flex-shrink-0" />
                                    <span>info@animalallies.ru</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icon icon="lucide:phone" width={18} height={18} className="mt-0.5 flex-shrink-0" />
                                    <span>+7 (999) 123-45-67</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icon
                                        icon="lucide:map-pin"
                                        width={18}
                                        height={18}
                                        className="mt-0.5 flex-shrink-0"
                                    />
                                    <span>г. Москва, ул. Примерная, 123</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icon icon="lucide:clock" width={18} height={18} className="mt-0.5 flex-shrink-0" />
                                    <span>
                                        Пн-Пт: 9:00-18:00
                                        <br />
                                        Сб: 10:00-15:00
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Divider className="my-8 bg-gray-800" />
                    <div className="text-foreground/45 flex flex-col items-center justify-between md:flex-row">
                        <p>© 2025 AnimalAllies. Все права защищены.</p>
                        <div className="mt-4 flex gap-4 md:mt-0">
                            <a href="#" className="transition-colors hover:text-emerald-500">
                                Политика конфиденциальности
                            </a>
                            <a href="#" className="transition-colors hover:text-emerald-500">
                                Условия использования
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
