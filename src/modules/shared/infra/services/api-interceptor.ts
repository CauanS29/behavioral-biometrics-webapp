import { AxiosInstance } from "axios";
import { useAuthStore } from "@/modules/user/infra/services/store/auth-store";

export function setupApiInterceptors(api: AxiosInstance) {
  // Interceptor para adicionar token de acesso automaticamente
  api.interceptors.request.use(
    (config) => {
      const auth = useAuthStore.getState().auth;
      if (auth?.access_token) {
        config.headers.Authorization = `Bearer ${auth.access_token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para tratar erros de token expirado
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Se o erro for 401 (não autorizado) e não for uma tentativa de renovação
      if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('renew-access-token')) {
        originalRequest._retry = true;

        try {
          const auth = useAuthStore.getState().auth;
          if (auth?.refresh_token) {
            // Tentar renovar o token usando a rota correta
            const response = await api.post("/users/renew-access-token", {
              refresh_token: auth.refresh_token,
            });

            const { access_token, access_token_expires_at } = response.data;

            // Atualizar o store com o novo token
            useAuthStore.getState().setAuth({
              ...auth,
              access_token,
              access_token_expires_at,
            });

            // Adicionar o novo token à requisição original
            originalRequest.headers.Authorization = `Bearer ${access_token}`;

            // Repetir a requisição original
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("Erro ao renovar token:", refreshError);
          // Se a renovação falhar, fazer logout
          useAuthStore.getState().setAuth(null);
          window.location.href = "/";
        }
      }

      return Promise.reject(error);
    }
  );
}
