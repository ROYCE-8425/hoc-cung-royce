# Building From Source Guide

This guide provides step-by-step instructions on how to set up, build, and run the **Học cùng Royce** platform from source code.

---

## 🛠️ Prerequisites

Make sure you have the following installed on your machine:

1. **Node.js** (v20.x or later) & **npm** (v10.x or later)
2. **Docker Desktop** (for running supporting databases and services)
3. **Git**

---

## 📂 Project Architecture

The project is structured as a monorepo containing two main parts:
- `/backend`: NestJS TypeScript REST API & WebSockets server.
- `/frontend`: React & Tailwind CSS web interface built with Vite.
- `/docker-compose.yml`: Local infrastructure setup (PostgreSQL, Redis, Qdrant, ClickHouse).

---

## ⚙️ Environment Variables Setup

Before running the application, copy the example environment files and update them with your API keys.

### 1. Backend Environment Setup
Navigate to `/backend` and copy `.env.example`:
```bash
cd backend
cp .env.example .env
```
Key variables to update in `backend/.env`:
*   `DATABASE_HOST`: PostgreSQL database host (e.g., `localhost` or `postgres`)
*   `DATABASE_PORT`: PostgreSQL port (e.g., `5433` for local compose setup or `5432`)
*   `DATABASE_NAME`: Database name (e.g., `studyield_dev`)
*   `DATABASE_USER` / `DATABASE_PASSWORD`: Database credentials
*   `REDIS_HOST` / `REDIS_PORT`: Redis service host and port
*   `QDRANT_HOST` / `QDRANT_PORT`: Qdrant vector database host and port
*   `CLICKHOUSE_HOST` / `CLICKHOUSE_PORT`: Clickhouse analytics database host and port
*   `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: Secure strings for JWT tokens
*   `OPENROUTER_API_KEY`: Gemini/Grok API gateway orchestration key

### 2. Frontend Environment Setup
Navigate to `/frontend` and copy `.env.example`:
```bash
cd ../frontend
cp .env.example .env
```
Key variables to update in `frontend/.env`:
*   `VITE_API_URL`: Backend API endpoint (set to `http://localhost:3010/api/v1`)
*   `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Web Client ID for Google Sign-In

---

## 🐳 Step 1: Run Infrastructure Databases (Docker)

To run Postgres, Redis, ClickHouse, and Qdrant locally, start them via Docker Compose:
```bash
docker compose --env-file .env.docker up -d postgres redis qdrant clickhouse
```
Verify databases are running and healthy:
```bash
docker compose ps
```

---

## 🚀 Step 2: Build & Run the Backend

1. Navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Run migrations to seed database schema:
   ```bash
   npm run migrate # runs migration scripts
   ```
4. Build the NestJS application:
   ```bash
   npm run build
   ```
5. Run the dev server:
   ```bash
   npm run start:dev
   ```
   *The backend will be live at `http://localhost:3010`, with Swagger documentation at `http://localhost:3010/api/v1/docs`.*

---

## 💻 Step 3: Build & Run the Frontend

1. Navigate to `/frontend`:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Build the React project using Vite:
   ```bash
   npm run build
   ```
4. Run the local dev server:
   ```bash
   npm run dev
   ```
   *The frontend web app will be live at `http://localhost:5189`.*

---

## 🧪 Verification Plan

To verify that your build is correct, check the following endpoints:
1. **Frontend App**: Open `http://localhost:5189` in your browser. The login screen and landing page should load.
2. **Backend API Health Check**: Visit `http://localhost:3010/api/v1/health` or `http://localhost:3010` and confirm it returns `{ "name": "Học cùng Royce API", ... }`.
3. **Swagger API Docs**: Open `http://localhost:3010/api/v1/docs` to interact with the API endpoints.

---

## 🐛 Reporting Issues

If you encounter build errors, please search the existing [GitHub Issues](https://github.com/ROYCE-8425/quiz_study/issues) or open a new one. Provide:
*   Your Node/npm version
*   Operating System details
*   Full terminal stack traces / error logs
