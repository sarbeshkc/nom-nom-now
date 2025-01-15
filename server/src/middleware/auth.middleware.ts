import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { errorResponse } from '../utils/response';
import dotenv from "dotenv"

const prisma = new PrismaClient();
const JWT_SECRET = "468f637742d5a13c9e7f2b1a5bcea268150df4822158a3ff99f4f2f37d84a6095fac9c7c8b0c9ba137ec8f36c9cd22b54054e20cb8ab2599f34d23a8ad3bb43a"
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json(errorResponse('Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json(errorResponse('Invalid token'));
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(errorResponse('Invalid token'));
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(errorResponse('Not authorized to access this resource'));
    }
    next();
  };
};