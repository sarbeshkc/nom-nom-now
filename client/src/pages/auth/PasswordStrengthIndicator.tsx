// src/components/auth/PasswordStrengthIndicator.tsx

import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  // Calculate password strength
  const calculateStrength = (password: string): number => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };

    // Add 20 points for each passed check
    Object.values(checks).forEach((passed) => {
      if (passed) strength += 20;
    });

    // Additional length bonuses
    if (password.length > 12) strength += 10;
    if (password.length > 16) strength += 10;

    // Bonus for combination of character types
    const typesCount = Object.values(checks).filter(Boolean).length;
    if (typesCount >= 4) strength += 10;
    if (typesCount === 5) strength += 10;

    // Cap the strength at 100
    return Math.min(strength, 100);
  };

  const strength = calculateStrength(password);

  // Determine the strength category and color
  const getStrengthInfo = (strength: number): { label: string; color: string } => {
    if (strength === 0) return { label: 'No Password', color: 'bg-gray-200' };
    if (strength < 30) return { label: 'Very Weak', color: 'bg-red-500' };
    if (strength < 50) return { label: 'Weak', color: 'bg-orange-500' };
    if (strength < 75) return { label: 'Moderate', color: 'bg-yellow-500' };
    if (strength < 90) return { label: 'Strong', color: 'bg-green-500' };
    return { label: 'Very Strong', color: 'bg-emerald-500' };
  };

  const strengthInfo = getStrengthInfo(strength);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Password Strength:</span>
        <span className={`font-medium ${strengthInfo.color.replace('bg-', 'text-')}`}>
          {strengthInfo.label}
        </span>
      </div>
      
      <Progress
        value={strength}
        className="h-2"
        indicatorClassName={`transition-all ${strengthInfo.color}`}
      />
      
      {/* Password requirements checklist */}
      <div className="space-y-1 text-sm">
        <p className={password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}>
          ✓ At least 8 characters
        </p>
        <p className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
          ✓ At least one uppercase letter
        </p>
        <p className={/[a-z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
          ✓ At least one lowercase letter
        </p>
        <p className={/[0-9]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
          ✓ At least one number
        </p>
        <p className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
          ✓ At least one special character
        </p>
      </div>
    </div>
  );
}
