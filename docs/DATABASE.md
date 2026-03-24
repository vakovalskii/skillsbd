# База данных

PostgreSQL 16 через Prisma ORM.

## Модели

### User
| Поле | Тип | Описание |
|------|-----|----------|
| id | cuid | PK |
| name | String? | GitHub username |
| email | String? | Email (unique) |
| image | String? | Аватар URL |
| emailVerified | DateTime? | NextAuth |
| createdAt | DateTime | Дата регистрации |
| updatedAt | DateTime | Последнее обновление |

Связи: accounts[], skills[], comments[]

### Account
NextAuth OAuth аккаунт (GitHub).

| Поле | Тип | Описание |
|------|-----|----------|
| id | cuid | PK |
| userId | String | FK → User |
| provider | String | "github" |
| providerAccountId | String | GitHub user ID |
| access_token | String? | OAuth token |

Unique: [provider, providerAccountId]

### Skill
| Поле | Тип | Описание |
|------|-----|----------|
| id | cuid | PK |
| name | String | Уникальное имя (slug) |
| owner | String | GitHub owner |
| repo | String | GitHub repo |
| description | String | Описание |
| installs | Int | Счётчик установок |
| trending24h | Int | Установки за 24ч |
| category | String | Категория |
| tags | String[] | Теги (PostgreSQL array) |
| contentPath | String? | Путь к SKILL.md |
| authorName | String? | Имя автора |
| telegramLink | String? | Telegram канал |
| featured | Boolean | Выбор редакции |
| status | String | "pending" / "approved" |
| githubStars | Int | Звёзды на GitHub |
| authorId | String? | FK → User |
| createdAt | DateTime | |
| updatedAt | DateTime | |

Индексы: [category], [installs]

### Audit
| Поле | Тип | Описание |
|------|-----|----------|
| id | cuid | PK |
| skillId | String | FK → Skill |
| checkName | String | repository/license/activity/author/security |
| status | String | pass/warn/fail |
| details | String? | Детали проверки |
| createdAt | DateTime | Дата проверки |

Unique: [skillId, checkName]

### Comment
| Поле | Тип | Описание |
|------|-----|----------|
| id | cuid | PK |
| skillId | String | FK → Skill |
| userId | String | FK → User |
| text | String | Текст (max 1000) |
| createdAt | DateTime | |

## Миграции

```
0001_init          — User, Account, Skill
0002_author_telegram — authorName, telegramLink
0003_featured      — featured boolean
0004_audit         — Audit table
0005_moderation    — status field
0006_github_stars  — githubStars
0007_comments      — Comment table
```
