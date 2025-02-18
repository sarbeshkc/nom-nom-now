export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface PaymentDetails {
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  provider: 'ESEWA' | 'CASH' | 'KHALTI';
  createdAt: Date;
  updatedAt: Date;
}

export interface EsewaPaymentRequest {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export interface EsewaPaymentResponse {
  transaction_code: string;
  status: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
  signature: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  message: string;
  data?: {
    transactionCode: string;
    amount: string;
    status: string;
    transactionId: string;
  };
  error?: string;
}