import api from "@/modules/shared/infra/services/api";
import { 
    LoginRequest, 
    LoginResponse, 
    RenewAccessTokenRequest, 
    RenewAccessTokenResponse 
} from "../../../dtos/auth";
import { Auth } from "../../../models/auth";

export class RemoteAuth {
    
    async login({email, password}: LoginRequest): Promise<Auth> {
        const response = await api.post<LoginResponse>('/users/login', { email, password });
        return response.data;
    }

    async renewAccessToken({refresh_token}: RenewAccessTokenRequest): Promise<RenewAccessTokenResponse> {
        const response = await api.post<RenewAccessTokenResponse>('/users/renew-access-token', { refresh_token });
        return response.data;
    }

    async refreshAccessToken(refreshToken: string): Promise<Auth> {
        const response = await this.renewAccessToken({ refresh_token: refreshToken });
        
        // Como o renewAccessToken retorna apenas o access token, precisamos reconstruir o objeto Auth
        // Isso assume que o refresh token ainda é válido e que temos acesso aos dados do usuário
        // Em uma implementação real, você pode querer fazer uma chamada adicional para obter os dados do usuário
        throw new Error("Method needs to be implemented with proper user data retrieval");
    }
}
