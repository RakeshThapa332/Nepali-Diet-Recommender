export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string,
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user?: {
        id: number;
        email: string;
    };
}