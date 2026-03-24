# Деплой

## Сервер

- **IP**: <SERVER_IP>
- **Провайдер**: Yandex Cloud
- **ОС**: Ubuntu
- **CPU/RAM**: 2 cores / 1.9 GB
- **Диск**: 69 GB
- **SSH**: `ssh ubuntu@<SERVER_IP>`

## Docker Compose

```yaml
services:
  traefik    — reverse proxy, TLS, :80/:443
  app        — Next.js standalone, :3000
  postgres   — PostgreSQL 16, :5432 (internal)
```

Лимиты памяти: traefik 64m, app 384m, postgres 256m.

## CI/CD

### deploy.yml (на push в main)
1. `actions/checkout` — код
2. `rsync` на сервер (исключая .git, .env, node_modules)
3. SSH → `docker compose build --parallel && up -d`
4. `docker builder prune -af --filter until=1h`

### publish-cli.yml (при изменении cli/)
1. Сравнивает version в package.json с npm
2. Если новая → `npm publish --access public`

### publish-create.yml (при изменении create-skillsbd/)
Аналогично.

## Env переменные (.env на сервере)

| Переменная | Описание |
|-----------|----------|
| POSTGRES_PASSWORD | Пароль PostgreSQL |
| NEXTAUTH_SECRET | Секрет для JWT сессий |
| GITHUB_CLIENT_ID | GitHub OAuth App |
| GITHUB_CLIENT_SECRET | GitHub OAuth App |
| GITHUB_TOKEN | GitHub API (5000 req/hour) |
| ADMIN_USER_IDS | Админы через запятую (cuid) |
| CRON_SECRET | Токен для /api/cron/* |

## Cron (на сервере)

```
0 * * * *   — аудит + синхронизация звёзд
30 4 * * *  — очистка Docker build cache
```

## DNS

- Cloudflare: skillsbd.ru → <SERVER_IP> (DNS only, grey cloud)
- NS: amalia.ns.cloudflare.com, dane.ns.cloudflare.com
- TXT: yandex-verification для Яндекс Вебмастер
