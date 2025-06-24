# Gerenciamento de Estado

Este documento descreve a estratégia e implementação do gerenciamento de estado no projeto Valore-81.

## Visão Geral

O gerenciamento de estado é uma parte crucial da arquitetura do Valore-81, permitindo o compartilhamento de dados entre componentes, a persistência de informações durante a navegação e a sincronização com o backend. A aplicação utiliza uma combinação de abordagens para gerenciar o estado de forma eficiente e escalável.

## Estratégias de Gerenciamento de Estado

### 1. Estado Local de Componentes

Para estado isolado que pertence apenas a um componente específico, utilizamos o estado local do React através de `useState` e `useReducer`.

**Quando usar:**
- Estado temporário de UI (ex: abrir/fechar modal, expandir/colapsar seção)
- Estado de formulários simples
- Dados que não precisam ser compartilhados entre componentes

**Exemplo:**

```tsx
const ClientsTableStandardized: React.FC<ClientsTableProps> = ({ clients, isLoading, onViewDetails, onEdit, onDelete }) => {
  // Estado local para ordenação
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Client;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Estado local para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Lógica de ordenação
  const sortedClients = useMemo(() => {
    let sortableClients = [...clients];
    if (sortConfig !== null) {
      sortableClients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableClients;
  }, [clients, sortConfig]);

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedClients.slice(indexOfFirstItem, indexOfLastItem);

  // Handler para mudar a página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handler para ordenação
  const requestSort = (key: keyof Client) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Resto do componente...
};
```

### 2. Context API

Para estado que precisa ser compartilhado entre múltiplos componentes em uma árvore de componentes, utilizamos a Context API do React.

**Quando usar:**
- Temas e preferências de UI
- Dados de autenticação do usuário
- Estado global que não requer lógica complexa
- Dados que precisam ser acessados por muitos componentes em diferentes níveis

**Exemplo - AuthContext:**

```tsx
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao obter sessão:', error.message);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
```

**Uso do Context:**

```tsx
// No componente raiz (ex: _app.tsx)
import { AuthProvider } from '../contexts/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

// Em qualquer componente que precise de acesso ao estado de autenticação
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return <div>Você precisa estar logado para ver esta página.</div>;
  }

  return (
    <div>
      <h1>Perfil</h1>
      <p>Email: {user.email}</p>
      <button onClick={signOut}>Sair</button>
    </div>
  );
};
```

### 3. React Query

Para gerenciamento de estado do servidor e operações assíncronas, utilizamos o React Query (TanStack Query), que fornece cache, sincronização, atualização e gerenciamento de erros para dados remotos.

**Quando usar:**
- Busca, cache e atualização de dados do servidor
- Gerenciamento de estado assíncrono
- Operações de mutação (criar, atualizar, excluir)
- Invalidação e revalidação de cache

**Exemplo - Configuração:**

```tsx
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});
```

**Exemplo - Provider:**

```tsx
// No componente raiz (ex: _app.tsx)
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../lib/queryClient';

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Exemplo - Hooks para Clientes:**

```tsx
// src/hooks/useClients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { Client } from '../types/client';

// Chaves de consulta
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: any) => [...clientKeys.lists(), filters] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

// Buscar todos os clientes
export const useClients = (filters = {}) => {
  return useQuery(
    clientKeys.list(filters),
    async () => {
      let query = supabase.from('clients').select('*');

      // Aplicar filtros se existirem
      if (filters.search) {
        query = query.ilike('nome', `%${filters.search}%`);
      }

      if (filters.tipo) {
        query = query.eq('tipo', filters.tipo);
      }

      const { data, error } = await query.order('nome');

      if (error) throw error;
      return data as Client[];
    },
    {
      keepPreviousData: true,
    }
  );
};

// Buscar um cliente específico
export const useClient = (id: string) => {
  return useQuery(
    clientKeys.detail(id),
    async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Client;
    },
    {
      enabled: !!id, // Só executa se o ID for fornecido
    }
  );
};

// Criar um novo cliente
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newClient: Omit<Client, 'id'>) => {
      const { data, error } = await supabase.from('clients').insert(newClient).select();

      if (error) throw error;
      return data[0] as Client;
    },
    {
      onSuccess: () => {
        // Invalidar consultas para recarregar a lista de clientes
        queryClient.invalidateQueries(clientKeys.lists());
      },
    }
  );
};

// Atualizar um cliente existente
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, ...updates }: Client) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0] as Client;
    },
    {
      onSuccess: (data) => {
        // Atualizar o cache para o cliente específico
        queryClient.setQueryData(clientKeys.detail(data.id), data);
        // Invalidar a lista para garantir que está atualizada
        queryClient.invalidateQueries(clientKeys.lists());
      },
    }
  );
};

// Excluir um cliente
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);

      if (error) throw error;
      return id;
    },
    {
      onSuccess: (id) => {
        // Remover do cache
        queryClient.removeQueries(clientKeys.detail(id));
        // Invalidar a lista
        queryClient.invalidateQueries(clientKeys.lists());
      },
    }
  );
};
```

**Uso dos Hooks:**

```tsx
// Em um componente de listagem de clientes
import { useClients, useDeleteClient } from '../hooks/useClients';
import { useState } from 'react';

const ClientsList = () => {
  const [filters, setFilters] = useState({ search: '', tipo: '' });
  const { data: clients, isLoading, error } = useClients(filters);
  const deleteClient = useDeleteClient();

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleFilterByType = (e) => {
    setFilters(prev => ({ ...prev, tipo: e.target.value }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteClient.mutateAsync(id);
        alert('Cliente excluído com sucesso!');
      } catch (error) {
        alert(`Erro ao excluir cliente: ${error.message}`);
      }
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar clientes: {error.message}</div>;

  return (
    <div>
      <div className="filters">
        <input 
          type="text" 
          placeholder="Buscar por nome" 
          value={filters.search} 
          onChange={handleSearch} 
        />
        <select value={filters.tipo} onChange={handleFilterByType}>
          <option value="">Todos os tipos</option>
          <option value="PF">Pessoa Física</option>
          <option value="PJ">Pessoa Jurídica</option>
        </select>
      </div>

      <ClientsTableStandardized 
        clients={clients || []} 
        isLoading={isLoading}
        onViewDetails={(id) => { /* ... */ }}
        onEdit={(id) => { /* ... */ }}
        onDelete={handleDelete}
      />
    </div>
  );
};
```

### 4. Zustand (Estado Global Simples)

Para gerenciamento de estado global mais simples que não requer a complexidade do Redux, utilizamos o Zustand, uma biblioteca leve e fácil de usar.

**Quando usar:**
- Estado global que não está diretamente relacionado a dados do servidor
- Estado de UI compartilhado entre rotas
- Quando Context API se torna muito verboso para o caso de uso

**Exemplo - Store de UI:**

```tsx
// src/stores/uiStore.ts
import create from 'zustand';

type UIState = {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Array<{ id: string; message: string; type: 'info' | 'success' | 'error' }>;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (message: string, type: 'info' | 'success' | 'error') => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => {
    set({ theme });
    // Persistir tema no localStorage
    localStorage.setItem('theme', theme);
    // Aplicar classe ao elemento html
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  },
  addNotification: (message, type) => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));
    // Auto-remover após 5 segundos
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

// Inicializar tema do localStorage ao carregar a aplicação
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (savedTheme) {
    useUIStore.getState().setTheme(savedTheme);
  }
}
```

**Uso do Store:**

```tsx
// Em um componente de layout
import { useUIStore } from '../stores/uiStore';

const Layout = ({ children }) => {
  const { sidebarOpen, toggleSidebar, theme, setTheme } = useUIStore();

  return (
    <div className={`app ${theme}`}>
      <header>
        <button onClick={toggleSidebar}>
          {sidebarOpen ? 'Fechar Menu' : 'Abrir Menu'}
        </button>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Alternar Tema
        </button>
      </header>

      <div className="content-area">
        <aside className={sidebarOpen ? 'open' : 'closed'}>
          {/* Conteúdo da sidebar */}
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
};

// Em um componente de notificações
import { useUIStore } from '../stores/uiStore';

const NotificationCenter = () => {
  const { notifications, removeNotification } = useUIStore();

  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          <button onClick={() => removeNotification(notification.id)}>×</button>
        </div>
      ))}
    </div>
  );
};
```

## Padrões e Boas Práticas

### 1. Separação de Preocupações

- **Componentes de Apresentação**: Focados em renderizar UI e responder a eventos do usuário. Não contêm lógica de negócios ou acesso direto ao estado global.
- **Componentes de Container**: Conectam componentes de apresentação ao estado global e gerenciam a lógica de negócios.
- **Hooks Personalizados**: Encapsulam lógica de acesso a dados e operações de estado, tornando os componentes mais limpos.

### 2. Normalização de Dados

Para dados relacionais complexos, normalizamos o estado para evitar duplicação e inconsistências:

```tsx
// Exemplo de estrutura normalizada em um store
type NormalizedState = {
  clients: {
    byId: Record<string, Client>;
    allIds: string[];
  };
  projects: {
    byId: Record<string, Project>;
    allIds: string[];
    byClientId: Record<string, string[]>;
  };
};
```

### 3. Imutabilidade

Sempre tratamos o estado como imutável, criando novas cópias ao invés de modificar diretamente:

```tsx
// Incorreto
const updateUser = (user) => {
  user.name = 'Novo Nome'; // Mutação direta
  setUser(user);
};

// Correto
const updateUser = (user) => {
  setUser({ ...user, name: 'Novo Nome' }); // Cria nova cópia
};
```

### 4. Seletores

Usamos seletores para acessar e derivar dados do estado, evitando cálculos redundantes:

```tsx
// Com React Query
const useActiveClients = () => {
  const { data: clients } = useClients();
  return useMemo(() => clients?.filter(client => client.status === 'active') || [], [clients]);
};

// Com Zustand
const activeProjects = useProjectStore(state => 
  state.projects.filter(project => project.status === 'active')
);
```

### 5. Persistência de Estado

Para estado que precisa persistir entre sessões, utilizamos localStorage ou sessionStorage:

```tsx
// Exemplo com Zustand e middleware persist
import create from 'zustand';
import { persist } from 'zustand/middleware';

type UserPreferences = {
  language: string;
  notifications: boolean;
  theme: 'light' | 'dark';
  setLanguage: (language: string) => void;
  toggleNotifications: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

export const useUserPreferences = create<UserPreferences>(
  persist(
    (set) => ({
      language: 'pt-BR',
      notifications: true,
      theme: 'light',
      setLanguage: (language) => set({ language }),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'user-preferences', // nome no localStorage
      getStorage: () => localStorage,
    }
  )
);
```

## Fluxo de Dados

### 1. Fluxo Unidirecional

Seguimos o princípio de fluxo de dados unidirecional:

1. Estado → Renderização → Eventos do Usuário → Atualização de Estado → Renderização

Este padrão torna o fluxo de dados previsível e mais fácil de depurar.

### 2. Comunicação entre Componentes

- **Props**: Para comunicação pai-filho
- **Context**: Para comunicação entre componentes distantes na árvore
- **Estado Global**: Para comunicação entre componentes não relacionados
- **Eventos Personalizados**: Para comunicação entre componentes independentes

## Otimizações de Performance

### 1. Memoização

Utilizamos `useMemo`, `useCallback` e `React.memo` para evitar renderizações desnecessárias:

```tsx
// Memoização de valores derivados
const sortedClients = useMemo(() => {
  return [...clients].sort((a, b) => a.nome.localeCompare(b.nome));
}, [clients]);

// Memoização de funções
const handleDelete = useCallback((id: string) => {
  deleteClient.mutate(id);
}, [deleteClient]);

// Memoização de componentes
const ClientCard = React.memo(({ client, onEdit, onDelete }) => {
  // Implementação do componente
});
```

### 2. Virtualização

Para listas longas, utilizamos virtualização para renderizar apenas os itens visíveis:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedClientList = ({ clients }) => {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: clients.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // altura estimada de cada item
  });

  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ClientCard client={clients[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Lazy Loading

Carregamos componentes e dados apenas quando necessário:

```tsx
// Lazy loading de componentes
const ClientDetails = React.lazy(() => import('../components/clients/ClientDetails'));

// Em um componente
const ClientView = ({ clientId }) => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ClientDetails id={clientId} />
    </Suspense>
  );
};

// Lazy loading de dados com React Query
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
  ['projects'],
  ({ pageParam = 0 }) => fetchProjects(pageParam),
  {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }
);
```

## Depuração e Ferramentas

### 1. React DevTools

Utilizamos React DevTools para inspecionar a árvore de componentes e o estado local.

### 2. React Query DevTools

Para depurar consultas e mutações do React Query:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 3. Zustand DevTools

Para depurar stores do Zustand:

```tsx
import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools(
    (set) => ({
      // definição do store
    }),
    { name: 'MyStore' } // nome no DevTools
  )
);
```

## Considerações de Segurança

### 1. Dados Sensíveis

- Nunca armazenamos dados sensíveis (senhas, tokens de acesso) no estado do cliente
- Utilizamos HttpOnly cookies para tokens de autenticação
- Implementamos expiração e renovação automática de tokens

### 2. Validação de Dados

- Validamos todos os dados recebidos do servidor antes de incorporá-los ao estado
- Sanitizamos dados de entrada do usuário antes de enviá-los ao servidor

## Conclusão

O gerenciamento de estado no Valore-81 é implementado usando uma combinação de abordagens, cada uma escolhida para atender a necessidades específicas. Esta estratégia híbrida nos permite equilibrar simplicidade, performance e manutenibilidade, adaptando-se às diferentes partes da aplicação.

Ao seguir os padrões e boas práticas descritos neste documento, garantimos um código mais previsível, testável e escalável, facilitando a manutenção e evolução do projeto ao longo do tempo.