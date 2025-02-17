// server/src/controllers/restaurant.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response';
import { WebSocket } from 'ws';
import { Restaurant } from '../models/restaurant.model'

const prisma = new PrismaClient();

// Store WebSocket connections for real-time updates
const restaurantConnections = new Map<string, WebSocket>();

export const RestaurantController = {
  async register(req: Request, res: Response) {
    try {
      const restaurantData = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json(errorResponse('User not authenticated'));
      }

      // Check if user already has a restaurant
      const existingRestaurant = await prisma.restaurant.findUnique({
        where: { userId }
      });

      if (existingRestaurant) {
        return res.status(400).json(errorResponse('User already has a registered restaurant'));
      }

      // Create restaurant with pending status
      const restaurant = await prisma.restaurant.create({
        data: {
          ...restaurantData,
          userId,
          status: 'PENDING'
        }
      });

      // Send email notification to admin for review
      // await EmailService.sendRestaurantRegistrationNotification(restaurant);

      return res.status(201).json(successResponse(restaurant, 'Restaurant registration submitted for review'));
    } catch (error) {
      console.error('Restaurant registration error:', error);
      return res.status(500).json(errorResponse('Error registering restaurant'));
    }
  },

  async updateRestaurant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user?.id;

      const restaurant = await prisma.restaurant.findUnique({
        where: { id }
      });

      if (!restaurant) {
        return res.status(404).json(errorResponse('Restaurant not found'));
      }

      if (restaurant.userId !== userId) {
        return res.status(403).json(errorResponse('Not authorized to update this restaurant'));
      }

      const updatedRestaurant = await prisma.restaurant.update({
        where: { id },
        data: updateData
      });

      // Notify connected clients about the update
      const ws = restaurantConnections.get(id);
      if (ws) {
        ws.send(JSON.stringify({
          type: 'RESTAURANT_UPDATED',
          data: updatedRestaurant
        }));
      }

      return res.json(successResponse(updatedRestaurant));
    } catch (error) {
      console.error('Restaurant update error:', error);
      return res.status(500).json(errorResponse('Error updating restaurant'));
    }
  },

  async getDashboardData(req: Request, res: Response) {
    try {
      const restaurantId = req.params.id;
      const userId = req.user?.id;

      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        include: {
          orders: {
            where: {
              createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
              }
            }
          }
        }
      });

      if (!restaurant) {
        return res.status(404).json(errorResponse('Restaurant not found'));
      }

      if (restaurant.userId !== userId) {
        return res.status(403).json(errorResponse('Not authorized to access this dashboard'));
      }

      // Calculate dashboard statistics
      const todayOrders = restaurant.orders.length;
      const totalRevenue = restaurant.orders.reduce((sum, order) => sum + order.total, 0);
      const pendingOrders = restaurant.orders.filter(order => order.status === 'PENDING').length;

      const dashboardData = {
        todayOrders,
        totalRevenue,
        pendingOrders,
        averageRating: restaurant.rating,
        recentOrders: restaurant.orders.slice(0, 5)
      };

      return res.json(successResponse(dashboardData));
    } catch (error) {
      console.error('Dashboard data error:', error);
      return res.status(500).json(errorResponse('Error fetching dashboard data'));
    }
  },

  async updateMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { menuItems } = req.body;
      const userId = req.user?.id;

      const restaurant = await prisma.restaurant.findUnique({
        where: { id }
      });

      if (!restaurant) {
        return res.status(404).json(errorResponse('Restaurant not found'));
      }

      if (restaurant.userId !== userId) {
        return res.status(403).json(errorResponse('Not authorized to update menu'));
      }

      const updatedRestaurant = await prisma.restaurant.update({
        where: { id },
        data: {
          menu: menuItems
        }
      });

      // Notify connected clients about menu update
      const ws = restaurantConnections.get(id);
      if (ws) {
        ws.send(JSON.stringify({
          type: 'MENU_UPDATED',
          data: menuItems
        }));
      }

      return res.json(successResponse(updatedRestaurant.menu));
    } catch (error) {
      console.error('Menu update error:', error);
      return res.status(500).json(errorResponse('Error updating menu'));
    }
  },

  async toggleAvailability(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const restaurant = await prisma.restaurant.findUnique({
        where: { id }
      });

      if (!restaurant) {
        return res.status(404).json(errorResponse('Restaurant not found'));
      }

      if (restaurant.userId !== userId) {
        return res.status(403).json(errorResponse('Not authorized to update availability'));
      }

      const updatedRestaurant = await prisma.restaurant.update({
        where: { id },
        data: {
          isOpen: !restaurant.isOpen
        }
      });

      // Notify connected clients about availability change
      const ws = restaurantConnections.get(id);
      if (ws) {
        ws.send(JSON.stringify({
          type: 'AVAILABILITY_UPDATED',
          data: { isOpen: updatedRestaurant.isOpen }
        }));
      }

      return res.json(successResponse({ isOpen: updatedRestaurant.isOpen }));
    } catch (error) {
      console.error('Availability toggle error:', error);
      return res.status(500).json(errorResponse('Error updating availability'));
    }
  },

  // WebSocket connection handler
  handleWebSocketConnection(ws: WebSocket, restaurantId: string) {
    restaurantConnections.set(restaurantId, ws);

    ws.on('close', () => {
      restaurantConnections.delete(restaurantId);
    });

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        // Handle different types of WebSocket messages
        switch (data.type) {
          case 'PING':
            ws.send(JSON.stringify({ type: 'PONG' }));
            break;
          // Add more message handlers as needed
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
  }
};

export default RestaurantController;