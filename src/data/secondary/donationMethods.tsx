import React from "react";

import { Icon } from "@iconify/react";

export const donationMethods = [
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
