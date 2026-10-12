# FixMyCampus 🏛️

**FixMyCampus** is a modern campus facility issue reporting and resolution platform designed for universities and colleges. It bridges students, campus administration, and maintenance departments through real-time ticket tracking, priority handling, and status lifecycle management.

---

## 📁 Project Architecture

The repository is organized into a decoupled frontend and backend:

```
fixmycampus/
├── frontend/               # React (Vite) Single Page Application
│   ├── src/
│   │   ├── components/     # Student Portal, Admin Dashboard, Dept Queue, Modals
│   │   ├── services/       # API client with live backend sync & fallback demo mode
│   │   ├── App.jsx         # Main application controller
│   │   └── index.css       # Core design system (glassmorphism, tokens, animations)
│   ├── package.json
│   └── vite.config.js      # Dev server with proxy to backend (/api -> localhost:8080)
│
├── backend/                # Spring Boot REST & MVC Application
│   ├── src/main/java/app/
│   │   ├── controller/     # ApiController (REST API), AdminController, StudentController, etc.
│   │   ├── model/          # Complaint, User, Department, StatusLog, etc.
│   │   ├── service/        # ComplaintService, UserService, FileStorageService
│   │   └── config/         # SecurityConfig (CORS, CSRF exemptions), DataSeeder, WebConfig
│   ├── pom.xml             # Maven dependencies
│   └── Dockerfile          # Container configuration
│
└── render.yaml             # Cloud deployment descriptor
```

---

## 🚀 Quick Start Guide

### 1. Frontend (React)

Make sure [Node.js](https://nodejs.org/) (v18+) is installed.

```bash
cd frontend
npm install
npm run dev
```

The React frontend will be accessible at **http://localhost:5173**.

> **Note:** The frontend includes an interactive simulation fallback mode. You can test all features (Student submission, Admin routing, Department resolution) immediately, even before starting the backend!

---

### 2. Backend (Spring Boot + MySQL)

Make sure [Java 17+](https://adoptium.net/) and Maven are installed.

```bash
cd backend
mvn spring-boot:run
```

The Spring Boot backend will run on **http://localhost:8080** and expose REST APIs at `/api/*`.

---

## 🔑 Default Accounts (Auto-seeded)

| Role | Email | Password | Scope |
|---|---|---|---|
| **Admin** | `admin@fixmycampus.edu` | `admin123` | Campus-wide overview, assign depts, set priorities, view analytics |
| **Department Staff** | `electrical@fixmycampus.edu` | `dept123` | Department queue, start work, resolve tickets |
| **Student** | Self-register or quick login | Any | Report issues, attach photo evidence, track lifecycle |

---

## 🔄 Complaint Lifecycle

```
SUBMITTED ──► ASSIGNED ──► IN_PROGRESS ──► RESOLVED ──► CLOSED
   │              │             │              │           │
(Student)      (Admin)     (Dept Staff)   (Dept Staff)  (Admin/Student)
```
