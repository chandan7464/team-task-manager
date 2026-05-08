Team Task Manager - Full Stack Assessment

=========================================
1. LIVE DEMO & REPOSITORY
=========================================
Live URL: [Add your Railway URL here]
Demo Video: [Add your Video link here]
GitHub Repo: [Add your GitHub link here]

=========================================
2. TECHNOLOGY STACK
=========================================
- Backend: Python, FastAPI, SQLAlchemy, SQLite (Local) / PostgreSQL (Production), JWT Auth
- Frontend: React.js, Vite, Tailwind CSS, Zustand, React Query

=========================================
3. LOCAL SETUP INSTRUCTIONS
=========================================
Make sure you have Python 3.10+ and Node.js 18+ installed.

Backend Setup:
1. cd backend
2. pip install -r requirements.txt
3. uvicorn app.main:app --reload --port 8000
(API runs on http://localhost:8000)

Frontend Setup:
1. cd frontend
2. npm install
3. npm run dev
(App runs on http://localhost:5173)

Demo Credentials (Auto-seeded):
- Admin: admin@taskmanager.com / Admin@123
- Member: john@taskmanager.com / Member@123

=========================================
4. RAILWAY DEPLOYMENT INSTRUCTIONS
=========================================
This app is designed as a Monorepo. To deploy on Railway:

1. Push this entire folder to GitHub.
2. In Railway, click "New" -> "Database" -> "Add PostgreSQL". Copy the DATABASE_URL.
3. Deploy the Backend:
   - Click "New" -> "GitHub Repo" -> Select your repo.
   - In Settings, set "Root Directory" to "/backend".
   - In Variables, add DATABASE_URL (from step 2), SECRET_KEY, and PORT=8000.
   - Generate a Domain for the backend. Copy it.
4. Deploy the Frontend:
   - Click "New" -> "GitHub Repo" -> Select the same repo.
   - In Settings, set "Root Directory" to "/frontend".
   - In Variables, add VITE_API_URL and set it to your new backend domain.
   - Generate a Domain. This is your Live URL!

=========================================
5. API DOCUMENTATION (Endpoints)
=========================================
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login
GET    /api/dashboard/stats  - Get role-aware dashboard stats
GET    /api/projects         - List projects (Admin: All, Member: Assigned)
POST   /api/projects         - Create project (Admin only)
GET    /api/tasks/project/ID - List tasks for project
POST   /api/tasks/project/ID - Create task (Admin only)
PATCH  /api/tasks/ID         - Update task status (Assigned Member or Admin)
DELETE /api/tasks/ID         - Delete task (Admin only)

=========================================
6. DATABASE SCHEMA
=========================================
- Users: id, username, email, password_hash, role
- Projects: id, name, description, owner_id
- ProjectMembers: project_id, user_id (Many-to-Many bridge)
- Tasks: id, title, description, status, due_date, project_id, assigned_to
