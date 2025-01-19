// src/types/verification.types.ts

export type VerificationType = 'EMAIL' | 'PHONE' | 'IDENTITY' | 'BUSINESS';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'FAILED' | 'EXPIRED';
export type VerificationMethod = 'CODE' | 'LINK' | 'DOCUMENT';

export interface VerificationRequest {
  id: string;
  type: VerificationType;
  userId: string;
  method: VerificationMethod;
  status: VerificationStatus;
  value: string; // Email or phone being verified
  code?: string;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface BusinessVerification extends VerificationRequest {
  businessId: string;
  documents: {
    type: 'LICENSE' | 'PERMIT' | 'CERTIFICATION';
    url: string;
    status: VerificationStatus;
    notes?: string;
  }[];
  reviewerId?: string; // Admin who reviewed
  reviewNotes?: string;
}

export interface VerificationTemplate {
  type: VerificationType;
  subject: string;
  message: string;
  expiryHours: number;
  maxAttempts: number;
}

export interface CodeVerificationDTO {
  type: VerificationType;
  code: string;
}

export interface ResendVerificationDTO {
  type: VerificationType;
  value: string;
}
