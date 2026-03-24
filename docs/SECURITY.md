# Безопасность

## Аутентификация
- GitHub OAuth через NextAuth 5
- JWT сессии (не database sessions — экономия RAM)
- Сессионные cookies: httpOnly, secure, sameSite

## Авторизация
- Публичные API: GET без авторизации
- Мутации (submit, comment): требуют GitHub OAuth
- Админ API: проверка user ID из ADMIN_USER_IDS env
- Admin ID НЕ в коде, только в серверном .env

## Аудит навыков (5 проверок)
1. **Repository** — существует, публичный
2. **License** — наличие лицензии
3. **Activity** — последний коммит < 6 месяцев
4. **Author** — аккаунт GitHub > 30 дней
5. **Security** — сканирование SKILL.md на опасные паттерны

### Опасные паттерны (10)
- `rm -rf /`
- `curl | bash`, `wget | sh`
- `eval(`, `exec(`
- `process.env.*`
- `/etc/passwd`, `/etc/shadow`
- `chmod 777`
- `base64 -d`

## Rate Limiting
- `/api/skills/install`: 10 секунд на навык на IP
- Требуется версия CLI (`v` в body)
- In-memory rate limit map с автоочисткой

## Модерация
- Новые навыки → status: "pending"
- Ручное одобрение админом
- Reject = удаление из БД

## Инфраструктура
- PostgreSQL не доступен снаружи (только Docker network)
- UFW: только порты 22, 80, 443
- .env: chmod 600 (только owner)
- SSH ключи: деплой-ключ + авторизованные пользователи
- Docker build cache: автоочистка (предотвращение disk full)
- Нет CORS заголовков (cross-origin запросы блокированы)
