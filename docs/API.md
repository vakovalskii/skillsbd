# API Reference

Базовый URL: `https://skillsbd.ru`

## Публичные эндпоинты (без авторизации)

### GET /api/skills
Список навыков из каталога (только approved).

| Параметр | Описание |
|----------|----------|
| q | Поиск по имени, описанию, автору |
| sort | `all` (по установкам) или `trending` (за 24ч) |

### GET /api/skills/readme?skillId=ID
Содержимое SKILL.md (или README.md) навыка из GitHub.

### GET /api/skills/audit?skillId=ID
Результаты аудита безопасности навыка.

### GET /api/skills/comments?skillId=ID
Комментарии к навыку (сортировка: старые первые).

## Авторизованные эндпоинты (GitHub OAuth)

### POST /api/skills/submit
Добавить навык на модерацию.

Body: `{ name, owner, repo, description, category, authorName?, telegramLink? }`

### POST /api/skills/comments
Добавить комментарий.

Body: `{ skillId, text }` (max 1000 символов)

### POST /api/skills/install
Трекинг установки (вызывается CLI).

Body: `{ name, owner, repo, v }` — rate limit: 10с на навык на IP.

## Админские эндпоинты (ADMIN_USER_IDS)

### GET /api/admin/moderate
Список pending навыков.

### POST /api/admin/moderate
Approve/reject. Body: `{ skillId, action: "approve" | "reject" }`

### GET /api/admin/skills
Все навыки (включая pending).

### DELETE /api/admin/skills
Удалить навык. Body: `{ skillId }`

### PATCH /api/admin/skills
Toggle featured. Body: `{ skillId, featured: boolean }`

### GET /api/admin/users
Список пользователей.

### POST /api/admin/import
Сканирование GitHub репо. Body: `{ repoUrl }`

### PUT /api/admin/import
Импорт выбранных навыков. Body: `{ owner, repo, skills[], authorName?, telegramLink?, category, featured }`

## Cron

### GET /api/cron/audit
Запуск аудита для всех навыков + синхронизация GitHub звёзд.

Header: `Authorization: Bearer {CRON_SECRET}`

## Auth

### GET /api/auth/me
Текущий пользователь + isAdmin.
