// src/controllers/profile.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: 'uploads/avatars/',
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export const ProfileController = {
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          phoneNumbers: true,
          addresses: true
        }
      });

      if (!user) {
        return res.status(404).json(errorResponse('User not found'));
      }

      // Remove sensitive information
      const { password, ...userWithoutPassword } = user;
      return res.json(successResponse(userWithoutPassword));
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json(errorResponse('Error fetching profile'));
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { name, bio, phoneNumbers, addresses } = JSON.parse(req.body.data);

      // Handle avatar upload
      const avatarUrl = req.file ? `/uploads/avatars/${req.file.filename}` : undefined;

      // Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          bio,
          ...(avatarUrl && { avatar: avatarUrl }),
          // Update phone numbers
          phoneNumbers: {
            deleteMany: {},
            create: phoneNumbers.map((phone: any) => ({
              number: phone.number,
              isPrimary: phone.isPrimary
            }))
          },
          // Update addresses
          addresses: {
            deleteMany: {},
            create: addresses.map((address: any) => ({
              street: address.street,
              city: address.city,
              province: address.province,
              ward: address.ward,
              isPrimary: address.isPrimary
            }))
          }
        },
        include: {
          phoneNumbers: true,
          addresses: true
        }
      });

      const { password, ...userWithoutPassword } = updatedUser;
      return res.json(successResponse(userWithoutPassword));
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json(errorResponse('Error updating profile'));
    }
  },

  async deleteAvatar(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      await prisma.user.update({
        where: { id: userId },
        data: { avatar: null }
      });

      return res.json(successResponse({ message: 'Avatar deleted successfully' }));
    } catch (error) {
      console.error('Delete avatar error:', error);
      return res.status(500).json(errorResponse('Error deleting avatar'));
    }
  }
};
