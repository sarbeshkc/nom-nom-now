# Nom Nom Now 🍽️

A modern food delivery application based in Kathmandu, simplifying local food ordering with a seamless user experience.

## 🚀 Features
- User-friendly food ordering platform
- Google OAuth authentication
- Secure JWT-based authentication
- Responsive design with TailwindCSS
- Real-time order tracking

## 💻 Tech Stack

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State Management**: React Query
- **Routing**: React Router

### Backend
- **Runtime**: Node.js + TypeScript
- **Web Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: 
  - JWT Authentication
  - OAuth2 (Google Sign-In)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL
- npm
- Google Developer Account (for OAuth)

## 📦 Project Structure

```
nom-nom-now/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── vite.config.ts
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── prisma/
│       └── schema.prisma
│
└── README.md
```

## 🚧 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/sarbeshkc/nom-nom-now
cd nom-nom-now
```

### 2. Install Dependencies
```bash
# Root dependencies
npm install

# Client dependencies
cd client && npm install

# Server dependencies
cd ../server && npm install
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb nom_nom_now

# Navigate to server directory
cd server

# Copy environment template
cp .env.example .env
```

### 4. Environment Configuration
Create and configure the following environment files:

#### Server Environment (`server/.env`)
```env
# Database Configuration
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/nom_nom_now"

# Authentication Secrets
JWT_SECRET="your_strong_jwt_secret_here"
JWT_ACCESS_SECRET="your_access_token_secret"
JWT_REFRESH_SECRET="your_refresh_token_secret"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Email Service
EMAIL_USER="your_email@gmail.com"
EMAIL_PASSWORD="your_app_specific_password"

# Optional Configuration
PORT=4000
NODE_ENV=development
CLIENT_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"

# Token Expirations
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"
```

#### Client Environment (`client/.env`)
```env
VITE_API_URL="http://localhost:4000/api"
```

### 5. Database Migrations
```bash
# Run database migrations
npx prisma migrate dev

# Seed initial data
npm run seed
```

### 6. Start Development Servers
```bash
# From root directory
npm run dev
```

## 🔐 OAuth Setup Guide

### Google OAuth Configuration
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project → APIs & Services → Credentials
3. Create OAuth Client ID (Web Application)
4. Add authorized redirect URI: `http://localhost:4000/api/auth/google/callback`
5. Copy Client ID and Client Secret to `.env`

### Email Setup
- For Gmail: Use App Passwords (enable 2-factor authentication first)
- For other providers: Update SMTP settings accordingly

## ⚠️ Security Notes
- **Never commit `.env` files to version control**
- Use strong, unique secrets (64+ random characters)
- Regenerate all example secrets before production deployment




## 📞 Contact
Sarbesh KC - [sarbeshckcc07@gmail.com]

Project Link: [https://github.com/sarbeshkc/nom-nom-now](https://github.com/sarbeshkc/nom-nom-now)
