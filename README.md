# Zupreme Restaurant API

Backend-API för Zupreme Restaurant, byggt med Node.js, Express och MySQL samt installerat på en VPS

<img width="515" height="512" alt="image" src="https://github.com/user-attachments/assets/e2f98c35-ac55-46cd-ac26-93352a4da364" />


Projektet använder:

- Node.js
- Express
- MySQL
- Docker
- JWT
- bcrypt

## Docker Compose – lokal miljö och produktion

| Åtgärd | Lokal miljö | Produktion |
| --- | --- | --- |
| **Bygg och starta** | `docker compose -f docker-compose.local.yml up -d --build` | `docker compose -f docker-compose.yml up -d --build` |
| **Stäng ner miljön** | `docker compose -f docker-compose.local.yml down` | `docker compose -f docker-compose.yml down` |
| **Starta miljön igen** | `docker compose -f docker-compose.local.yml up -d` | `docker compose -f docker-compose.yml up -d` |
| **Radera databas/volymer** | `docker compose -f docker-compose.local.yml down -v` | `docker compose -f docker-compose.yml down -v` |
| **Seeda användare** | `docker compose -f docker-compose.local.yml exec api node database/scripts/03-seed-users.js` | `docker compose -f docker-compose.yml exec api node database/scripts/03-seed-users.js` |

### Bygg och starta

Vid första uppstart från en tom databas körs `01-schema.sql` och `02-seed.sql` när MySQL-volymen skapas.

För lokal utveckling:

```bash
docker compose -f docker-compose.local.yml up -d --build

```

### Seed-filer

Databasfilerna ligger i:

```
database/
├── 01-schema.sql
├── 02-seed.sql
└── scripts/
        └── 03-seed-users.js

```

- 01-schema.sql skapar databastabellerna
- 02-seed.sql lägger in grunddata för meny, kategorier och meddelanden
- 03-seed-users.js skapar admin- och editor-användare med bcrypt-hashade lösenord från miljövariabler

## Endpoints

### Health

| Method | Endpoint                                                                 | Description                   |
| ------ | ------------------------------------------------------------------------ | ----------------------------- |
| `GET`  | [`/api/health`](https://zupreme-restaurant-api.sarasjodin.se/api/health) | Check API and database status |

### Authentication

| Method | Endpoint          | Description                |
| ------ | ----------------- | -------------------------- |
| `POST` | [`/api/auth/login`](https://zupreme-restaurant-admin.sarasjodin.se/) | Log in and receive a JWT   |
| `GET`  | [`/api/auth/me`](https://zupreme-restaurant-api.sarasjodin.se/api/auth/me)    | Get the authenticated user |

### Menu categories

| Method | Endpoint               | Description                   |
| ------ | ---------------------- | ----------------------------- |
| `GET`  | [`/api/menu-categories`](https://zupreme-restaurant-api.sarasjodin.se/api/menu-categories) | Get all fixed menu categories |

### Menu

| Method   | Endpoint              | Description        |
| -------- | --------------------- | ------------------ |
| `GET`    | [`/api/menu-items`](https://zupreme-restaurant-api.sarasjodin.se/api/menu-items)     | Get all menu items |
| `GET`    | [`/api/menu-items/:id`](https://zupreme-restaurant-api.sarasjodin.se/api/menu-items/4) | Get a menu item    |
| `POST`   | `/api/menu-items`     | Create a menu item |
| `PATCH`  | `/api/menu-items/:id` | Update a menu item |
| `DELETE` | `/api/menu-items/:id` | Delete a menu item |

### Messages

| Method   | Endpoint            | Description      |
| -------- | ------------------- | ---------------- |
| `POST`   | [`/api/messages`](https://zupreme-restaurant-api.sarasjodin.se/api/messages)     | Send a message   |
| `GET`    | `/api/messages`     | Get all messages |
| `GET`    | `/api/messages/:id` | Get a message    |
| `PATCH`  | `/api/messages/:id` | Update a message |
| `DELETE` | `/api/messages/:id` | Delete a message |

### Users (ännu inte implementerat)

| Method  | Endpoint         | Description   |
| ------- | ---------------- | ------------- |
| `GET`   | `/api/users`     | Get all users |
| `GET`   | `/api/users/:id` | Get a user    |
| `POST`  | `/api/users`     | Create a user |
| `PATCH` | `/api/users/:id` | Update a user |

- Ingen `DELETE /api/users/:id` implementeras. Användaren inaktiveras i stället med `PATCH` och `is_active: false`
