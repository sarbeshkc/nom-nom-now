// client/src/services/payment.service.ts
import api from './api';

interface EsewaPaymentData {
  amount: number;
  tax_amount: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number;
  product_delivery_charge: number;
  success_url: string;
  failure_url: string;
}

export const PaymentService = {
  async initializeEsewa(data: EsewaPaymentData) {
    try {
      const response = await api.post('/payment/initialize-esewa', data);
      return response.data;
    } catch (error) {
      console.error('eSewa initialization error:', error);
      throw error;
    }
  },

  async verifyEsewa(data: { pid: string; refId: string; amt: string }) {
    try {
      const response = await api.post('/payment/verify-esewa', data);
      return response.data;
    } catch (error) {
      console.error('eSewa verification error:', error);
      throw error;
    }
  }
};