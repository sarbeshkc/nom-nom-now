Here's a clean and straightforward `README.md`:

```markdown
# Nom Nom Now

A food delivery application based in Kathmandu, built with React (Vite), Node.js, and PostgreSQL.

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- React Query
- React Router

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm

## Project Structure

```
nom-nom-now/
├── client/                 
│   ├── src/
│   │   ├── components/    
│   │   ├── hooks/        
│   │   ├── pages/        
│   │   ├── services/     
│   │   └── utils/        
│   └── package.json
├── server/                
│   ├── src/
│   │   ├── controllers/  
│   │   ├── models/       
│   │   ├── routes/       
│   │   └── utils/        
│   ├── prisma/          
│   └── package.json
└── package.json
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd nom-nom-now
```

2. Install dependencies:
```bash
# Root dependencies
npm install

# Client dependencies
cd client && npm install

# Server dependencies
cd ../server && npm install
```

3. Database setup:
```bash
# Create database
createdb nom_nom_now

# Setup environment variables
cd server
cp .env.example .env
# Update DATABASE_URL in .env with your PostgreSQL credentials

# Run migrations
npx prisma migrate dev

# Seed the database
npm run seed
```

4. Start development servers:
```bash
# In root directory
npm run dev
```

This will start:
- Frontend server on http://localhost:3000
- Backend server on http://localhost:4000

## Environment Variables

### Server (.env)
```env
PORT=4000
DATABASE_URL="postgresql://postgres:password@localhost:5432/nom_nom_now"
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:3000"
```

### Client (.env)
```env
VITE_API_URL="http://localhost:4000/api"
```

## Available Scripts

In the project root directory:
```bash
npm run dev          # Run both frontend and backend
npm run dev:client   # Run only frontend
npm run dev:server   # Run only backend
```

## Features

- Restaurant listing and search
- Menu management
- Order processing
- Real-time order tracking
- User authentication
- Restaurant reviews and ratings

## API Routes

### Public Routes
- `GET /api/health` - Health check
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details

### Protected Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile
```

Also create a `.gitignore` file in the root directory:

```gitignore
# Dependencies
node_modules
.pnp
.pnp.js

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build
dist
build

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea
.vscode
*.swp
*.swo
.DS_Store
Thumbs.db

# Testing
coverage

# Prisma
prisma/*.db
```
