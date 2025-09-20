import { useAuth } from "./useAuth";
import { useAuthStore } from "../store/auth-store";

export function useIsAuthenticated(): boolean {
  const { auth } = useAuth();
  const { _hasHydrated } = useAuthStore();
  
  // Aguardar a hidratação antes de verificar autenticação
  if (!_hasHydrated) {
    return false;
  }
  
  if (!auth) {
    return false;
  }

  // Verificar se o token de acesso não expirou
  const tokenExpiration = new Date(auth.access_token_expires_at);
  const now = new Date();

  return tokenExpiration > now;
}
