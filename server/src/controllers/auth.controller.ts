import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../utils/response';
import { constants } from '../config/constants';

const prisma = new PrismaClient();

export const AuthController = {
  signup: async (req: Request, res: Response) => {
    try {
      console.log('Signup request body:', req.body);

      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json(errorResponse('All fields are required'));
      }

      if (password.length < constants.PASSWORD_MIN_LENGTH) {
        return res.status(400).json(
          errorResponse(`Password must be at least ${constants.PASSWORD_MIN_LENGTH} characters`)
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json(errorResponse(`User with email ${email} already exists`));
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'USER'
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: constants.JWT_EXPIRY }
      );

      return res.status(201).json(successResponse({ user, token }, 'User created successfully'));
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json(errorResponse('Error creating user'));
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json(errorResponse('Email and password are required'));
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json(errorResponse('Invalid credentials'));
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json(errorResponse('Invalid credentials'));
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: constants.JWT_EXPIRY }
      );

      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      };

      return res.json(
        successResponse({ user: userWithoutPassword, token }, 'Login successful')
      );
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json(errorResponse('Error logging in'));
    }
  }
};