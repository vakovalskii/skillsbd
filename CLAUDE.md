# CLAUDE.md — правила для AI-агентов в этом проекте

## Git workflow

**НИКОГДА не коммить напрямую в main.** Всегда:

1. Создай ветку от main: `git checkout -b feat/short-description`
2. Делай коммиты в ветку
3. Пуш: `git push -u origin feat/short-description`
4. Создай PR через `gh pr create`
5. После ревью — мерж через GitHub

Формат веток:
- `feat/` — новая функциональность
- `fix/` — баг-фикс
- `refactor/` — рефакторинг без изменения поведения
- `docs/` — документация

## Коммиты

Формат: краткое описание на английском, тело — что и зачем.

```
Add category filter to leaderboard

- Dynamic chips from skill categories
- Filter persists with sort mode
```

## Перед коммитом

1. `cd web && npm run test` — все 38+ тестов должны проходить
2. `npx prisma generate` — если менялась schema.prisma
3. Не коммить `.env`, секреты, токены, API ключи

## Стек

- **Web**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **ORM**: Prisma + PostgreSQL 16
- **Auth**: NextAuth 5 (GitHub OAuth)
- **Tests**: Vitest (node environment, fork pool)
- **CLI**: Node.js ES Modules (npm: skillsbd)
- **Deploy**: Docker Compose (Traefik + App + PostgreSQL)

## Структура

```
web/src/app/          — страницы и API routes
web/src/components/   — React компоненты
web/src/data/         — data layer (Prisma queries)
web/src/lib/          — auth, db, admin helpers
web/prisma/           — schema + migrations
web/__tests__/        — vitest тесты
cli/src/              — CLI (npx skillsbd)
```

## Ключевые файлы

- `web/src/lib/admin.ts` — проверка админа (ID из env, НЕ хардкодить)
- `web/src/lib/db.ts` — Prisma singleton
- `web/src/lib/auth.ts` — NextAuth config
- `web/src/data/skills.ts` — queries + formatInstalls + toSlug
- `docker-compose.yml` — продакшн стек

## Правила

- Все навыки в каталоге фильтруются по `status: "approved"`
- Новые навыки через `/submit` идут в `status: "pending"`
- Admin ID берётся из `ADMIN_USER_IDS` env (через запятую)
- Rate limit на `/api/skills/install`: 10 сек на навык на IP
- Аудит запускается ежечасно через cron + при добавлении навыка
- GitHub API запросы используют `GITHUB_TOKEN` для лимита 5000/час
- URL навыков: `/skill/{slug}` где slug = `toSlug(name)` (lowercase, пробелы → дефисы)
- Старые URL (cuid) автоматически редиректят на slug

## Не делать

- Не хардкодить секреты, admin ID, токены
- Не пушить в main напрямую
- Не добавлять `.env` в git
- Не ставить `"use client"` на серверные компоненты без необходимости
- Не использовать `dangerouslySetInnerHTML` — весь markdown через react-markdown
