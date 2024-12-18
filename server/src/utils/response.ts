export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
    success: true,
    data,
    message,
  });
  
  export const errorResponse = (error: string): ApiResponse<null> => ({
    success: false,
    error,
  });