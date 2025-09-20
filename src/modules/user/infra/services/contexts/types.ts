import { ReactNode } from "react";
import { Auth } from "@/modules/user/infra/models/auth";

export interface AuthContextData {
  login: {
    handleLogin: (data: { email: string; password: string }) => Promise<void>;
    isPending: boolean;
    error: string | undefined;
    data: Auth | undefined;
  };
  auth: Auth | null;
  logout: {
    handleLogout: () => Promise<void>;
  };
  refreshAccessToken: {
    handleRefreshAccessToken: () => Promise<void>;
  };
}

export interface AuthProviderProps {
  children: ReactNode;
}
