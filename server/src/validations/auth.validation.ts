import z from 'zod';

export const signupSchema = z.object({
    body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    role: z.enum(['CUSTOMER', 'RESTAURANT_OWNER']).optional(),
  }),
    });



export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Google token is required'),
  }),
});