# Fluxo de Dados

Este documento descreve como os dados fluem através da aplicação Valore-81, desde a interface do usuário até o banco de dados e vice-versa.

## Visão Geral

O Valore-81 segue um padrão de fluxo de dados unidirecional, onde os dados fluem de maneira previsível através de camadas bem definidas. Isso torna o aplicativo mais fácil de entender, depurar e manter.

## Diagrama de Fluxo de Dados

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Componentes UI │ ◄─────► │  Estado Local   │         │                 │
│                 │         │  & Global       │         │                 │
└────────┬────────┘         └────────┬────────┘         │                 │
         │                           │                   │                 │
         │                           │                   │                 │
         │                  ┌────────▼────────┐         │                 │
         │                  │                 │         │                 │
         └─────────────────►│     Hooks      │◄────────►│    Serviços    │
                            │                 │         │                 │
                            └────────┬────────┘         │                 │
                                     │                   │                 │
                                     │                   │                 │
                            ┌────────▼────────┐         │                 │
                            │                 │         │                 │
                            │  React Query   │◄────────►│                 │
                            │                 │         │                 │
                            └────────┬────────┘         └────────┬────────┘
                                     │                           │
                                     │                           │
                            ┌────────▼────────┐         ┌────────▼────────┐
                            │                 │         │                 │
                            │  API Cliente    │◄────────►   Supabase      │
                            │                 │         │                 │
                            └─────────────────┘         └─────────────────┘
```

## Camadas de Fluxo de Dados

### 1. Componentes UI

Os componentes de interface do usuário são responsáveis por:

- Renderizar a interface com base nos dados recebidos
- Capturar interações do usuário (cliques, entradas de formulário, etc.)
- Disparar eventos que iniciam o fluxo de dados

**Exemplo: Componente de Tabela de Clientes**

```tsx
// src/components/clients/ClientsTableStandardized/ClientsTableStandardized.tsx
import React from "react";
import { Client } from "@/types/client";

interface ClientsTableStandardizedProps {
  clients: Client[];
  isLoading: boolean;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ClientsTableStandardized: React.FC<ClientsTableStandardizedProps> = ({
  clients,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  if (isLoading) return <div>Carregando...</div>;

  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.id}>
            <td>{client.name}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
            <td>
              <button onClick={() => onViewDetails(client.id)}>Detalhes</button>
              <button onClick={() => onEdit(client.id)}>Editar</button>
              <button onClick={() => onDelete(client.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientsTableStandardized;
```

### 2. Estado Local e Global

O estado armazena dados que podem ser acessados e modificados pelos componentes:

- **Estado Local**: Gerenciado com `useState` ou `useReducer` dentro de componentes
- **Estado Global**: Gerenciado com Context API, Zustand ou outras bibliotecas

**Exemplo: Estado Global com Zustand**

```tsx
// src/stores/uiStore.ts
import { create } from "zustand";

type NotificationType = "success" | "error" | "info" | "warning";

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface UIState {
  notifications: Notification[];
  isClientModalOpen: boolean;
  selectedClientId: string | null;
  addNotification: (
    message: string,
    type: NotificationType,
    duration?: number,
  ) => void;
  removeNotification: (id: string) => void;
  openClientModal: (clientId?: string) => void;
  closeClientModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  notifications: [],
  isClientModalOpen: false,
  selectedClientId: null,

  addNotification: (message, type, duration = 5000) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now().toString(),
          message,
          type,
          duration,
        },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    })),

  openClientModal: (clientId = null) =>
    set({
      isClientModalOpen: true,
      selectedClientId: clientId,
    }),

  closeClientModal: () =>
    set({
      isClientModalOpen: false,
      selectedClientId: null,
    }),
}));
```

### 3. Hooks Personalizados

Hooks encapsulam a lógica de negócios e servem como intermediários entre os componentes e os serviços:

- Abstraem operações complexas
- Gerenciam estado local relacionado a operações específicas
- Chamam serviços para buscar ou modificar dados

**Exemplo: Hook para Gerenciar Clientes**

```tsx
// src/hooks/useClients.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services/clientsService";
import { Client, ClientInput } from "@/types/client";

// Hook para buscar todos os clientes
export const useClients = () => {
  return useQuery<Client[], Error>({
    queryKey: ["clients"],
    queryFn: clientsService.getClients,
  });
};

// Hook para buscar um cliente específico
export const useClient = (id: string) => {
  return useQuery<Client, Error>({
    queryKey: ["clients", id],
    queryFn: () => clientsService.getClient(id),
    enabled: !!id, // Só executa se o ID for fornecido
  });
};

// Hook para criar um novo cliente
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<Client, Error, ClientInput>({
    mutationFn: clientsService.createClient,
    onSuccess: () => {
      // Invalida a query de clientes para forçar uma nova busca
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

// Hook para atualizar um cliente existente
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<Client, Error, { id: string; data: ClientInput }>({
    mutationFn: ({ id, data }) => clientsService.updateClient(id, data),
    onSuccess: (updatedClient) => {
      // Atualiza o cliente no cache
      queryClient.setQueryData(["clients", updatedClient.id], updatedClient);
      // Invalida a query de clientes para forçar uma nova busca
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

// Hook para excluir um cliente
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: clientsService.deleteClient,
    onSuccess: () => {
      // Invalida a query de clientes para forçar uma nova busca
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
```

### 4. React Query

O React Query gerencia o estado do servidor e as operações assíncronas:

- Gerencia o cache de dados
- Lida com estados de carregamento, erro e sucesso
- Sincroniza o estado do cliente com o servidor
- Fornece funcionalidades como refetch, invalidação de queries e mutations

### 5. Serviços

Os serviços são responsáveis pela comunicação com APIs externas:

- Encapsulam a lógica de chamadas HTTP
- Formatam dados para envio e recebimento
- Lidam com erros de comunicação

**Exemplo: Serviço de Clientes**

```tsx
// src/services/clientsService.ts
import { supabase } from "@/lib/supabaseClient";
import { Client, ClientInput } from "@/types/client";

export const clientsService = {
  // Buscar todos os clientes
  getClients: async (): Promise<Client[]> => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("name");

    if (error) throw new Error(error.message);
    return data;
  },

  // Buscar um cliente específico
  getClient: async (id: string): Promise<Client> => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Criar um novo cliente
  createClient: async (client: ClientInput): Promise<Client> => {
    const { data, error } = await supabase
      .from("clients")
      .insert(client)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Atualizar um cliente existente
  updateClient: async (id: string, client: ClientInput): Promise<Client> => {
    const { data, error } = await supabase
      .from("clients")
      .update(client)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Excluir um cliente
  deleteClient: async (id: string): Promise<void> => {
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },
};
```

### 6. API Cliente

O cliente de API (Supabase, Axios, etc.) lida com a comunicação de baixo nível com o servidor:

- Configura cabeçalhos HTTP
- Gerencia tokens de autenticação
- Serializa e deserializa dados

**Exemplo: Cliente Supabase**

```tsx
// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Fluxos de Dados Comuns

### Fluxo de Leitura (Busca de Dados)

1. Um componente é montado e chama um hook personalizado (ex: `useClients`)
2. O hook usa React Query para buscar dados
3. React Query verifica se os dados já estão em cache
   - Se estiverem em cache e não estiverem obsoletos, retorna os dados do cache
   - Se não estiverem em cache ou estiverem obsoletos, chama o serviço para buscar dados frescos
4. O serviço faz uma chamada para a API
5. A API retorna os dados
6. Os dados são processados pelo serviço e retornados para o React Query
7. React Query armazena os dados em cache e os retorna para o hook
8. O hook retorna os dados para o componente
9. O componente renderiza os dados

**Exemplo: Página de Listagem de Clientes**

```tsx
// src/pages/clients/index.tsx
import React from "react";
import { NextPage } from "next";
import Head from "next/head";

import MainLayout from "@/components/layout/MainLayout";
import ClientsTableStandardized from "@/components/clients/ClientsTableStandardized";
import { useClients, useDeleteClient } from "@/hooks/useClients";
import { useUIStore } from "@/stores/uiStore";

const ClientsPage: NextPage = () => {
  // 1. Componente chama o hook useClients
  const { data: clients, isLoading, error } = useClients();
  const deleteClient = useDeleteClient();
  const { addNotification, openClientModal } = useUIStore();

  // Funções para lidar com interações do usuário
  const handleViewDetails = (id: string) => {
    // Navegar para a página de detalhes ou abrir modal
    openClientModal(id);
  };

  const handleEdit = (id: string) => {
    // Navegar para a página de edição ou abrir modal de edição
    openClientModal(id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await deleteClient.mutateAsync(id);
        addNotification("Cliente excluído com sucesso", "success");
      } catch (error) {
        addNotification(`Erro ao excluir cliente: ${error.message}`, "error");
      }
    }
  };

  // 9. Componente renderiza os dados
  return (
    <MainLayout>
      <Head>
        <title>Clientes | Valore-81</title>
      </Head>

      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Clientes</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Erro ao carregar clientes: {error.message}
          </div>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => openClientModal()}
        >
          Novo Cliente
        </button>

        <ClientsTableStandardized
          clients={clients || []}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </MainLayout>
  );
};

export default ClientsPage;
```

### Fluxo de Escrita (Criação, Atualização, Exclusão)

1. Um usuário interage com um componente (ex: clica em "Salvar" em um formulário)
2. O componente chama uma função de manipulação de evento
3. A função chama um hook de mutação (ex: `useCreateClient`)
4. O hook usa React Query para executar a mutação
5. React Query chama o serviço para modificar os dados
6. O serviço faz uma chamada para a API
7. A API processa a solicitação e retorna uma resposta
8. O serviço processa a resposta e a retorna para o React Query
9. React Query executa callbacks de sucesso ou erro
10. Os callbacks atualizam o cache e invalidam queries relacionadas
11. Os componentes são re-renderizados com os dados atualizados

**Exemplo: Formulário de Cliente**

```tsx
// src/components/clients/ClientForm/ClientForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useCreateClient,
  useUpdateClient,
  useClient,
} from "@/hooks/useClients";
import { useUIStore } from "@/stores/uiStore";
import { Client } from "@/types/client";

// Schema de validação com Zod
const clientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  clientId?: string;
  onSuccess?: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ clientId, onSuccess }) => {
  const isEditing = !!clientId;

  // Busca dados do cliente se estiver editando
  const { data: client, isLoading: isLoadingClient } = useClient(
    clientId || "",
  );

  // Hooks de mutação
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  // Estado global
  const { addNotification, closeClientModal } = useUIStore();

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: isEditing
      ? {}
      : {
          name: "",
          email: "",
          phone: "",
          address: "",
          notes: "",
        },
  });

  // Preenche o formulário quando os dados do cliente são carregados
  React.useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        email: client.email,
        phone: client.phone || "",
        address: client.address || "",
        notes: client.notes || "",
      });
    }
  }, [client, reset]);

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: ClientFormData) => {
    try {
      if (isEditing && clientId) {
        // 3-4. Chama o hook de mutação para atualizar
        await updateClient.mutateAsync({ id: clientId, data });
        addNotification("Cliente atualizado com sucesso", "success");
      } else {
        // 3-4. Chama o hook de mutação para criar
        await createClient.mutateAsync(data);
        addNotification("Cliente criado com sucesso", "success");
        reset(); // Limpa o formulário após criar
      }

      // Fecha o modal e chama callback de sucesso
      if (onSuccess) onSuccess();
      closeClientModal();
    } catch (error) {
      addNotification(
        `Erro ao ${isEditing ? "atualizar" : "criar"} cliente: ${
          error.message
        }`,
        "error",
      );
    }
  };

  if (isEditing && isLoadingClient) {
    return <div>Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nome *
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email *
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Telefone
        </label>
        <input
          id="phone"
          type="text"
          {...register("phone")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Endereço
        </label>
        <input
          id="address"
          type="text"
          {...register("address")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Observações
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={closeClientModal}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
```

## Otimizações de Fluxo de Dados

### Caching e Revalidação

O React Query fornece estratégias avançadas de cache:

- **staleTime**: Define quanto tempo os dados permanecem "frescos" antes de serem considerados obsoletos
- **cacheTime**: Define quanto tempo os dados inativos permanecem em cache antes de serem removidos
- **Revalidação**: Atualiza automaticamente os dados quando o usuário volta a focar na janela ou reconecta à internet

**Exemplo: Configuração do React Query**

```tsx
// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 1, // Tenta uma vez em caso de falha
      refetchOnWindowFocus: true, // Revalida quando o usuário volta a focar na janela
      refetchOnReconnect: true, // Revalida quando o usuário reconecta à internet
    },
  },
});
```

### Otimização de Atualizações

Para evitar buscas desnecessárias após mutações, o React Query permite:

- **Atualização Otimista**: Atualiza a UI antes da confirmação do servidor
- **Atualização do Cache**: Modifica diretamente os dados em cache após uma mutação bem-sucedida

**Exemplo: Atualização Otimista**

```tsx
// src/hooks/useClients.ts (trecho)
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<Client, Error, { id: string; data: ClientInput }>(
    ({ id, data }) => clientsService.updateClient(id, data),
    {
      // Atualização otimista
      onMutate: async ({ id, data }) => {
        // Cancela quaisquer queries em andamento para evitar sobrescrever a atualização otimista
        await queryClient.cancelQueries({ queryKey: ["clients", id] });

        // Salva o estado anterior
        const previousClient = queryClient.getQueryData<Client>([
          "clients",
          id,
        ]);

        // Atualiza o cache com os novos dados (otimisticamente)
        if (previousClient) {
          queryClient.setQueryData<Client>(["clients", id], {
            ...previousClient,
            ...data,
          });

          // Atualiza também na lista de clientes
          queryClient.setQueryData<Client[]>(["clients"], (old) => {
            if (!old) return [];
            return old.map((client) => {
              if (client.id === id) {
                return { ...client, ...data };
              }
              return client;
            });
          });
        }

        // Retorna o contexto com o estado anterior
        return { previousClient };
      },

      // Em caso de erro, reverte para o estado anterior
      onError: (err, { id }, context) => {
        if (context?.previousClient) {
          queryClient.setQueryData(["clients", id], context.previousClient);

          queryClient.setQueryData<Client[]>(["clients"], (old) => {
            if (!old) return [];
            return old.map((client) => {
              if (client.id === id) {
                return context.previousClient;
              }
              return client;
            });
          });
        }
      },

      // Após a mutação, atualiza o cache com os dados reais do servidor
      onSettled: (data, error, { id }) => {
        queryClient.invalidateQueries({ queryKey: ["clients", id] });
        queryClient.invalidateQueries({ queryKey: ["clients"] });
      },
    },
  );
};
```

### Paginação e Busca Infinita

Para lidar com grandes conjuntos de dados, o React Query suporta:

- **Paginação**: Carrega dados em páginas
- **Busca Infinita**: Carrega mais dados à medida que o usuário rola

**Exemplo: Paginação**

```tsx
// src/hooks/useClients.ts (trecho)
export const usePaginatedClients = (page = 1, pageSize = 10) => {
  return useQuery<{ clients: Client[]; totalCount: number }, Error>({
    queryKey: ['clients', 'paginated', page, pageSize],
    queryFn: () => clientsService.getPaginatedClients(page, pageSize),
    keepPreviousData: true, // Mantém os dados anteriores enquanto carrega a próxima página
  });
};

// src/services/clientsService.ts (trecho)
getPaginatedClients: async (page: number, pageSize: number): Promise<{ clients: Client[]; totalCount: number }> => {
  // Calcula o início com base na página e no tamanho da página
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Busca os clientes com paginação
  const { data, error, count } = await supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .order('name')
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    clients: data,
    totalCount: count || 0,
  };
},
```

## Tratamento de Erros

O fluxo de dados inclui tratamento de erros em várias camadas:

### 1. Serviços

Os serviços capturam erros da API e os transformam em erros mais significativos:

```tsx
// src/services/clientsService.ts (trecho)
getClient: async (id: string): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Transforma erros do Supabase em mensagens mais amigáveis
      if (error.code === 'PGRST116') {
        throw new Error(`Cliente não encontrado com o ID: ${id}`);
      }
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    // Registra o erro para depuração
    console.error('Erro ao buscar cliente:', error);
    throw error;
  }
},
```

### 2. React Query

O React Query fornece estados de erro que podem ser usados pelos componentes:

```tsx
const { data, isLoading, error } = useClients();

if (error) {
  return <div>Erro ao carregar clientes: {error.message}</div>;
}
```

### 3. Componentes

Os componentes podem exibir mensagens de erro e fornecer opções de recuperação:

```tsx
// src/components/clients/ClientsTableStandardized/ClientsTableStandardized.tsx (trecho)
if (error) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>Erro ao carregar clientes: {error.message}</p>
      <button
        onClick={() => refetch()}
        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
      >
        Tentar novamente
      </button>
    </div>
  );
}
```

## Conclusão

O fluxo de dados no Valore-81 segue um padrão unidirecional e bem estruturado, com responsabilidades claramente definidas para cada camada. Isso torna o aplicativo mais previsível, testável e manutenível.

As principais vantagens desse padrão incluem:

- **Previsibilidade**: O fluxo de dados é claro e consistente
- **Separação de Responsabilidades**: Cada camada tem uma função específica
- **Reutilização**: Hooks e serviços podem ser reutilizados em diferentes partes do aplicativo
- **Testabilidade**: Cada camada pode ser testada isoladamente
- **Manutenibilidade**: Mudanças em uma camada têm impacto mínimo em outras camadas

Ao seguir esse padrão, o Valore-81 pode escalar de forma eficiente à medida que novos recursos são adicionados e os requisitos evoluem.
