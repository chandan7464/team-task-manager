# Team Task Manager

A full-stack project management application with role-based access control, built using FastAPI (Python) and React (Vite + Tailwind CSS).

## 🚀 Live Demo & Repository
- **Live URL:** https://adorable-love-production.up.railway.app
- **Demo Video:** https://www.loom.com/share/ef80dc0b11fd469a987c1603250f8a8e
- **GitHub Repo:** https://github.com/chandan7464/team-task-manager

## 🛠️ Technology Stack
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite (Local) / PostgreSQL (Production), JWT Auth, bcrypt
- **Frontend:** React.js, Vite, Tailwind CSS, Zustand, React Query, Lucide Icons

## ⚙️ Features
1. **Authentication:** Secure JWT-based Login and Registration.
2. **Role-Based Access Control (RBAC):**
   - **Admin:** Can create projects, add members, create tasks, and delete tasks.
   - **Member:** Can only view assigned projects and update the status of tasks assigned to them.
3. **Dashboard:** Role-aware stats (total, completed, in-progress, pending, overdue).
4. **Kanban Board:** Drag-and-drop columns for To-Do, In Progress, and Done.

## 💻 Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Demo Credentials
- **Admin:** admin@taskmanager.com / Admin@123
- **Member:** john@taskmanager.com / Member@123
