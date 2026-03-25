# NeuralDeep

Российский агрегатор навыков, MCP серверов и AI-инструментов. [neuraldeep.ru](https://neuraldeep.ru)
![photo_2026-03-24_11-02-55](https://github.com/user-attachments/assets/5256fc1f-27bd-485c-8215-0322097e8e22)

Навыки для работы с Яндекс, Битрикс, 1С и другими российскими сервисами. Устанавливайте одной командой, делитесь с RU-комьюнити.

## Быстрый старт

### Установка CLI

Не требуется — работает через `npx` (Node.js 18+):

```bash
npx skillsbd --help
```

### Поиск навыков

```bash
npx skillsbd search яндекс
```

### Установка навыка

```bash
npx skillsbd add artwist-polyakov/polyakov-claude-skills/yandex-wordstat
```

Навык появится в директории `.skills/` вашего проекта. AI-агент (Claude Code, Cursor и др.) прочитает его автоматически.

### Установка по GitHub URL

```bash
npx skillsbd add https://github.com/artwist-polyakov/polyakov-claude-skills --skill yandex-wordstat
```

### Список установленных

```bash
npx skillsbd list
```

### Удаление

```bash
npx skillsbd remove yandex-wordstat
```

## Локальная разработка

### Требования

- Node.js 20+
- Docker + Docker Compose
- PostgreSQL (через Docker)

### Запуск

```bash
# 1. Клонируйте репо
git clone https://github.com/vakovalskii/neuraldeep.git
cd skillsbd

# 2. Создайте .env из примера
cp .env.production .env
# Заполните:
#   POSTGRES_PASSWORD=любой_пароль
#   NEXTAUTH_SECRET=openssl rand -base64 32
#   GITHUB_CLIENT_ID=из_github_oauth_app
#   GITHUB_CLIENT_SECRET=из_github_oauth_app

# 3. Поднимите PostgreSQL
docker compose up postgres -d

# 4. Установите зависимости
cd web
npm install

# 5. Примените миграции
DATABASE_URL="postgresql://skills:ваш_пароль@localhost:5432/skillsdb" npx prisma migrate deploy

# 6. Запустите dev-сервер
DATABASE_URL="postgresql://skills:ваш_пароль@localhost:5432/skillsdb" npm run dev
```

Сайт доступен на http://localhost:3000

### Тесты

```bash
cd web
npm run test        # один запуск
npm run test:watch  # watch-режим
```

38 тестов: API routes, data layer, audit patterns, admin guards.

## Структура

```
skillsbd/
├── web/                    # Next.js 16 приложение
│   ├── src/
│   │   ├── app/            # Страницы и API routes
│   │   ├── components/     # React компоненты
│   │   ├── data/           # Data layer (Prisma queries)
│   │   └── lib/            # Auth, DB, admin helpers
│   ├── prisma/             # Схема и миграции
│   ├── __tests__/          # Vitest тесты
│   └── public/             # Статика, favicon, SKILL.md
├── cli/                    # npm пакет skillsbd (npx skillsbd)
├── deploy/                 # Инфо о сервере
├── docker-compose.yml      # Traefik + App + PostgreSQL
└── .github/workflows/      # CI/CD
```

## Стек

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **БД**: PostgreSQL 16
- **Инфра**: Docker, Traefik v3, Let's Encrypt
- **CI/CD**: GitHub Actions → rsync → docker compose
- **Тесты**: Vitest (38 тестов)
- **CLI**: Node.js ES Modules (npm: skillsbd)

## API

Открытый API без авторизации для GET-запросов.

```bash
# Все навыки
curl https://neuraldeep.ru/api/skills

# Поиск
curl https://neuraldeep.ru/api/skills?q=яндекс

# Тренды
curl https://neuraldeep.ru/api/skills?sort=trending
```

[Полная документация API →](https://neuraldeep.ru/docs/api)

## Для компаний: своя библиотека навыков

Создайте корпоративную библиотеку навыков для AI-агентов внутри вашей компании.

### Генерация

```bash
npx create-skillsbd my-company-skills
```

Создаёт готовый npm-пакет:
```
my-company-skills/
├── cli.js              # CLI: npx my-company-skills add/list
├── skills/
│   └── example/
│       └── SKILL.md    # Шаблон навыка
├── package.json
└── README.md
```

### Добавьте навыки

```
skills/
├── internal-api/
│   └── SKILL.md        # Работа с внутренним API компании
├── code-standards/
│   └── SKILL.md        # Код-стайл и архитектурные правила
└── deploy-process/
    └── SKILL.md        # Процесс деплоя в вашу инфру
```

### Публикация

```bash
# Публичный npm (open source)
npm publish --access public

# GitHub Packages (приватный, привязан к GitHub org)
npm publish --registry=https://npm.pkg.github.com

# Verdaccio (self-hosted npm registry)
npm publish --registry=https://npm.your-company.ru

# JFrog Artifactory
npm publish --registry=https://artifactory.your-company.ru/api/npm/npm-local

# Nexus Repository
npm publish --registry=https://nexus.your-company.ru/repository/npm-private/
```

### Использование разработчиками

```bash
# Из публичного npm
npx my-company-skills add internal-api

# Из приватного реестра
npx --registry=https://npm.your-company.ru my-company-skills add internal-api

# Или через .npmrc в проекте
echo "@my-company:registry=https://npm.your-company.ru" > .npmrc
npx @my-company/skills add internal-api
```

### Автоматизация релизов

Добавьте в GitHub Actions вашего репо:

```yaml
name: Publish skills
on:
  push:
    branches: [main]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org  # или ваш реестр
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Контрибьюция

1. Форкните репо
2. Создайте ветку (`git checkout -b feature/my-feature`)
3. Коммитните изменения
4. Откройте PR

### Как добавить навык в каталог

1. Создайте GitHub-репозиторий с файлом `SKILL.md`
2. Зайдите на [neuraldeep.ru/submit](https://neuraldeep.ru/submit)
3. Заполните форму — навык попадёт на модерацию

## Лицензия

MIT

## Автор

[Валерий Ковальский](https://t.me/neuraldeep)
