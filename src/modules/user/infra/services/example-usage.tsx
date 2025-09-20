"use client";

import React from "react";
import { useAuth } from "./hooks/useAuth";

// Exemplo de componente de login
export function LoginForm() {
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      await login.handleLogin({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Senha" required />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? "Entrando..." : "Entrar"}
      </button>
      {login.error && <p style={{ color: "red" }}>{login.error}</p>}
    </form>
  );
}

// Exemplo de componente que mostra informações do usuário
export function UserInfo() {
  const { auth, logout } = useAuth();

  if (!auth) {
    return <p>Usuário não autenticado</p>;
  }

  return (
    <div>
      <h2>Bem-vindo, {auth.user.name}!</h2>
      <p>Email: {auth.user.email}</p>
      <p>Session ID: {auth.session_id}</p>
      <button onClick={logout.handleLogout}>Sair</button>
    </div>
  );
}

// Exemplo de componente principal
export function AuthExample() {
  const { auth } = useAuth();

  return (
    <div>
      <h1>Sistema de Autenticação</h1>
      {auth ? <UserInfo /> : <LoginForm />}
    </div>
  );
}
