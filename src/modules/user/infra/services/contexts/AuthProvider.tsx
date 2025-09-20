"use client";

import React, { createContext } from "react";
import { AuthContextData } from "./types";
import { useAuthStore } from "@/modules/user/infra/services/store/auth-store";
import { RemoteAuth } from "@/modules/user/infra/services/data/usecases";
import { useMutation } from "@tanstack/react-query";
import { AuthProviderProps } from "./types";
import { Auth } from "@/modules/user/infra/models/auth";
import { LoginFormData } from "@/modules/user/infra/factories/presentation/pages/LoginPage/validation";
import { RemoteError } from "@/modules/shared/infra/errors/remote-error";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const { setAuth, auth } = useAuthStore();

  const { mutateAsync: login, isPending, error, data } = useMutation<
    Auth,
    RemoteError,
    LoginFormData
  >({
    mutationFn: async (data: LoginFormData) => {
      const userAuth = await new RemoteAuth().login({
        email: data.email,
        password: data.password,
      });

      setAuth(userAuth);
      return userAuth;
    },
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    await login(data);
  };

  const handleLogout = async () => {
    setAuth(null);
    router.push("/");
  };

  const handleRefreshAccessToken = async () => {
    try {
      if (!auth?.refresh_token) {
        throw new Error("No refresh token available");
      }
      
      const response = await new RemoteAuth().renewAccessToken({
        refresh_token: auth.refresh_token,
      });
      
      if (auth) {
        setAuth({
          ...auth,
          access_token: response.access_token,
          access_token_expires_at: response.access_token_expires_at,
        });
      }
    } catch (error) {
      handleLogout();
    }
  };

  const contextValue: AuthContextData = {
    login: {
      handleLogin,
      isPending,
      error: error?.response?.data?.message,
      data,
    },
    auth,
    logout: {
      handleLogout,
    },
    refreshAccessToken: {
      handleRefreshAccessToken,
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
