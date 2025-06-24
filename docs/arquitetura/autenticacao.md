# Autenticação e Autorização

Este documento descreve o sistema de autenticação e autorização utilizado no projeto Valore-81.

## Visão Geral

O Valore-81 utiliza o Supabase Auth para gerenciar autenticação e autorização. O sistema implementa um fluxo de autenticação baseado em tokens JWT (JSON Web Tokens) com suporte a múltiplos métodos de autenticação.

## Métodos de Autenticação

O sistema suporta os seguintes métodos de autenticação:

1. **Email/Senha** - Autenticação tradicional com email e senha
2. **Magic Link** - Autenticação sem senha via link enviado por email
3. **OAuth** - Autenticação via provedores externos (Google, GitHub)

## Fluxo de Autenticação

### Registro de Usuário

1. O usuário acessa a página de registro
2. Preenche o formulário com email, senha e informações adicionais
3. O sistema valida os dados e cria uma nova conta no Supabase Auth
4. Um email de confirmação é enviado para o usuário
5. Após confirmar o email, o usuário pode fazer login

### Login com Email/Senha

1. O usuário acessa a página de login
2. Insere email e senha
3. O sistema valida as credenciais com o Supabase Auth
4. Se válido, o sistema gera tokens de acesso e atualização
5. Os tokens são armazenados no localStorage
6. O usuário é redirecionado para a página inicial

### Login com Magic Link

1. O usuário acessa a página de login
2. Seleciona a opção "Login com Magic Link"
3. Insere seu email
4. O sistema envia um email com um link de autenticação
5. O usuário clica no link recebido por email
6. O sistema valida o link e gera tokens de acesso e atualização
7. Os tokens são armazenados no localStorage
8. O usuário é redirecionado para a página inicial

### Login com OAuth

1. O usuário acessa a página de login
2. Seleciona um provedor OAuth (Google, GitHub)
3. É redirecionado para a página de autenticação do provedor
4. Após autenticação bem-sucedida, o provedor redireciona de volta para a aplicação
5. O sistema valida a resposta do provedor e gera tokens de acesso e atualização
6. Os tokens são armazenados no localStorage
7. O usuário é redirecionado para a página inicial

## Gerenciamento de Sessão

### Tokens

O sistema utiliza dois tipos de tokens:

1. **Access Token** - Token de curta duração (1 hora) usado para autenticar requisições
2. **Refresh Token** - Token de longa duração (7 dias) usado para renovar o access token

### Renovação de Tokens

1. Quando o access token expira, o sistema tenta renovar automaticamente usando o refresh token
2. Se o refresh token for válido, um novo access token é gerado
3. Se o refresh token estiver expirado, o usuário é redirecionado para a página de login

### Logout

1. O usuário solicita logout
2. O sistema invalida os tokens no Supabase Auth
3. Os tokens são removidos do localStorage
4. O usuário é redirecionado para a página de login

## Autorização

### Níveis de Acesso

O sistema implementa os seguintes níveis de acesso:

1. **Admin** - Acesso completo a todas as funcionalidades
2. **Gerente** - Acesso a gerenciamento de clientes, projetos e relatórios
3. **Usuário** - Acesso básico a clientes e projetos atribuídos
4. **Convidado** - Acesso somente leitura a recursos específicos

### Controle de Acesso Baseado em Funções (RBAC)

O controle de acesso é implementado em duas camadas:

1. **Frontend** - Componentes e rotas são condicionalmente renderizados com base no nível de acesso do usuário
2. **Backend** - Políticas RLS (Row Level Security) no Supabase garantem que usuários só possam acessar dados permitidos pelo seu nível de acesso

## Implementação

### Contexto de Autenticação

A aplicação utiliza um contexto React para gerenciar o estado de autenticação:

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicializa a sessão do usuário
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    initSession();

    // Configura listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função para login com email/senha
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  // Função para login com magic link
  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    return { error };
  };

  // Função para login com OAuth
  const signInWithOAuth = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  // Função para registro
  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { error };
  };

  // Função para logout
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Função para reset de senha
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  // Função para atualizar senha
  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signInWithMagicLink,
    signInWithOAuth,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Componente de Proteção de Rotas

Um componente para proteger rotas que requerem autenticação:

```typescript
// src/components/auth/ProtectedRoute.tsx
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'gerente' | 'usuario' | 'convidado';
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Verifica se o usuário tem a função necessária
  const hasRequiredRole = () => {
    if (!requiredRole) return true;
    if (!user) return false;
    
    const userRole = user.user_metadata.role;
    
    // Hierarquia de funções
    if (userRole === 'admin') return true;
    if (userRole === 'gerente' && requiredRole !== 'admin') return true;
    if (userRole === 'usuario' && (requiredRole === 'usuario' || requiredRole === 'convidado')) return true;
    if (userRole === 'convidado' && requiredRole === 'convidado') return true;
    
    return false;
  };

  // Redireciona para login se não estiver autenticado
  if (!loading && !user) {
    router.replace('/login?redirect=' + router.asPath);
    return null;
  }

  // Redireciona para página de acesso negado se não tiver a função necessária
  if (!loading && user && requiredRole && !hasRequiredRole()) {
    router.replace('/acesso-negado');
    return null;
  }

  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Renderiza o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
```

### Políticas RLS no Supabase

Exemplo de políticas RLS para a tabela `clientes`:

```sql
-- Política para administradores (acesso total)
CREATE POLICY "Admins têm acesso total aos clientes" ON clientes
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Política para gerentes (acesso total)
CREATE POLICY "Gerentes têm acesso total aos clientes" ON clientes
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'gerente');

-- Política para usuários (acesso aos clientes atribuídos)
CREATE POLICY "Usuários podem ver e editar seus clientes atribuídos" ON clientes
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'usuario' AND
    id IN (
      SELECT cliente_id FROM cliente_usuario
      WHERE usuario_id = auth.uid()
    )
  );

-- Política para convidados (somente leitura)
CREATE POLICY "Convidados podem apenas visualizar clientes atribuídos" ON clientes
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'convidado' AND
    id IN (
      SELECT cliente_id FROM cliente_usuario
      WHERE usuario_id = auth.uid()
    )
  );
```

## Páginas de Autenticação

### Página de Login

```typescript
// src/pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { signIn, signInWithMagicLink, signInWithOAuth } = useAuth();
  const router = useRouter();
  const redirectPath = router.query.redirect as string || '/';

  // Login com email/senha
  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Login com magic link
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signInWithMagicLink(email);
      if (error) throw error;
      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar magic link');
    } finally {
      setLoading(false);
    }
  };

  // Login com OAuth
  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      await signInWithOAuth(provider);
    } catch (err: any) {
      setError(err.message || `Erro ao fazer login com ${provider}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Valore-81</h1>
          <p className="mt-2 text-gray-600">Faça login para continuar</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {magicLinkSent ? (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
            Enviamos um link de acesso para {email}. Por favor, verifique seu
            email para continuar.
          </div>
        ) : (
          <Tabs defaultValue="email-password">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email-password">Email/Senha</TabsTrigger>
              <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
            </TabsList>

            <TabsContent value="email-password">
              <form onSubmit={handleEmailPasswordLogin} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link href="/reset-password" className="text-blue-600 hover:text-blue-500">
                      Esqueceu a senha?
                    </Link>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="magic-link">
              <form onSubmit={handleMagicLinkLogin} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="magic-email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="magic-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Link de Acesso'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Ou continue com</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              className="w-full"
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('github')}
              className="w-full"
            >
              GitHub
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <p>
            Não tem uma conta?{' '}
            <Link href="/registro" className="text-blue-600 hover:text-blue-500">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
```

## Segurança

### Boas Práticas Implementadas

1. **Tokens JWT** - Autenticação baseada em tokens com expiração
2. **HTTPS** - Todas as comunicações são criptografadas
3. **Proteção contra CSRF** - Tokens anti-CSRF em formulários
4. **Validação de Entrada** - Validação rigorosa de todos os inputs
5. **Políticas RLS** - Controle de acesso granular no banco de dados
6. **Senhas Seguras** - Requisitos de complexidade para senhas
7. **Rate Limiting** - Limitação de tentativas de login

### Considerações de Segurança

1. **Armazenamento de Tokens** - Os tokens são armazenados no localStorage, o que pode ser vulnerável a ataques XSS. Uma alternativa mais segura seria usar cookies HttpOnly.
2. **Renovação de Tokens** - Implementar uma estratégia de renovação de tokens que minimize o risco de tokens roubados.
3. **Monitoramento** - Implementar monitoramento de atividades suspeitas e tentativas de login.

## Testes

### Testes Unitários

Exemplo de teste para o hook `useAuth`:

```typescript
// src/contexts/AuthContext.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from './AuthContext';

// Mock do Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
      signInWithPassword: jest.fn(),
      signInWithOtp: jest.fn(),
      signInWithOAuth: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}));

describe('AuthContext', () => {
  it('should provide auth context', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), { wrapper });

    await waitForNextUpdate();

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('session');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('signIn');
    expect(result.current).toHaveProperty('signInWithMagicLink');
    expect(result.current).toHaveProperty('signInWithOAuth');
    expect(result.current).toHaveProperty('signUp');
    expect(result.current).toHaveProperty('signOut');
    expect(result.current).toHaveProperty('resetPassword');
    expect(result.current).toHaveProperty('updatePassword');
  });

  // Adicione mais testes para cada função do contexto
});
```

## Conclusão

O sistema de autenticação e autorização do Valore-81 fornece uma solução segura e flexível para gerenciar o acesso dos usuários à aplicação. Utilizando o Supabase Auth, o sistema implementa múltiplos métodos de autenticação e um controle de acesso baseado em funções que protege os recursos tanto no frontend quanto no backend.

Ao seguir as boas práticas de segurança e implementar testes adequados, o sistema garante que apenas usuários autorizados possam acessar os recursos da aplicação, mantendo a integridade e confidencialidade dos dados.