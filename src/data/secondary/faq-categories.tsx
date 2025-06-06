import { Icon } from "@iconify/react";

export const faqCategories = [
    {
        id: "general",
        name: "Общие вопросы",
        icon: <Icon icon="octicon:question-16" className="h-4 w-4" />,
        questions: [
            {
                id: "what-is",
                question: "Что такое AnimalAllies?",
                answer: "AnimalAllies — это некоммерческая организация, которая помогает бездомным животным найти новый дом. Мы спасаем, лечим, социализируем животных и находим им ответственных хозяев. Наша миссия — сделать мир лучше для наших четвероногих друзей.",
            },
            {
                id: "how-help",
                question: "Как я могу помочь?",
                answer: "Вы можете помочь несколькими способами: стать волонтёром, сделать пожертвование, взять животное из приюта, распространять информацию о нас в социальных сетях или стать временным опекуном для животного.",
            },
            {
                id: "where-located",
                question: "Где вы находитесь?",
                answer: "Наш главный офис расположен в Москве, но мы работаем по всей России через сеть волонтёров и партнёрских организаций. Адрес главного офиса: г. Москва, ул. Примерная, д. 123.",
            },
            {
                id: "working-hours",
                question: "Какой у вас график работы?",
                answer: "Наш офис открыт с понедельника по пятницу с 10:00 до 19:00, в субботу с 11:00 до 17:00. Воскресенье — выходной день. Для посещения приюта необходима предварительная запись.",
            },
        ],
    },
    {
        id: "animals",
        name: "Животные",
        icon: <Icon icon="mdi:paw-outline" className="h-4 w-4" />,
        questions: [
            {
                id: "how-adopt",
                question: "Как взять животное из приюта?",
                answer: "Чтобы взять животное, нужно: 1) Зарегистрироваться на сайте; 2) Выбрать животное и подать заявку; 3) Пройти собеседование с нашим специалистом; 4) Подписать договор об ответственном содержании; 5) Забрать питомца домой.",
            },
            {
                id: "animal-health",
                question: "Здоровы ли животные из приюта?",
                answer: "Все наши животные проходят обязательный ветеринарный осмотр, вакцинацию, обработку от паразитов и стерилизацию/кастрацию. Если у животного есть особенности здоровья, мы обязательно сообщаем об этом потенциальным хозяевам.",
            },
            {
                id: "animal-return",
                question: "Что делать, если не получается оставить животное у себя?",
                answer: "Если возникли непредвиденные обстоятельства, и вы не можете оставить животное, обязательно свяжитесь с нами. Мы никогда не оставим наших подопечных на улице и поможем найти новый дом. Однако мы просим серьёзно обдумывать решение о принятии животного в семью.",
            },
            {
                id: "animal-age",
                question: "Есть ли у вас щенки/котята или только взрослые животные?",
                answer: "У нас есть животные разных возрастов: от малышей до пожилых. Мы особенно рекомендуем обратить внимание на взрослых животных — они уже социализированы, часто приучены к лотку/выгулу и имеют сформировавшийся характер.",
            },
        ],
    },
    {
        id: "volunteers",
        name: "Волонтёрство",
        icon: <Icon icon="lucide:users" className="h-4 w-4" />,
        questions: [
            {
                id: "how-volunteer",
                question: "Как стать волонтёром?",
                answer: "Чтобы стать волонтёром, нужно: 1) Зарегистрироваться на сайте; 2) Заполнить анкету волонтёра; 3) Дождаться одобрения заявки (обычно 3-5 дней); 4) Пройти инструктаж и начать помогать животным.",
            },
            {
                id: "volunteer-time",
                question: "Сколько времени нужно уделять волонтёрству?",
                answer: "Минимальное время — 2 часа в неделю. Вы можете выбрать удобный для вас график и вид деятельности. Мы ценим любую помощь и понимаем, что у каждого есть свои обязательства.",
            },
            {
                id: "volunteer-skills",
                question: "Нужны ли специальные навыки для волонтёрства?",
                answer: "Для большинства задач специальные навыки не требуются. Мы проводим обучение и инструктаж. Однако, если у вас есть опыт в ветеринарии, фотографии, дизайне, SMM или других областях — это будет большим плюсом.",
            },
            {
                id: "volunteer-age",
                question: "С какого возраста можно стать волонтёром?",
                answer: "Волонтёром можно стать с 16 лет. Для несовершеннолетних требуется согласие родителей или законных представителей. Дети младше 16 лет могут участвовать в некоторых мероприятиях в сопровождении взрослых.",
            },
        ],
    },
    {
        id: "donations",
        name: "Пожертвования",
        icon: <Icon icon="mdi:heart" className="h-4 w-4" />,
        questions: [
            {
                id: "how-donate",
                question: "Как сделать пожертвование?",
                answer: "Вы можете сделать пожертвование несколькими способами: банковской картой на сайте, банковским переводом по реквизитам, через электронные кошельки или принести материальную помощь (корм, лекарства, аксессуары) в наш офис.",
            },
            {
                id: "donation-usage",
                question: "На что идут пожертвования?",
                answer: "Ваши пожертвования идут на: лечение и содержание животных (70%), аренду помещений приюта (15%), транспортные расходы (5%), административные расходы (5%), информационные кампании (5%). Мы публикуем ежемесячные финансовые отчёты на нашем сайте.",
            },
            {
                id: "tax-deduction",
                question: "Можно ли получить налоговый вычет за пожертвование?",
                answer: "Да, как зарегистрированная благотворительная организация, мы можем предоставить документы для получения социального налогового вычета в размере до 13% от суммы пожертвования. Обратитесь к нам для получения необходимых справок.",
            },
            {
                id: "regular-donations",
                question: "Как настроить регулярные пожертвования?",
                answer: "Вы можете настроить ежемесячные пожертвования в личном кабинете на нашем сайте. Выберите удобную сумму, и она будет автоматически списываться с вашей карты каждый месяц. Вы всегда можете изменить сумму или отменить подписку.",
            },
        ],
    },
    {
        id: "events",
        name: "Мероприятия",
        icon: <Icon icon="famicons:calendar-outline" className="h-4 w-4" />,
        questions: [
            {
                id: "events-types",
                question: "Какие мероприятия вы проводите?",
                answer: "Мы регулярно проводим: выставки-пристройства животных, образовательные семинары, благотворительные акции, дни открытых дверей в приюте, мастер-классы и фестивали. Следите за анонсами на нашем сайте и в социальных сетях.",
            },
            {
                id: "event-participation",
                question: "Как принять участие в мероприятии?",
                answer: "Информация о предстоящих мероприятиях публикуется в разделе 'События'. Для участия нужно зарегистрироваться на конкретное мероприятие. Некоторые события требуют предварительной подготовки или взноса, о чём будет указано в описании.",
            },
            {
                id: "organize-event",
                question: "Можно ли организовать мероприятие совместно с вами?",
                answer: "Да, мы открыты для сотрудничества! Если у вас есть идея мероприятия, которое может помочь животным, напишите нам на events@animalallies.ru. Мы рассмотрим ваше предложение и свяжемся с вами для обсуждения деталей.",
            },
        ],
    },
    {
        id: "account",
        name: "Личный кабинет",
        icon: <Icon icon="qlementine-icons:settings-24" className="h-4 w-4" />,
        questions: [
            {
                id: "register-account",
                question: "Как зарегистрировать аккаунт?",
                answer: "Для регистрации нажмите кнопку 'Войти' в правом верхнем углу сайта, затем выберите 'Регистрация'. Заполните форму с вашими данными, подтвердите email и войдите в систему.",
            },
            {
                id: "forgot-password",
                question: "Что делать, если я забыл(а) пароль?",
                answer: "На странице входа нажмите 'Забыли пароль?'. Введите email, указанный при регистрации, и мы отправим вам инструкции по восстановлению доступа.",
            },
            {
                id: "profile-edit",
                question: "Как изменить данные в профиле?",
                answer: "Войдите в личный кабинет, перейдите в раздел 'Настройки профиля'. Там вы можете изменить личную информацию, контактные данные, пароль и настройки уведомлений.",
            },
            {
                id: "delete-account",
                question: "Как удалить аккаунт?",
                answer: "Для удаления аккаунта перейдите в 'Настройки профиля', прокрутите страницу вниз до раздела 'Удаление аккаунта'. Обратите внимание, что все ваши данные будут безвозвратно удалены.",
            },
        ],
    },
];
