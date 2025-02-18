// client/src/components/payment/PaymentComponent.tsx
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PaymentService } from '@/services/payment.service';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

interface PaymentProps {
  amount: number;
  orderId: string;
}

export function PaymentComponent({ amount, orderId }: PaymentProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEsewaPayment = async () => {
    try {
      setIsProcessing(true);

      const paymentData = {
        amount: amount,
        tax_amount: 0,
        total_amount: amount,
        transaction_uuid: uuidv4(),
        product_code: orderId,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `${window.location.origin}/payment/success`,
        failure_url: `${window.location.origin}/payment/failure`
      };

      const response = await PaymentService.initializeEsewa(paymentData);
      
      if (response.success) {
        // Redirect to eSewa payment page
        window.location.href = response.data.payment_url;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handleEsewaPayment} 
      disabled={isProcessing}
      className="bg-[#60BB46] hover:bg-[#60BB46]/90"
    >
      {isProcessing ? 'Processing...' : 'Pay with eSewa'}
    </Button>
  );
}