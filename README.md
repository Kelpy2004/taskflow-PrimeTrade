# TaskForge

TaskForge is a recruiter-ready full-stack task management assignment built on top of the existing dark glassmorphic dashboard UI. The project focuses on clean backend structure, secure authentication, role-based access control, task CRUD, audit visibility, and a simple frontend that makes the API easy to test.

## Why this project was built

This submission is designed to reflect the kind of practical backend work expected in an internship assignment:

- JWT authentication with secure password hashing
- Role-based access control for `admin` and `user`
- Task CRUD with ownership rules
- Admin stats, user directory, and audit logs
- Request validation, centralized error handling, and API hardening
- Swagger documentation and easy local setup

## Features

- Email/password registration and login
- Persistent frontend auth state using a Bearer token stored client-side for demo use
- Protected routes and admin-only route guards
- User-scoped task management
- Admin dashboard stats
- Admin users directory
- Admin audit logs
- Search, filtering, pagination, loading states, and empty states
- Task details modal (GET by id) and "Fetch by task id" support in the Tasks UI
- Logout endpoint (`POST /api/v1/auth/logout`)
- Swagger UI and a Postman collection
- Demo seed script for quick reviewer testing
- Optional Docker Compose setup (frontend + backend + MongoDB)

## Tech stack

### Frontend

- React
- Vite
- TypeScript
- React Router
- Recharts
- Existing glassmorphic dashboard styling from the prototype

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Zod
- Helmet
- CORS
- express-rate-limit
- Swagger

## Folder structure

```text
.
|-- src/
|   |-- components/
|   |-- context/
|   |-- lib/
|   |-- pages/
|   |-- types/
|   `-- main.tsx
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- docs/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- utils/
|   |   `-- validators/
|   |-- .env.example
|   `-- package.json
|-- .env.example
|-- package.json
`-- README.md
```

## Environment variables

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

### Backend `.env`

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/taskforge
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

## Setup instructions

### 1. Install dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd backend
npm install
```

### 2. Create environment files

- Copy the root `.env.example` to `.env`
- Copy `backend/.env.example` to `backend/.env`
- Fill in `MONGO_URI` and `JWT_SECRET`

### 3. Seed demo data

```bash
cd backend
npm run seed
```

The seed script creates one admin account and one standard user account for local testing.

## How to run backend

```bash
cd backend
npm run dev
```

Backend base URL:

```text
http://localhost:4000
```

## How to run frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

## Reviewer flow

1. Open the repo and read this README for setup and endpoint coverage.
2. Start MongoDB, then run the backend and frontend locally.
3. Use the locally seeded standard user account to verify task creation, updates, fetching, and deletion.
4. Create, update, fetch, and delete tasks from the Tasks page.
5. Sign out and sign in with the locally seeded admin account.
6. Open Dashboard to review system stats.
7. Open Users to review registered accounts and roles.
8. Open Audit Logs to review task activity history.
9. Open Swagger at `http://localhost:4000/api-docs`.

## API endpoint summary

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Tasks

- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

### Admin

- `GET /api/v1/admin/stats`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/tasks`
- `GET /api/v1/admin/logs`

## Role-based demo explanation

- `user` can create, view, edit, and delete only their own tasks
- `user` is blocked from admin routes and admin APIs
- `admin` can view all users
- `admin` can view all tasks
- `admin` can delete any task
- `admin` can access dashboard stats and audit logs

## Documentation

Swagger route:

```text
http://localhost:4000/api-docs
```

Postman collection:

```text
backend/src/docs/postman_collection.json
```

## Docker (optional)

If you have Docker installed, you can run everything with:

```bash
docker compose up --build
```

Then open:

- Frontend: `http://localhost:3000`
- Swagger: `http://localhost:4000/api-docs`

## Verification notes

The following were verified locally during implementation:

- Frontend lint passed with `npm run lint`
- Frontend production build passed with `npm run build`
- Backend import/syntax smoke test passed
- Live MongoDB-backed API flow passed for register, login, current user fetch, task create, task list, task update, task delete, admin users, admin tasks, admin stats, admin logs, and non-admin access denial for admin APIs

## Scalability note

This project is intentionally assignment-sized, but the structure is already set up for growth:

- Modular architecture: backend concerns are split into controllers, routes, models, middlewares, validators, and utils
- Future Redis caching: admin stats and high-read task queries can be cached without rewriting the route layer
- Horizontal scaling: JWT auth is stateless and the API can be replicated behind a load balancer
- Docker readiness: frontend and backend are already separated cleanly enough for containerization
- Service split potential: auth, tasks, and admin/reporting can later be extracted into separate services if scale or team ownership requires it

## Small limitations

- The frontend build currently emits a large chunk warning because the dashboard UI and charting remain in one bundle
- Full browser-level interaction testing was not automated here; the frontend was linted and built, and the backend flows were verified live against MongoDB
