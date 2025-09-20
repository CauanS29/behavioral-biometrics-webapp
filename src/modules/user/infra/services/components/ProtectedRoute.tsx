"use client";

import React from "react";
import { useIsAuthenticated } from "../hooks/useIsAuthenticated";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = "/" 
}: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const { _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Só redirecionar após a hidratação estar completa
    if (_hasHydrated && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, _hasHydrated, router, redirectTo]);

  // Mostrar loading durante a hidratação
  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
