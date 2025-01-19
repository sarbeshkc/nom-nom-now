import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import { PrismaClient } from '@prisma/client';
import { errorResponse } from './utils/response';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(express.json());

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'Database connection failed', error });
  }
});

// Mount auth routes
app.use('/api/auth', authRoutes);

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running and connected successfully!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json(errorResponse('Internal server error'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
