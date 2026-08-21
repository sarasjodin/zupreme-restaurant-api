# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

- Placeholder for upcoming changes and planned features

- Step 6. Users & Roles for role-based "admin only" - OPTIONAL
  - GET /api/users
  - GET /api/users/:id
  - POST /api/users
  - PATCH /api/users/:id

  ***

## [0.6.0] - 2026-08-21

### Added

- Another protected CRUD flow where endpoints require authentication with a valid JWT:
  - GET /api/messages (all)
  - GET /api/messages?status=unread / ?status=read / ?status=handled
  - GET /api/messages/:id
  - PATCH /api/messages/:id
  - DELETE /api/messages/:id

---

## [0.5.0] - 2026-08-20

### Added

- First protected CRUD flow where endpoints require authentication with a valid JWT:
  - GET /api/menu-items?include_unavailable=true
  - POST /api/menu-items
  - PATCH /api/menu-items/:id
  - DELETE /api/menu-items/:id

---

## [0.4.0] - 2026-08-19

### Added

- Authentication endpoints:
  - public POST /api/auth/login
  - protected GET /api/auth/me
  - including `authMiddleware.js` with `export function requireAuth()`

---

## [0.3.0] - 2026-08-19

### Added

- public POST /api/messages
- error handling to prevent invalid json body text

---

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
