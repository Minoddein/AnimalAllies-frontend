import React from "react";

import { Icon } from "@iconify/react";

export const volunteerTypes = [
    {
        title: "Уход за животными",
        description: "Кормление, выгул, социализация",
        icon: <Icon icon="mdi:heart-outline" className="h-5 w-5" />,
        time: "2-4 часа в неделю",
    },
    {
        title: "Транспортировка",
        description: "Перевозка животных к ветеринару",
        icon: <Icon icon="lucide:map-pin" className="h-5 w-5" />,
        time: "По необходимости",
    },
    {
        title: "Административная помощь",
        description: "Работа с документами, звонки",
        icon: <Icon icon="qlementine-icons:file-text-16" className="h-5 w-5" />,
        time: "3-5 часов в неделю",
    },
    {
        title: "Мероприятия",
        description: "Организация выставок и акций",
        icon: <Icon icon="famicons:calendar-outline" className="h-5 w-5" />,
        time: "Выходные дни",
    },
];
