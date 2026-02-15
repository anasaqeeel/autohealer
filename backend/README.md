# TaskMaster Pro - Backend API

This is the backend API server for TaskMaster Pro, built with Node.js, Express, TypeScript, and MySQL.

## 🎯 Project Focus: DevOps & Observability

**Remember**: This project is primarily a **DevOps/SRE portfolio piece**. The backend exists to:
- Generate real traffic and data
- Demonstrate monitoring, logging, and self-healing capabilities
- Show production-ready infrastructure patterns

## 📋 Prerequisites

Before you start, make sure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Install Guide](https://dev.mysql.com/doc/refman/8.0/en/installing.html)
- **npm** or **yarn** package manager

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up MySQL Database

**Option A: Use the automated script (recommended)**

```bash
npm run setup-db
```

This script will:
- Create the database `taskmaster_pro`
- Create a user `taskmaster_user` with password `taskmaster_password`
- Grant necessary permissions

**Option B: Manual setup**

```sql
CREATE DATABASE taskmaster_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'taskmaster_user'@'localhost' IDENTIFIED BY 'taskmaster_password';
GRANT ALL PRIVILEGES ON taskmaster_pro.* TO 'taskmaster_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 3: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

The default `.env` file uses these values (which match the setup script):
- `DB_NAME=taskmaster_pro`
- `DB_USER=taskmaster_user`
- `DB_PASSWORD=taskmaster_password`
- `DB_HOST=localhost`
- `DB_PORT=3306`

**Important**: Change `JWT_SECRET` to a random string in production!

### Step 4: Start the Server

```bash
npm run dev
```

The server will:
1. Connect to MySQL
2. Create all database tables automatically (on first run)
3. Start listening on `http://localhost:3001`

### Step 5: Verify It's Working

Open your browser or use curl:

```bash
curl http://localhost:3001/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-02-15T...",
  "uptime": 1.234,
  "environment": "development"
}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── controllers/     # Request handlers (business logic)
│   ├── models/          # Sequelize database models
│   ├── routes/          # API route definitions
│   ├── middleware/      # Custom middleware (auth, validation, etc.)
│   ├── services/        # Business logic services
│   ├── utils/           # Helper functions
│   └── server.ts        # Main server file
├── scripts/             # Utility scripts (DB setup, migrations, etc.)
├── tests/               # Test files
└── dist/                # Compiled JavaScript (generated)
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server (requires `npm run build` first)
- `npm run setup-db` - Run database setup script

## 🗄️ Database Models

The backend uses **Sequelize ORM** to manage these models:

- **User** - System users
- **Organization** - Multi-tenant organizations
- **OrganizationMember** - User-Organization relationships
- **Project** - Projects within organizations
- **Task** - Tasks within projects
- **Comment** - Comments on tasks
- **Activity** - Activity/audit log

## 🔐 Authentication

Currently, authentication endpoints are not yet implemented. They will use:
- **JWT (JSON Web Tokens)** for stateless authentication
- **bcrypt** for password hashing
- Token stored in `Authorization: Bearer <token>` header

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Coming Soon
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/organizations` - List organizations
- `GET /api/projects` - List projects
- `GET /api/tasks` - List tasks
- ... and more

See `frontend/API_INTEGRATION.md` for the complete API contract.

## 🐳 Docker (Coming Soon)

The backend will be containerized with Docker for:
- Consistent development environments
- Easy deployment to Kubernetes
- CI/CD pipeline integration

## 📊 Monitoring & Observability (Coming Soon)

This is where the **real DevOps magic** happens:

- **Prometheus** - Metrics collection
- **Grafana** - Dashboards and visualization
- **ELK Stack** - Centralized logging
- **Health checks** - Kubernetes probes
- **Structured logging** - JSON logs for easy parsing

## 🧪 Testing

Tests will be added using:
- **Jest** - Unit and integration tests
- **Supertest** - HTTP endpoint testing

## 📝 Notes for DevOps Learning

### Why Sequelize?
- **ORM (Object-Relational Mapping)**: Write database queries in JavaScript/TypeScript instead of raw SQL
- **Connection pooling**: Automatically manages database connections (important for production)
- **Migrations**: Version control for database schema changes
- **Type safety**: TypeScript models catch errors at compile time

### Why TypeScript?
- **Type safety**: Catches bugs before runtime
- **Better IDE support**: Autocomplete, refactoring
- **Self-documenting**: Types serve as documentation
- **Professional standard**: Most modern Node.js projects use TypeScript

### Why the `/health` endpoint?
- **Kubernetes probes**: K8s uses this to check if your pod is alive
- **Load balancers**: Route traffic only to healthy instances
- **Monitoring tools**: Ping this to detect downtime
- **CI/CD**: Fail deployments if health check fails

## 🚨 Troubleshooting

### "Unable to connect to the database"
- Check if MySQL is running: `sudo systemctl status mysql`
- Verify database credentials in `.env`
- Make sure database and user were created: `npm run setup-db`

### "Port 3001 already in use"
- Change `PORT` in `.env` to a different port
- Or kill the process using port 3001: `lsof -ti:3001 | xargs kill`

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

## 📚 Next Steps

1. ✅ Database setup (you're here!)
2. ⏭️ Implement authentication endpoints
3. ⏭️ Implement CRUD endpoints for organizations, projects, tasks
4. ⏭️ Add Docker containerization
5. ⏭️ Set up monitoring stack (Prometheus, Grafana, ELK)
6. ⏭️ Create CI/CD pipeline (GitHub Actions)
7. ⏭️ Deploy to Kubernetes

---

**Remember**: This backend is the "patient" for your DevOps experiments. Keep it simple, focus on making it observable and reliable! 🚀
