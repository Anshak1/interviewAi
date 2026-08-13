AI Interview Platform

An AI-powered interview platform that conducts technical interviews, evaluates candidate responses, and provides a performance score.

🚀 Features

* 🤖 AI-powered interviews
* 💬 Interactive interview experience
* 🧠 Automatic evaluation and scoring
* 💻 Coding problem submissions
* ⚡ Redis-based job queue
* 🔧 Background worker for code execution
* 🗄️ PostgreSQL database with Prisma ORM
* 🔐 Express.js backend API
* ⚛️ React frontend

🏗️ Architecture

React Frontend
      │
      │ HTTP API
      ▼
Express Backend
      │
      ├──────────────► PostgreSQL
      │                  │
      │                Prisma
      │
      └──────────────► Redis Queue
                           │
                           ▼
                         Worker
                           │
                           ▼
                  Code Execution

🛠️ Tech Stack

Frontend

* React
* TypeScript
* Vite
* shadcn/ui

Backend

* Node.js
* Express.js
* TypeScript
* Prisma
* PostgreSQL

Infrastructure

* Redis
* Background workers
* Docker/sandboxed code execution

📁 Project Structure

project/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── ...
│
├── worker/
│   ├── src/
│   ├── code/
│   └── ...
│
└── README.md

⚙️ Getting Started

1. Clone the repository

git clone <your-repository-url>
cd <project-directory>

2. Install dependencies

Install dependencies for each service:

cd frontend
npm install
cd ../backend
npm install
cd ../worker
npm install

🔐 Environment Variables

Backend

Create a .env file in the backend:

PORT=3000
DATABASE_URL="your-postgresql-connection-string"
REDIS_URL="your-redis-connection-string"
FRONTEND_URL="http://localhost:5173"

Frontend

Create a .env file:

VITE_API_URL="http://localhost:3000"

Never commit .env files or API keys to GitHub.

🗄️ Database Setup

Run Prisma migrations:

npx prisma migrate dev

Generate the Prisma client:

npx prisma generate

For production deployments, use:

npx prisma migrate deploy

▶️ Running Locally

Start the frontend

cd frontend
npm run dev

The frontend will usually run on:

http://localhost:5173

Start the backend

cd backend
npm run dev

Start the worker

cd worker
npm run dev

The application should now be available locally.

🔄 Submission Flow

When a candidate submits code:

Candidate
   │
   ▼
React Frontend
   │
   ▼
Express API
   │
   ├── Save submission
   │
   └── Push job to Redis
             │
             ▼
           Worker
             │
             ├── Get submission
             ├── Compile code
             ├── Execute code
             ├── Capture output
             └── Update submission status

🚀 Deployment

The recommended production setup is:

Service	Recommended Platform
React frontend	Vercel
Express API	Render / Railway
PostgreSQL	Neon / Supabase / Railway
Redis	Upstash
Worker	Render / Railway / dedicated server

Frontend

Build the React application:

npm run build

Deploy the generated dist directory.

Backend

The backend should listen on the port supplied by the hosting platform:

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

Worker

Deploy the worker as a separate service/process from the Express API.

Web Service
    │
    ▼
Express API
    │
    ▼
Redis
    │
    ▼
Worker Service

⚠️ Security

Because this platform executes user-submitted code, code execution must be isolated.

Production execution should have restrictions on:

* CPU usage
* Memory usage
* Execution time
* Filesystem access
* Network access
* Process creation
* User permissions

Do not execute arbitrary user code directly on the host machine.

📌 Future Improvements

* Authentication
* Interview history
* Detailed candidate reports
* AI-generated interview questions
* Difficulty-based questions
* Code execution sandbox
* Real-time interview feedback
* Leaderboard
* Admin dashboard
* Docker-based isolated execution
* Production monitoring and logging

📄 License

This project is currently for educational and development purposes.