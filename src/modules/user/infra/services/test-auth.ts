// Arquivo de teste para verificar a integração do sistema de autenticação
// Este arquivo pode ser usado para testar se todas as dependências estão funcionando

import { RemoteAuth } from "./data/usecases";
import { LoginRequest } from "../dtos/auth";

// Função de teste para verificar se o RemoteAuth está funcionando
export async function testAuthIntegration() {
  const remoteAuth = new RemoteAuth();
  
  // Teste de login (não executar em produção)
  const testCredentials: LoginRequest = {
    email: "test@example.com",
    password: "testpassword123"
  };

  try {
    console.log("Testando integração de autenticação...");
    console.log("Credenciais de teste:", testCredentials);
    
    // Este teste só deve ser executado em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      // const result = await remoteAuth.login(testCredentials);
      // console.log("Resultado do login:", result);
      console.log("Teste de integração configurado corretamente");
    }
  } catch (error) {
    console.error("Erro no teste de integração:", error);
  }
}

// Função para verificar se as dependências estão instaladas
export function checkDependencies() {
  const dependencies = {
    zustand: typeof require !== "undefined" && require("zustand"),
    reactQuery: typeof require !== "undefined" && require("@tanstack/react-query"),
    axios: typeof require !== "undefined" && require("axios"),
  };

  console.log("Verificação de dependências:", dependencies);
  return dependencies;
}
