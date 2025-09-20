# Sistema de Autenticação

Este módulo implementa um sistema completo de autenticação usando React Query, Zustand e Context API.

## Estrutura

```
services/
├── contexts/
│   ├── AuthProvider.tsx   # Provider principal de autenticação
│   └── types.ts          # Tipos do contexto
├── hooks/
│   ├── useAuth.ts        # Hook para usar o contexto de autenticação
│   └── useIsAuthenticated.ts # Hook para verificar autenticação
├── store/
│   └── auth-store.ts     # Store Zustand para persistir dados de auth
├── data/
│   └── usecases/
│       └── remote-auth.ts # Classe para chamadas de API
├── components/
│   └── ProtectedRoute.tsx # Componente para proteger rotas
└── index.ts              # Exportações principais
```

## Como usar

### 1. Configurar o Provider

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/modules/user/infra/services';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Sua aplicação aqui */}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### 2. Usar o hook de autenticação

```tsx
import { useAuth } from '@/modules/user/infra/services';

function LoginComponent() {
  const { login, auth, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login.handleLogin({
        email: 'user@example.com',
        password: 'password123'
      });
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  const handleLogout = async () => {
    await logout.handleLogout();
  };

  return (
    <div>
      {auth ? (
        <div>
          <p>Bem-vindo, {auth.user.name}!</p>
          <button onClick={handleLogout}>Sair</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Entrar</button>
      )}
    </div>
  );
}
```

### 3. Proteger rotas

```tsx
import { ProtectedRoute } from '@/modules/user/infra/services';

function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Esta página só pode ser acessada por usuários autenticados.</p>
      </div>
    </ProtectedRoute>
  );
}
```

### 4. Verificar autenticação

```tsx
import { useIsAuthenticated } from '@/modules/user/infra/services';

function ConditionalComponent() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div>
      {isAuthenticated ? (
        <p>Usuário autenticado</p>
      ) : (
        <p>Usuário não autenticado</p>
      )}
    </div>
  );
}
```

### 5. Estados disponíveis

- `login.handleLogin()` - Função para fazer login
- `login.isPending` - Boolean indicando se o login está em andamento
- `login.error` - String com erro do login (se houver)
- `login.data` - Dados do usuário após login bem-sucedido
- `auth` - Objeto com dados de autenticação (null se não autenticado)
- `logout.handleLogout()` - Função para fazer logout
- `refreshAccessToken.handleRefreshAccessToken()` - Função para renovar token

### 6. Dados de autenticação

O objeto `auth` contém:
- `access_token` - Token de acesso
- `refresh_token` - Token de renovação
- `user` - Dados do usuário (name, email)
- `session_id` - ID da sessão
- `access_token_expires_at` - Data de expiração do access token
- `refresh_token_expires_at` - Data de expiração do refresh token

## Funcionalidades

### Interceptor Automático
- Adiciona automaticamente o token de acesso em todas as requisições
- Renova automaticamente o token quando expira
- Faz logout automático se a renovação falhar

### Persistência
- Os dados de autenticação são persistidos no localStorage
- Sobrevive a recarregamentos da página

### Type Safety
- Tipagem completa com TypeScript
- Validação com Zod para formulários

## Configuração

1. Configure a variável de ambiente `NEXT_PUBLIC_API_URL` com a URL da sua API
2. Instale as dependências necessárias:
   ```bash
   npm install zustand @tanstack/react-query axios zod
   ```

## Exemplo Completo

Veja o arquivo `example-usage.tsx` para um exemplo completo de como usar o sistema.
