//server/src/types/profile.types.ts

import { User } from '@prisma/client';

export interface UserProfileResponse extends Omit<User, 'password' | 'resetToken' | 'resetTokenExpiry' | 'verificationToken'> {
  addresses?: AddressResponse[];
  orders?: OrderResponse[];
  reviews?: ReviewResponse[];
}

export interface AddressResponse {
  id: string;
  userId: string;
  label: string;
  street: string;
  ward: string;
  city: string;
  province: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  userId: string;
  restaurantId: string;
  items: OrderItemResponse[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  restaurant?: {
    name: string;
    image?: string;
  };
}

export interface OrderItemResponse {
  id: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: Record<string, any>;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface ReviewResponse {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  restaurantId: string;
  orderId: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  restaurant?: {
    name: string;
  };
}

//server/src/controllers/profile.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response';
import { uploadToS3, deleteFromS3 } from '../utils/s3';
import { UserProfileResponse } from '../types/profile.types';

const prisma = new PrismaClient();

export const ProfileController = {
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          addresses: true,
          orders: {
            include: {
              restaurant: {
                select: {
                  name: true,
                  image: true
                }
              }
            },
            take: 5,
            orderBy: { createdAt: 'desc' }
          },
          reviews: {
            include: {
              restaurant: {
                select: { name: true }
              }
            },
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!user) {
        return res.status(404).json(errorResponse('User not found'));
      }

      const { password, resetToken, resetTokenExpiry, verificationToken, ...userProfile } = user;

      return res.json(successResponse<UserProfileResponse>(userProfile));
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json(errorResponse('Failed to fetch profile'));
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { name, phone } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name, phone },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          emailVerified: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return res.json(successResponse(updatedUser));
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json(errorResponse('Failed to update profile'));
    }
  },

  async uploadAvatar(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json(errorResponse('No file uploaded'));
      }

      // Upload to S3
      const uploadResult = await uploadToS3(file, `avatars/${userId}`);

      // Delete old avatar if exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true }
      });

      if (user?.avatar) {
        await deleteFromS3(user.avatar);
      }

      // Update user with new avatar URL
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatar: uploadResult.Location },
        select: {
          id: true,
          avatar: true
        }
      });

      return res.json(successResponse({ avatarUrl: updatedUser.avatar }));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return res.status(500).json(errorResponse('Failed to upload avatar'));
    }
  },

  async deleteAvatar(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true }
      });

      if (user?.avatar) {
        await deleteFromS3(user.avatar);
      }

      await prisma.user.update({
        where: { id: userId },
        data: { avatar: null }
      });

      return res.json(successResponse({ message: 'Avatar deleted successfully' }));
    } catch (error) {
      console.error('Error deleting avatar:', error);
      return res.status(500).json(errorResponse('Failed to delete avatar'));
    }
  }
};