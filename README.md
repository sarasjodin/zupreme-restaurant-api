# Zupreme Restaurant API

Backend-API för Zupreme Restaurant, byggt med Node.js, Express och MySQL samt installerat på en VPS

Projektet använder:

- Node.js
- Express
- MySQL
- Docker
- JWT
- bcrypt

## Lokal databas

### Rensa lokal databas

> [!IMPORTANT]
> Detta raderar all data i den lokala MySQL-databasen

```bash
docker compose -f docker-compose.local.yml down -v
```

### Bygg och starta lokalt

Detta bygger containrarna och kör 01-schema.sql och 02-seed.sql när databasen skapas från början

```bash
docker compose -f docker-compose.local.yml up --build
```

### Seeda lokala användare

Vänta någon minut tills MySQL är healthy. Kör sedan från projektroten:

```bash
docker compose -f docker-compose.local.yml exec api node database/scripts/03-seed-users.js
```

## Produktionsdatabas

### Rensa produktionsdatabas

> [!CAUTION]
> Detta raderar all data i produktionsdatabasen

Använd endast detta om databasen verkligen ska tas bort

```bash
docker compose -f docker-compose.yml down -v
```

### Bygg och starta produktion

```bash
docker compose -f docker-compose.yml up --build
```

### Seeda produktionsanvändare

Vänta någon minut tills MySQL är healthy. Kör sedan från projektroten:

```bash
docker compose -f docker-compose.yml exec api node database/scripts/03-seed-users.js
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
| `POST` | `/api/auth/login` | Log in and receive a JWT   |
| `GET`  | `/api/auth/me`    | Get the authenticated user |

### Menu categories

| Method | Endpoint               | Description                   |
| ------ | ---------------------- | ----------------------------- |
| `GET`  | `/api/menu-categories` | Get all fixed menu categories |

### Menu

| Method   | Endpoint              | Description        |
| -------- | --------------------- | ------------------ |
| `GET`    | `/api/menu-items`     | Get all menu items |
| `GET`    | `/api/menu-items/:id` | Get a menu item    |
| `POST`   | `/api/menu-items`     | Create a menu item |
| `PATCH`  | `/api/menu-items/:id` | Update a menu item |
| `DELETE` | `/api/menu-items/:id` | Delete a menu item |

### Messages

| Method   | Endpoint            | Description      |
| -------- | ------------------- | ---------------- |
| `POST`   | `/api/messages`     | Send a message   |
| `GET`    | `/api/messages`     | Get all messages |
| `GET`    | `/api/messages/:id` | Get a message    |
| `PATCH`  | `/api/messages/:id` | Update a message |
| `DELETE` | `/api/messages/:id` | Delete a message |

### Users

| Method  | Endpoint         | Description   |
| ------- | ---------------- | ------------- |
| `GET`   | `/api/users`     | Get all users |
| `GET`   | `/api/users/:id` | Get a user    |
| `POST`  | `/api/users`     | Create a user |
| `PATCH` | `/api/users/:id` | Update a user |

- Ingen `DELETE /api/users/:id` implementeras. Användaren inaktiveras i stället med `PATCH` och `is_active: false`
