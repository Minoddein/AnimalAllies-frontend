# AnimalAllies-frontend

[![license](https://img.shields.io/github/license/Minoddein/AnimalAllies-frontend)](https://opensource.org/licenses/MIT)
[![release](https://img.shields.io/github/v/release/Minoddein/AnimalAllies-frontend?include_prereleases)](https://github.com/Minoddein/AnimalAllies-frontend/releases)
[![downloads](https://img.shields.io/github/downloads/Minoddein/AnimalAllies-frontend/total)](https://github.com/Minoddein/AnimalAllies-frontend/releases)
[![code size](https://img.shields.io/github/languages/code-size/Minoddein/AnimalAllies-frontend.svg)](https://github.com/Minoddein/AnimalAllies-frontend)

[![linters](https://github.com/Minoddein/AnimalAllies-frontend/actions/workflows/linters.yaml/badge.svg)](https://github.com/Minoddein/AnimalAllies-frontend/actions/workflows/linters.yaml)
[![codeql](https://github.com/Minoddein/AnimalAllies-frontend/actions/workflows/codeql.yaml/badge.svg)](https://github.com/Minoddein/AnimalAllies-frontend/actions/workflows/codeql.yaml)
[![build](https://github.com/Minoddein/AnimalAllies-frontend/actions/workflows/build.yaml/badge.svg)](https://github.com/Minoddein/AnimalAllies-frontend/actions/workflows/build.yaml)

Модуль фронтенда для проекта [AnimalAllies](https://github.com/Minoddein/AnimalAllies)

## Особенности реализации

- ...

## Стек

- **Bun** — быстрая среда исполнения JavaScript
- **TypeScript** — статически типизированный JavaScript
- **Next.js** — фронтенд-фреймворк на основе React
- **Tailwind CSS** — CSS-фреймворк
- **HeroUI** — набор компонентов
- **ESLint** — статический анализатор кода
- **Stylelint** — анализатор стилей
- **Prettier** — форматировщик кода
- **Docker** — платформа для контейнеризации

## Установка и запуск

> [!WARNING]
> Полноценная работа фронтенда возможна только при запущенном бэкенде.

0. Клонируйте репозиторий и перейдите в его папку.

### Посредством Docker

1. Установите Docker.
2. Создайте файл `.env` на основе [.env.template](.env.template) и настройте все описанные там параметры.
3. Запустите сборку образа:

```shell
docker build -t animalallies-frontend .
```

4. Теперь запускать образ можно командой:

```shell
docker run -d --name animalallies-frontend-standalone -p 8000:3000 animalallies-frontend
```

### Без использования Docker

1. Установите Bun одним из способов. Например, для Windows:

```shell
powershell -c "irm bun.sh/install.ps1 | iex"
```

2. Установите зависимости:

```shell
bun install
```

3. Создайте файл `.env` на основе [.env.template](.env.template) и настройте все описанные там параметры.

4. Соберите проект:

```shell
bun run build
```

5. Теперь запускать проект можно командой:

```shell
bun run start
```

## Модификация

Запуск сервера в режиме отладки осуществляется командой:

```shell
bun run dev
```

Прочие скрипты, необходимые для запуска линтеров, форматировщика и т. д. находятся в
файле [package.json](./package.json).
