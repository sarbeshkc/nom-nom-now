export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
}


export type UserRole = 'User' | 'ADMIN' | 'RESRAURANT_OWNER';


export interface AuthState {
    user : User | null;
    isAuthenciated: boolean;
    loading: boolean;
    error: string | null;
}


export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    email: string;
    password: string;
    name: string;
}


export interface AuthResponse {
    success: boolean;
    data?:{
        user: User;
        token: string;
    };
    error?:string;
    message?:string;
}


export interface AuthCOntextType {
    user : User | null;
    isAUthenticated: boolean;
    loading: boolean;
    error: string | null;
    login : (credentials: LoginCredentials) => Promise<void>;
    signup : (credentials: SignupCredentials) => Promise<void>;
    logout : () => void;
    clearError: () => void;
}