import { useAuth } from "@/contexts/AuthContext";
import { TestConnection } from "@/components/TestConnection";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome {user?.name}!</h1>
        
        <div className="grid gap-6">
          <TestConnection />
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Featured Restaurants</h2>
            <p className="text-gray-600">
              Start exploring restaurants near you...
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
            <p className="text-gray-600">
              Your order history will appear here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}