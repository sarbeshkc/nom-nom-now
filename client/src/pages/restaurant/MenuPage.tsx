import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export default function RestaurantMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Chicken Momo',
      description: 'Steamed dumplings filled with minced chicken',
      price: 180,
      category: 'Appetizers',
      available: true,
    },
  ]);

  // Add more states and handlers for menu management...

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      <div className="grid gap-4">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-sm font-medium mt-1">
                  Rs. {item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

