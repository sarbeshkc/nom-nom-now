import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/cart-store";
import { PaymentComponent } from '@/components/payment/PaymentComponent';
import { CreditCard, Wallet } from 'lucide-react';

interface PaymentStepProps {
  orderId: string;
  onBack: () => void;
  onComplete: () => void;
}

export function PaymentStep({ orderId, onBack, onComplete }: PaymentStepProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const cart = useCartStore();
  const [selectedMethod, setSelectedMethod] = useState<'ESEWA' | 'CASH' | null>(null);

  const handlePaymentComplete = () => {
    toast({
      title: "Payment Successful",
      description: "Your order has been confirmed!"
    });
    onComplete();
    cart.clearCart();
  };

  const handlePaymentError = (error: Error) => {
    toast({
      title: "Payment Failed",
      description: error.message,
      variant: "destructive"
    });
  };

  const handleCashOnDelivery = async () => {
    try {
      // Update order status for cash on delivery
      const response = await fetch(`/api/orders/${orderId}/cod`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to process cash on delivery');
      }

      toast({
        title: "Order Confirmed",
        description: "Your order will be delivered soon. Please keep cash ready for delivery."
      });
      
      onComplete();
      cart.clearCart();
      navigate(`/order/${orderId}`);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* eSewa Payment Option */}
        <Card 
          className={`cursor-pointer transition-all ${
            selectedMethod === 'ESEWA' ? 'ring-2 ring-[#60BB46]' : ''
          }`}
          onClick={() => setSelectedMethod('ESEWA')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#60BB46]/10 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-[#60BB46]" />
              </div>
              <div>
                <h3 className="font-semibold">Pay with eSewa</h3>
                <p className="text-sm text-gray-500">Fast and secure payment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash on Delivery Option */}
        <Card 
          className={`cursor-pointer transition-all ${
            selectedMethod === 'CASH' ? 'ring-2 ring-[#FF4D00]' : ''
          }`}
          onClick={() => setSelectedMethod('CASH')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#FF4D00]/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#FF4D00]" />
              </div>
              <div>
                <h3 className="font-semibold">Cash on Delivery</h3>
                <p className="text-sm text-gray-500">Pay when you receive</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedMethod === 'ESEWA' && (
        <PaymentComponent
          orderId={orderId}
          items={cart.items}
          total={cart.total()}
          onPaymentComplete={handlePaymentComplete}
          onError={handlePaymentError}
        />
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        
        {selectedMethod === 'CASH' && (
          <Button 
            onClick={handleCashOnDelivery}
            className="bg-[#FF4D00] hover:bg-[#FF4D00]/90"
          >
            Confirm Order
          </Button>
        )}
      </div>

      <div className="border-t pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>NPR {cart.subtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>NPR {cart.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>NPR {cart.total().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}