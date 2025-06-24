# APIs e Serviços

Este documento descreve as APIs e serviços utilizados no projeto Valore-81, incluindo endpoints, parâmetros e exemplos de uso.

## Visão Geral

O Valore-81 utiliza uma combinação de APIs RESTful e serviços do Supabase para comunicação entre o frontend e o backend. As principais categorias de APIs são:

1. **APIs de Autenticação** - Gerenciamento de usuários e autenticação
2. **APIs de Clientes** - Gerenciamento de clientes
3. **APIs de Projetos** - Gerenciamento de projetos
4. **APIs de Tarefas** - Gerenciamento de tarefas
5. **APIs de Documentos** - Gerenciamento de documentos
6. **APIs de Relatórios** - Geração de relatórios

## Configuração Base

```typescript
// src/services/api.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função auxiliar para lidar com erros de API
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  return {
    error: {
      message: error.message || 'Ocorreu um erro na requisição',
      status: error.status || 500,
    },
  };
};
```

## APIs de Autenticação

### Registro de Usuário

```typescript
// src/services/auth.ts
import { supabase, handleApiError } from './api';

export const registerUser = async (email: string, password: string, userData: any) => {
  try {
    // Registrar usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Adicionar dados adicionais do usuário no perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            nome: userData.nome,
            cargo: userData.cargo,
            departamento: userData.departamento,
            telefone: userData.telefone,
            perfil: userData.perfil || 'operador',
            status: 'pendente',
          },
        ]);

      if (profileError) throw profileError;
    }

    return { data: authData, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Login

```typescript
// src/services/auth.ts
export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Logout

```typescript
// src/services/auth.ts
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Recuperação de Senha

```typescript
// src/services/auth.ts
export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Obter Usuário Atual

```typescript
// src/services/auth.ts
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (!session) {
      return { data: null, error: null };
    }

    // Obter dados adicionais do perfil
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      data: {
        ...session.user,
        ...profileData,
      },
      error: null,
    };
  } catch (error) {
    return handleApiError(error);
  }
};
```

## APIs de Clientes

### Listar Clientes

```typescript
// src/services/clients.ts
import { supabase, handleApiError } from './api';
import { Cliente } from '../types/cliente';

export const listClients = async (filters?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    let query = supabase.from('clientes').select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%,cnpj.ilike.%${filters.search}%,cpf.ilike.%${filters.search}%`
      );
    }

    // Paginação
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    query = query.range(start, end);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data, count, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Obter Cliente por ID

```typescript
// src/services/clients.ts
export const getClientById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*, contatos(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Criar Cliente

```typescript
// src/services/clients.ts
export const createClient = async (client: Omit<Cliente, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase.from('clientes').insert([client]).select();

    if (error) throw error;

    return { data: data[0], error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Atualizar Cliente

```typescript
// src/services/clients.ts
export const updateClient = async (id: string, client: Partial<Cliente>) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .update(client)
      .eq('id', id)
      .select();

    if (error) throw error;

    return { data: data[0], error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Excluir Cliente

```typescript
// src/services/clients.ts
export const deleteClient = async (id: string) => {
  try {
    const { error } = await supabase.from('clientes').delete().eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

## APIs de Projetos

### Listar Projetos

```typescript
// src/services/projects.ts
import { supabase, handleApiError } from './api';
import { Projeto } from '../types/projeto';

export const listProjects = async (filters?: {
  cliente_id?: string;
  responsavel_id?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('projetos')
      .select('*, clientes(nome), usuarios!responsavel_id(nome)', { count: 'exact' });

    // Aplicar filtros
    if (filters?.cliente_id) {
      query = query.eq('cliente_id', filters.cliente_id);
    }

    if (filters?.responsavel_id) {
      query = query.eq('responsavel_id', filters.responsavel_id);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.ilike('nome', `%${filters.search}%`);
    }

    // Paginação
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    query = query.range(start, end);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data, count, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Obter Projeto por ID

```typescript
// src/services/projects.ts
export const getProjectById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('projetos')
      .select('*, clientes(*), usuarios!responsavel_id(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Criar Projeto

```typescript
// src/services/projects.ts
export const createProject = async (project: Omit<Projeto, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase.from('projetos').insert([project]).select();

    if (error) throw error;

    return { data: data[0], error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Atualizar Projeto

```typescript
// src/services/projects.ts
export const updateProject = async (id: string, project: Partial<Projeto>) => {
  try {
    const { data, error } = await supabase
      .from('projetos')
      .update(project)
      .eq('id', id)
      .select();

    if (error) throw error;

    return { data: data[0], error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Excluir Projeto

```typescript
// src/services/projects.ts
export const deleteProject = async (id: string) => {
  try {
    const { error } = await supabase.from('projetos').delete().eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

## APIs de Tarefas

### Listar Tarefas

```typescript
// src/services/tasks.ts
import { supabase, handleApiError } from './api';
import { Tarefa } from '../types/tarefa';

export const listTasks = async (filters?: {
  projeto_id?: string;
  responsavel_id?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('tarefas')
      .select(
        '*, projetos(id, nome), usuarios!responsavel_id(id, nome), usuarios!criador_id(id, nome)',
        { count: 'exact' }
      );

    // Aplicar filtros
    if (filters?.projeto_id) {
      query = query.eq('projeto_id', filters.projeto_id);
    }

    if (filters?.responsavel_id) {
      query = query.eq('responsavel_id', filters.responsavel_id);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.ilike('titulo', `%${filters.search}%`);
    }

    // Paginação
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    query = query.range(start, end);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data, count, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Obter Tarefa por ID

```typescript
// src/services/tasks.ts
export const getTaskById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .select(
        '*, projetos(*), usuarios!responsavel_id(*), usuarios!criador_id(*), subtarefas(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Criar Tarefa

```typescript
// src/services/tasks.ts
export const createTask = async (task: Omit<Tarefa, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase.from('tarefas').insert([task]).select();

    if (error) throw error;

    return { data: data[0], error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Atualizar Tarefa

```typescript
// src/services/tasks.ts
export const updateTask = async (id: string, task: Partial<Tarefa>) => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .update(task)
      .eq('id', id)
      .select();

    if (error) throw error;

    return { data: data[0], error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Excluir Tarefa

```typescript
// src/services/tasks.ts
export const deleteTask = async (id: string) => {
  try {
    const { error } = await supabase.from('tarefas').delete().eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

## APIs de Documentos

### Listar Documentos

```typescript
// src/services/documents.ts
import { supabase, handleApiError } from './api';
import { Documento } from '../types/documento';

export const listDocuments = async (filters?: {
  cliente_id?: string;
  projeto_id?: string;
  tipo?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('documentos')
      .select(
        '*, clientes(id, nome), projetos(id, nome), usuarios!criador_id(id, nome)',
        { count: 'exact' }
      );

    // Aplicar filtros
    if (filters?.cliente_id) {
      query = query.eq('cliente_id', filters.cliente_id);
    }

    if (filters?.projeto_id) {
      query = query.eq('projeto_id', filters.projeto_id);
    }

    if (filters?.tipo) {
      query = query.eq('tipo', filters.tipo);
    }

    if (filters?.search) {
      query = query.or(
        `nome.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%,arquivo_nome.ilike.%${filters.search}%`
      );
    }

    // Paginação
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    query = query.range(start, end);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data, count, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Obter Documento por ID

```typescript
// src/services/documents.ts
export const getDocumentById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('documentos')
      .select('*, clientes(*), projetos(*), usuarios!criador_id(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Criar Documento

```typescript
// src/services/documents.ts
export const createDocument = async (
  document: Omit<Documento, 'id' | 'created_at' | 'arquivo_url'>,
  file: File
) => {
  try {
    // 1. Upload do arquivo para o Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `documentos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Obter URL pública do arquivo
    const { data: urlData } = supabase.storage.from('files').getPublicUrl(filePath);

    // 3. Criar registro do documento no banco
    const { data, error } = await supabase
      .from('documentos')
      .insert([{
        ...document,
        arquivo_url: urlData.publicUrl,
        arquivo_nome: file.name,
        arquivo_tipo: file.type,
        arquivo_tamanho: file.size,
      }])
      .select();

    if (error) throw error;

    return { data: data[0], error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Atualizar Documento

```typescript
// src/services/documents.ts
export const updateDocument = async (
  id: string,
  document: Partial<Documento>,
  file?: File
) => {
  try {
    let documentData = { ...document };

    // Se um novo arquivo foi fornecido, fazer upload
    if (file) {
      // 1. Upload do arquivo para o Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `documentos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Obter URL pública do arquivo
      const { data: urlData } = supabase.storage.from('files').getPublicUrl(filePath);

      // 3. Atualizar dados do documento
      documentData = {
        ...documentData,
        arquivo_url: urlData.publicUrl,
        arquivo_nome: file.name,
        arquivo_tipo: file.type,
        arquivo_tamanho: file.size,
      };
    }

    // 4. Atualizar registro do documento no banco
    const { data, error } = await supabase
      .from('documentos')
      .update(documentData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return { data: data[0], error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Excluir Documento

```typescript
// src/services/documents.ts
export const deleteDocument = async (id: string) => {
  try {
    // 1. Obter informações do documento
    const { data: document, error: getError } = await supabase
      .from('documentos')
      .select('arquivo_url')
      .eq('id', id)
      .single();

    if (getError) throw getError;

    // 2. Extrair o caminho do arquivo da URL
    const fileUrl = document.arquivo_url;
    const filePath = fileUrl.split('/').pop();
    const storagePath = `documentos/${filePath}`;

    // 3. Excluir o arquivo do Storage
    const { error: storageError } = await supabase.storage
      .from('files')
      .remove([storagePath]);

    if (storageError) throw storageError;

    // 4. Excluir o registro do documento
    const { error } = await supabase.from('documentos').delete().eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

## APIs de Relatórios

### Relatório de Projetos por Cliente

```typescript
// src/services/reports.ts
import { supabase, handleApiError } from './api';

export const getProjectsByClientReport = async (filters?: {
  data_inicio?: string;
  data_fim?: string;
  status?: string[];
}) => {
  try {
    let query = supabase.rpc('get_projects_by_client', {
      p_data_inicio: filters?.data_inicio || null,
      p_data_fim: filters?.data_fim || null,
      p_status: filters?.status || null,
    });

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Relatório de Tarefas por Usuário

```typescript
// src/services/reports.ts
export const getTasksByUserReport = async (filters?: {
  data_inicio?: string;
  data_fim?: string;
  status?: string[];
}) => {
  try {
    let query = supabase.rpc('get_tasks_by_user', {
      p_data_inicio: filters?.data_inicio || null,
      p_data_fim: filters?.data_fim || null,
      p_status: filters?.status || null,
    });

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Relatório de Faturamento por Cliente

```typescript
// src/services/reports.ts
export const getBillingByClientReport = async (filters?: {
  data_inicio?: string;
  data_fim?: string;
}) => {
  try {
    let query = supabase.rpc('get_billing_by_client', {
      p_data_inicio: filters?.data_inicio || null,
      p_data_fim: filters?.data_fim || null,
    });

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return handleApiError(error);
  }
};
```

## Funções RPC no Supabase

As funções RPC (Remote Procedure Call) são definidas no Supabase para operações complexas que não podem ser realizadas com simples consultas SQL.

### Função: get_projects_by_client

```sql
CREATE OR REPLACE FUNCTION get_projects_by_client(
  p_data_inicio DATE DEFAULT NULL,
  p_data_fim DATE DEFAULT NULL,
  p_status TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  cliente_id UUID,
  cliente_nome TEXT,
  total_projetos BIGINT,
  projetos_concluidos BIGINT,
  projetos_em_andamento BIGINT,
  valor_total NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    COUNT(p.id) AS total_projetos,
    COUNT(p.id) FILTER (WHERE p.status = 'concluido') AS projetos_concluidos,
    COUNT(p.id) FILTER (WHERE p.status = 'em_andamento') AS projetos_em_andamento,
    COALESCE(SUM(p.valor), 0) AS valor_total
  FROM
    clientes c
  LEFT JOIN
    projetos p ON c.id = p.cliente_id
  WHERE
    (p_data_inicio IS NULL OR p.data_inicio >= p_data_inicio) AND
    (p_data_fim IS NULL OR p.data_inicio <= p_data_fim) AND
    (p_status IS NULL OR p.status = ANY(p_status))
  GROUP BY
    c.id, c.nome
  ORDER BY
    c.nome;

END;
$$;
```

### Função: get_tasks_by_user

```sql
CREATE OR REPLACE FUNCTION get_tasks_by_user(
  p_data_inicio DATE DEFAULT NULL,
  p_data_fim DATE DEFAULT NULL,
  p_status TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  usuario_id UUID,
  usuario_nome TEXT,
  total_tarefas BIGINT,
  tarefas_concluidas BIGINT,
  tarefas_em_andamento BIGINT,
  tempo_estimado NUMERIC,
  tempo_gasto NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id AS usuario_id,
    u.nome AS usuario_nome,
    COUNT(t.id) AS total_tarefas,
    COUNT(t.id) FILTER (WHERE t.status = 'concluida') AS tarefas_concluidas,
    COUNT(t.id) FILTER (WHERE t.status = 'em_andamento') AS tarefas_em_andamento,
    COALESCE(SUM(t.tempo_estimado), 0) AS tempo_estimado,
    COALESCE(SUM(t.tempo_gasto), 0) AS tempo_gasto
  FROM
    profiles u
  LEFT JOIN
    tarefas t ON u.id = t.responsavel_id
  WHERE
    (p_data_inicio IS NULL OR t.data_inicio >= p_data_inicio) AND
    (p_data_fim IS NULL OR t.data_inicio <= p_data_fim) AND
    (p_status IS NULL OR t.status = ANY(p_status))
  GROUP BY
    u.id, u.nome
  ORDER BY
    u.nome;

END;
$$;
```

### Função: get_billing_by_client

```sql
CREATE OR REPLACE FUNCTION get_billing_by_client(
  p_data_inicio DATE DEFAULT NULL,
  p_data_fim DATE DEFAULT NULL
)
RETURNS TABLE (
  cliente_id UUID,
  cliente_nome TEXT,
  total_projetos BIGINT,
  valor_total NUMERIC,
  valor_faturado NUMERIC,
  valor_pendente NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    COUNT(p.id) AS total_projetos,
    COALESCE(SUM(p.valor), 0) AS valor_total,
    COALESCE(SUM(p.valor) FILTER (WHERE p.status = 'concluido'), 0) AS valor_faturado,
    COALESCE(SUM(p.valor) FILTER (WHERE p.status != 'concluido'), 0) AS valor_pendente
  FROM
    clientes c
  LEFT JOIN
    projetos p ON c.id = p.cliente_id
  WHERE
    (p_data_inicio IS NULL OR p.data_inicio >= p_data_inicio) AND
    (p_data_fim IS NULL OR p.data_inicio <= p_data_fim)
  GROUP BY
    c.id, c.nome
  ORDER BY
    valor_total DESC;

END;
$$;
```

## Políticas de Segurança RLS

O Supabase utiliza Row Level Security (RLS) para controlar o acesso aos dados. Abaixo estão algumas das políticas implementadas:

### Tabela: clientes

```sql
-- Política para leitura
CREATE POLICY "Usuários autenticados podem ler clientes" ON clientes
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política para inserção
CREATE POLICY "Apenas admins e gerentes podem criar clientes" ON clientes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.perfil IN ('admin', 'gerente')
    )
  );

-- Política para atualização
CREATE POLICY "Apenas admins e gerentes podem atualizar clientes" ON clientes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.perfil IN ('admin', 'gerente')
    )
  );

-- Política para exclusão
CREATE POLICY "Apenas admins podem excluir clientes" ON clientes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.perfil = 'admin'
    )
  );
```

## Tratamento de Erros

O projeto utiliza um sistema centralizado de tratamento de erros para lidar com erros de API de forma consistente.

```typescript
// src/utils/errorHandler.ts
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export const handleApiError = (error: any) => {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return {
      error: {
        message: error.message,
        status: error.status,
        code: error.code,
      },
    };
  }

  // Erros do Supabase
  if (error?.code && error?.message) {
    return {
      error: {
        message: error.message,
        status: error.code.startsWith('23') ? 400 : 500, // Códigos 23xxx são erros de validação
        code: error.code,
      },
    };
  }

  // Erro genérico
  return {
    error: {
      message: 'Ocorreu um erro inesperado',
      status: 500,
    },
  };
};
```

## Conclusão

Este documento fornece uma visão geral das APIs e serviços utilizados no projeto Valore-81. Ele deve ser atualizado sempre que houver alterações significativas nas APIs ou serviços.

Para mais informações sobre o Supabase, consulte a [documentação oficial](https://supabase.io/docs).