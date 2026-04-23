# TaskForge

TaskForge is a full-stack task management system built as a backend-focused internship assignment. It provides JWT authentication, role-based access control, task CRUD, admin reporting, audit logs, Swagger docs, and a React frontend for testing the APIs. 

## Live Links
- live: https://taskflow-primetrade.onrender.com
- 
- Swagger Docs: http://localhost:4000/api-docs/ 

## Demo Credentials
### Admin
- Email: admin@taskforge.local
- Password: Password123
### User
- Email: user@taskforge.local
- Password: Password123

## What It Does

- Registers and logs in users with hashed passwords
- Issues JWT tokens and protects private routes
- Supports two roles: `user` and `admin`
- Lets users create, read, update, and delete only their own tasks
- Lets admins view all tasks, all users, platform stats, and audit logs
- Tracks task activity through audit log entries
- Exposes documented REST APIs through Swagger and Postman

## Recruiter Requirements Coverage

This project meets the assignment requirements:

- Authentication: register, login, logout, current-user endpoint, password hashing, JWT auth
- Role-based access: `user` and `admin` with ownership and admin-only guards
- CRUD API: full task CRUD with correct access rules
- Validation and error handling: Zod validation, centralized errors, invalid ObjectId handling, correct HTTP status codes
- Database: MongoDB + Mongoose models for users, tasks, and activity logs
- Basic frontend: login, register, protected app, task CRUD, success/error states
- Documentation: Swagger UI plus Postman collection
- Scalability thinking: modular backend structure, Docker readiness, caching and service-split notes in this README

## How It Is Organized

The project is split into a frontend at the repo root and a backend inside `backend/`.

- Frontend responsibilities:
  - Routing and protected views
  - Auth state management
  - Task, users, dashboard, and audit-log screens
  - API requests and download/export helpers
- Backend responsibilities:
  - Auth, task, and admin REST endpoints
  - Validation, middleware, RBAC, and centralized error handling
  - MongoDB models and activity logging
  - Swagger docs and seed data

## Folder Structure

```text
.
|-- src/
|   |-- components/
|   |   |-- layout/
|   |   `-- modals/
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
|-- Dockerfile
|-- docker-compose.yml
|-- package.json
`-- README.md
```

## Skills And Technologies Used

- Frontend: React, Vite, TypeScript, React Router, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth and security: JWT, bcryptjs, Helmet, CORS, express-rate-limit
- Validation and API quality: Zod, centralized error handling, route middleware
- Documentation and tooling: Swagger, Postman collection, Docker
