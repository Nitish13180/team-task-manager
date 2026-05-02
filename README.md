# Team Task Manager 🚀

A full-stack web application for managing projects and tasks with role-based access control (Admin/Member).

## Tech Stack
- **Frontend**: React + Vite + React Router
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Auth**: JWT (JSON Web Tokens)
- **Deploy**: Railway

## Features
- 🔐 Authentication (Signup/Login with JWT)
- 👥 Role-based access (Admin / Member)
- 📁 Project management (Admin can create/delete)
- ✅ Task creation, assignment & status tracking
- 📊 Dashboard with stats (total, todo, in-progress, done, overdue)

## Local Setup

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd team-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000
npm run dev
```

## MongoDB Atlas Setup (Free)
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0
5. Get connection string and paste in backend `.env`

## Railway Deployment

### Deploy Backend
1. Push code to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub → select your repo
4. Select `backend` folder as root
5. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = any random string
   - `PORT` = 5000
6. Copy the Railway backend URL

### Deploy Frontend
1. New service in same Railway project
2. Select `frontend` folder
3. Add environment variable:
   - `VITE_API_URL` = your backend Railway URL
4. Build command: `npm run build`
5. Start command: `npx serve dist`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Projects (Admin: full CRUD, Member: read)
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Tasks
- `GET /api/tasks` - Get tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task status
- `DELETE /api/tasks/:id` - Delete task (Admin)
- `GET /api/tasks/stats/dashboard` - Dashboard stats
