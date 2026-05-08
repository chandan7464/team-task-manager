# Team Task Manager

A full-stack project management application with role-based access control, built using FastAPI (Python) and React (Vite + Tailwind CSS).

## 🚀 Live Demo & Repository
- **Live URL:** [Add your Railway URL here]
- **Demo Video:** [Add your Video link here]

## 🛠️ Technology Stack
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite (Local) / PostgreSQL (Production), JWT Auth, bcrypt
- **Frontend:** React.js, Vite, Tailwind CSS, Zustand (State Management), React Query, Lucide Icons

## ⚙️ Features
1. **Authentication:** Secure JWT-based Login and Registration.
2. **Role-Based Access Control (RBAC):**
   - **Admin:** Can create projects, add members, create tasks, and delete tasks.
   - **Member:** Can only view assigned projects and update the status of tasks assigned to them.
3. **Dashboard:** Displays total tasks, completed, in-progress, pending, and overdue statistics dynamically based on user role.
4. **Kanban Board:** Drag-and-drop style columns for To-Do, In Progress, and Done tasks.
5. **Relationships:** Strict PostgreSQL/SQLite relational mapping (Users ↔ Projects ↔ Tasks).

---

## 💻 Local Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
Navigate to the backend folder and install the Python dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`*
*Interactive API documentation is available at `http://localhost:8000/docs`*

### 2. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install the Node dependencies:
```bash
cd frontend
npm install
```

Run the React development server:
```bash
npm run dev
```
*The web app will be available at `http://localhost:5173`*

---

## 🌐 Railway Deployment Guide (Mandatory Step)

To deploy this full-stack application on Railway, follow these exact steps:

### 1. Push to GitHub
First, commit your entire `Team Task Manager` folder to a new GitHub repository.

### 2. Provision Database on Railway
1. Go to your [Railway Dashboard](https://railway.app/).
2. Click **New Project** -> **Provision PostgreSQL**.
3. Once created, click on the Postgres service -> **Variables** tab, and copy the `DATABASE_URL`.

### 3. Deploy the Backend
1. In your Railway project, click **New** -> **GitHub Repo** and select your repository.
2. Go to the Settings of the newly created service.
3. Scroll down to **Root Directory** and type `/backend` (Important!).
4. Go to the **Variables** tab and add:
   - `DATABASE_URL`: (Paste the URL you copied earlier)
   - `SECRET_KEY`: (Type any random long string, e.g., `my-super-secret-production-key`)
   - `PORT`: `8000`
5. Railway will automatically use the `backend/Procfile` to run the FastAPI app. Wait for it to deploy and generate a public Domain for this backend service. Copy this URL.

### 4. Deploy the Frontend
1. In the same Railway project, click **New** -> **GitHub Repo** and select the *same* repository again.
2. Go to the Settings of this second service.
3. Scroll down to **Root Directory** and type `/frontend` (Important!).
4. Go to the **Variables** tab and add:
   - `VITE_API_URL`: (Paste the public domain URL of your backend service, e.g., `https://backend-production.up.railway.app`)
5. Railway will automatically detect it's a Vite React app, build it, and serve it.
6. Generate a public Domain for the frontend. **This is your Live URL!**

---

## 🗄️ Database Schema Diagram

- **Users**: `id` (UUID), `username`, `email`, `password_hash`, `role` (Admin/Member)
- **Projects**: `id` (UUID), `name`, `description`, `owner_id` (FK to Users)
- **Project Members**: `project_id` (FK), `user_id` (FK) -> *Many-to-Many relationship table*
- **Tasks**: `id` (UUID), `title`, `description`, `status` (Enum), `due_date`, `project_id` (FK), `assigned_to` (FK to Users)

---

## 🔑 Demo Credentials (Local Testing)
The database automatically seeds itself on the first run with these users:
- **Admin**: `admin@taskmanager.com` / `Admin@123`
- **Member**: `john@taskmanager.com` / `Member@123`
