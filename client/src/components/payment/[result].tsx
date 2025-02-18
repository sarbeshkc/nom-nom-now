import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle } from 'lucide-react';
import api from '@/services/api';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      const data = searchParams.get('data');
      if (!data) {
        navigate('/payment/failure');
        return;
      }

      try {
        const response = await api.post('/payment/verify-esewa', { data });

        if (response.data.success) {
          // Get transaction info from session storage
          const transactionInfo = sessionStorage.getItem('esewa_transaction');
          if (transactionInfo) {
            const { orderId } = JSON.parse(transactionInfo);
            sessionStorage.removeItem('esewa_transaction');
            navigate(`/order/${orderId}`);
          } else {
            navigate('/orders');
          }

          toast({
            title: "Payment Successful",
            description: "Your order has been confirmed!"
          });
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        navigate('/payment/failure');
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Processing Payment
          </h1>
          <p className="text-gray-600 mb-6">
            Please wait while we verify your payment...
          </p>
          <div className="animate-pulse w-8 h-8 bg-gray-200 rounded-full mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}

export function PaymentFailure() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Payment Failed",
      description: "There was a problem processing your payment.",
      variant: "destructive"
    });

    // Clear the transaction info
    sessionStorage.removeItem('esewa_transaction');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-6 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't process your payment. This could be due to:
            <ul className="mt-4 text-left list-disc pl-8">
              <li>Insufficient balance</li>
              <li>Transaction timeout</li>
              <li>Connection issues</li>
              <li>Payment was cancelled</li>
            </ul>
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => window.history.back()}
              className="w-full bg-[#FF4D00] hover:bg-[#FF4D00]/90"
            >
              Try Again
            </Button>
            <Button
              onClick={() => navigate('/orders')}
              variant="outline"
              className="w-full"
            >
              View Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}