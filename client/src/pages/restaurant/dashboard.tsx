// client/src/pages/restaurant/dashboard.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Package, DollarSign, Star, Clock, Settings, Bell } from 'lucide-react';
import RestaurantMenuPage from './menu';
import { OrdersList } from '@/components/restaurant/orders-list';
// import { RevenueChart } from '@/components/restaurant/revenue-chart';

interface DashboardStats {
  todayOrders: number;
  totalRevenue: number;
  averageRating: number;
  pendingOrders: number;
}

interface Order {
  id: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; }>;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
}

export default function RestaurantDashboard() {
  const { restaurantId } = useParams();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/restaurant/${restaurantId}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'NEW_ORDER':
          setActiveOrders(prev => [data.order, ...prev]);
          toast({
            title: 'New Order Received',
            description: `Order #${data.order.id} from ${data.order.customerName}`,
          });
          break;
        
        case 'ORDER_STATUS_UPDATED':
          setActiveOrders(prev =>
            prev.map(order =>
              order.id === data.orderId
                ? { ...order, status: data.status }
                : order
            )
          );
          break;
        
        case 'STATS_UPDATED':
          setStats(data.stats);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to establish real-time connection',
        variant: 'destructive',
      });
    };

    setWebsocket(ws);

    return () => {
      ws.close();
    };
  }, [restaurantId]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}/dashboard`);
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data.stats);
          setActiveOrders(data.data.activeOrders);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [restaurantId]);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      setActiveOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      toast({
        title: 'Status Updated',
        description: `Order #${orderId} status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingOrders}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Orders Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Active Orders</CardTitle>
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {/* <OrdersList 
                    // orders={activeOrders} 
                    onUpdateStatus={updateOrderStatus}
                  /> */}
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <RevenueChart restaurantId={restaurantId!} /> */}
                </CardContent>
              </Card>
            </div>

            {/* Menu Management Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Menu Management</CardTitle>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Menu
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* <RestaurantMenuPage restaurantId={restaurantId!} /> */}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Accept New Orders
                  </Button>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Pause New Orders
                  </Button>
                  <Button className="w-full" variant="outline">
                    Download Reports
                  </Button>
                  <Button className="w-full" variant="outline">
                    Update Business Hours
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* We'll create a separate ReviewsList component later */}
                  <div className="text-sm text-gray-500">
                    No recent reviews to display
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}