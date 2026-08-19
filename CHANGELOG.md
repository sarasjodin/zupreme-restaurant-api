# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

- Placeholder for upcoming changes and planned features
- Step 3. Authentication
    - POST /api/auth/login
    - GET /api/auth/me
- Step 4. First protected CRUD flow
    - GET /api/menu-items?include_unavailable=true
    - POST /api/menu-items
    - PATCH /api/menu-items/:id
    - DELETE /api/menu-items/:id
- Step 5. Messages
    - GET /api/messages
    - GET /api/messages/:id
    - GET /api/messages?status=unread
    - PATCH /api/messages/:id
    - DELETE /api/messages/:id
- Step 6. Users & Roles
    - GET /api/users
    - GET /api/users/:id
    - POST /api/users
    - PATCH /api/users/:id

## [0.3.0] - 2026-08-19

### Added

- public POST /api/messages
- error handling to prevent invalid json body text

## [0.2.0] - 2026-08-18

### Added

- public GET /api/menu-items endpoint
- public GET /api/menu-items/:id endpoint

---

## [0.1.0] - 2026-08-18

### Added

- `CHANGELOG.md` for tracking project changes
- Health check controller and `GET /api/health` route
- First public `GET /api/menu-categories` endpoint
- Shared MySQL database connection pool
- Express application with CORS, JSON parsing and 404 handling
- API server startup and environment-based configuration

## Legend

- **Added**: new features or components
- **Changed**: updates to existing behavior
- **Deprecated**: soon-to-be removed features
- **Removed**: deprecated features now gone
- **Fixed**: bug fixes
- **Security**: security-related fixes or enhancements
- **Notes**: related comments, limitations, or clarifications
