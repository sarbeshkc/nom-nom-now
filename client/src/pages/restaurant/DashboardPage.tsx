// src/pages/restaurant/DashboardPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Users 
} from 'lucide-react';

export default function RestaurantDashboardPage() {
  // These would normally come from your API
  const stats = [
    {
      title: "Today's Orders",
      value: "12",
      icon: ShoppingBag,
      trend: "+2.5%",
    },
    {
      title: "Today's Revenue",
      value: "Rs. 15,240",
      icon: DollarSign,
      trend: "+4.3%",
    },
    {
      title: "Total Customers",
      value: "432",
      icon: Users,
      trend: "+12.5%",
    },
    {
      title: "Avg. Order Value",
      value: "Rs. 1,270",
      icon: TrendingUp,
      trend: "+1.2%",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.trend} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add more dashboard components here */}
    </div>
  );
}

