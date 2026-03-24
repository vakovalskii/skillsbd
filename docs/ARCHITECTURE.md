# Архитектура skillsbd

## Общая схема

```
Пользователь
    │
    ▼
Cloudflare DNS (skillsbd.ru → <SERVER_IP>)
    │
    ▼
Traefik v3 (:80/:443, TLS Let's Encrypt)
    │
    ▼
Next.js 16 App (:3000, standalone Docker)
    │
    ├── SSR страницы (каталог, карточки, профили)
    ├── API Routes (/api/*)
    └── Prisma ORM
         │
         ▼
    PostgreSQL 16 (:5432, Docker)
```

## Компоненты

### Web (Next.js 16)
- **App Router** — файловая система роутинга
- **Server Components** — каталог, карточки навыков, профили
- **Client Components** — Leaderboard, Comments, AuditBadges, InstallBlock, SkillContent
- **API Routes** — REST API для навыков, аудита, комментариев, админки
- **Prisma ORM** — типизированные запросы к PostgreSQL

### CLI (npm: skillsbd)
- **Node.js ES Modules** — без зависимостей
- **Команды**: add, search, list, remove
- **Install tracking** — POST callback на /api/skills/install после установки
- **Поиск навыков** — GET /api/skills?q=query
- **Поддержка структур**: skills/, plugins/, .claude/skills/, root SKILL.md

### Генератор (npm: create-skillsbd)
- Создаёт корпоративную skill-библиотеку
- Генерирует package.json, CLI, шаблон SKILL.md
- Готов к публикации в npm / GitHub Packages / Verdaccio

### Инфраструктура
- **Сервер**: Yandex Cloud VM (2 cores, 1.9 GB RAM, 69 GB disk)
- **Docker Compose**: Traefik + App + PostgreSQL
- **CI/CD**: GitHub Actions → rsync → docker compose build
- **Auto-publish**: cli/ changes → npm publish skillsbd
- **Cron**: ежечасный аудит + синхронизация GitHub звёзд + ежедневная очистка Docker cache

## Потоки данных

### Установка навыка
```
npx skillsbd add owner/repo/skill
    │
    ├── git clone --depth 1 repo
    ├── Поиск SKILL.md в skills/, plugins/, .claude/skills/, root
    ├── Копирование в .skills/<name>/
    └── POST /api/skills/install → DB: installs += 1
```

### Добавление навыка (submit)
```
Пользователь → GitHub OAuth → POST /api/skills/submit
    │
    ├── Валидация полей
    ├── Очистка owner/repo от URL
    ├── Fetch GitHub stars
    ├── CREATE skill (status: "pending")
    └── Auto-run audit (fire & forget)
    │
    ▼
Админ → /admin/moderate → POST /api/admin/moderate
    │
    └── approve → status: "approved" (появляется в каталоге)
```

### Аудит навыка
```
Cron (каждый час) или Submit → POST /api/skills/audit
    │
    ├── checkRepo: GitHub API → репо существует, публичный
    ├── checkLicense: GitHub API → лицензия
    ├── checkActivity: GitHub API → последний push
    ├── checkAuthor: GitHub API → возраст аккаунта, кол-во репо
    └── checkSecurity: Fetch SKILL.md → 10 dangerous patterns
    │
    └── UPSERT в таблицу Audit (pass/warn/fail + details)
```
