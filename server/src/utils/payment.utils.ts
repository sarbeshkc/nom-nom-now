import crypto from 'crypto';
import type { EsewaPaymentRequest } from '@/types/payment.type';

export const generateTransactionId = (): string => {
  return `TX-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
};

export const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

export const validateAmount = (amount: number): boolean => {
  if (isNaN(amount) || !isFinite(amount)) {
    return false;
  }
  
  if (amount < 10 || amount > 100000) {
    return false;
  }
  
  return true;
};

export const prepareEsewaPayment = (
  amount: number,
  transactionId: string,
  deliveryCharge = 0,
  serviceCharge = 0,
  taxAmount = 0
): EsewaPaymentRequest => {
  if (!process.env.ESEWA_SECRET_KEY || !process.env.ESEWA_PRODUCT_CODE) {
    throw new Error('eSewa configuration missing');
  }

  const totalAmount = amount + deliveryCharge + serviceCharge + taxAmount;
  
  if (!validateAmount(totalAmount)) {
    throw new Error('Invalid amount');
  }

  const formattedAmount = formatAmount(amount);
  const formattedTotal = formatAmount(totalAmount);

  const paymentData = {
    amount: formattedAmount,
    tax_amount: formatAmount(taxAmount),
    total_amount: formattedTotal,
    transaction_uuid: transactionId,
    product_code: process.env.ESEWA_PRODUCT_CODE,
    product_service_charge: formatAmount(serviceCharge),
    product_delivery_charge: formatAmount(deliveryCharge),
    success_url: `${process.env.APP_URL}/payment/success`,
    failure_url: `${process.env.APP_URL}/payment/failure`,
    signed_field_names: 'transaction_uuid,amount,total_amount'
  };

  // Generate signature
  const signatureString = `transaction_uuid=${transactionId},amount=${formattedAmount},total_amount=${formattedTotal}`;
  const signature = crypto
    .createHmac('sha256', process.env.ESEWA_SECRET_KEY)
    .update(signatureString)
    .digest('base64');

  return {
    ...paymentData,
    signature
  };
};

export const verifyEsewaSignature = (
  data: string,
  signature: string,
  secretKey: string
): boolean => {
  const calculatedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(data)
    .digest('base64');

  return calculatedSignature === signature;
};