import { z } from "zod"; 

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export type LoginDTO = z.infer<typeof loginSchema>;

// Tipagens baseadas na estrutura do backend
export interface UserResponse {
    name: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: UserResponse;
    session_id: string;
    refresh_token: string;
    access_token_expires_at: string; // ISO string from backend
    refresh_token_expires_at: string; // ISO string from backend
}

export interface RenewAccessTokenRequest {
    refresh_token: string;
}

export interface RenewAccessTokenResponse {
    access_token: string;
    access_token_expires_at: string; // ISO string from backend
}

// Schema de validação para renovação de token
export const renewTokenSchema = z.object({
    refresh_token: z.string(),
});

export type RenewTokenDTO = z.infer<typeof renewTokenSchema>;