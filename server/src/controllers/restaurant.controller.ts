import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response';
import { constants } from '../config/constants';

const prisma = new PrismaClient();

export const RestaurantController = {
  async getRestaurants(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(
        parseInt(req.query.limit as string) || constants.DEFAULT_PAGE_SIZE,
        constants.MAX_PAGE_SIZE
      );
      const offset = (page - 1) * limit;

      const restaurants = await prisma.restaurant.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          rating: 'desc'
        }
      });

      const total = await prisma.restaurant.count();

      return res.json(
        successResponse({
          restaurants,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        })
      );
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return res.status(500).json(errorResponse('Error fetching restaurants'));
    }
  },

  async getRestaurantById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const restaurant = await prisma.restaurant.findUnique({
        where: { id }
      });

      if (!restaurant) {
        return res.status(404).json(errorResponse('Restaurant not found'));
      }

      return res.json(successResponse(restaurant));
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      return res.status(500).json(errorResponse('Error fetching restaurant'));
    }
  }
};