# Modelos de Dados

Este documento descreve os principais modelos de dados utilizados no projeto Valore-81, suas propriedades e relações.

## Visão Geral

O Valore-81 utiliza o Supabase como banco de dados PostgreSQL e serviço de autenticação. Os principais modelos de dados são:

1. **Clientes** - Informações sobre os clientes da plataforma
2. **Usuários** - Usuários do sistema com diferentes níveis de acesso
3. **Projetos** - Projetos associados aos clientes
4. **Tarefas** - Tarefas relacionadas aos projetos
5. **Documentos** - Documentos associados a clientes ou projetos

## Modelos Detalhados

### Cliente

Representa um cliente da plataforma.

```typescript
interface Cliente {
  id: string; // UUID gerado pelo Supabase
  created_at: string; // Data de criação (ISO 8601)
  nome: string; // Nome do cliente
  email: string; // Email principal do cliente
  telefone: string; // Telefone principal
  cnpj: string | null; // CNPJ (apenas para PJ)
  cpf: string | null; // CPF (apenas para PF)
  tipo: "PF" | "PJ"; // Tipo de cliente (Pessoa Física ou Jurídica)
  endereco: Endereco; // Objeto com informações de endereço
  contatos: Contato[]; // Lista de contatos adicionais
  status: StatusCliente; // Status do cliente
  observacoes: string | null; // Observações gerais
  avatar_url: string | null; // URL da imagem de avatar
  metadata: Record<string, any> | null; // Metadados adicionais
}

interface Endereco {
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface Contato {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string | null;
  principal: boolean;
}

enum StatusCliente {
  Ativo = "ativo",
  Inativo = "inativo",
  Prospecto = "prospecto",
  Arquivado = "arquivado",
}
```

### Usuário

Representa um usuário do sistema.

```typescript
interface Usuario {
  id: string; // UUID gerado pelo Supabase Auth
  created_at: string; // Data de criação (ISO 8601)
  email: string; // Email do usuário (usado para login)
  nome: string; // Nome completo
  avatar_url: string | null; // URL da imagem de avatar
  cargo: string | null; // Cargo na empresa
  departamento: string | null; // Departamento
  telefone: string | null; // Telefone de contato
  ultimo_login: string | null; // Data do último login
  status: StatusUsuario; // Status do usuário
  perfil: PerfilUsuario; // Perfil de acesso
  metadata: Record<string, any> | null; // Metadados adicionais
}

enum StatusUsuario {
  Ativo = "ativo",
  Inativo = "inativo",
  Pendente = "pendente",
  Bloqueado = "bloqueado",
}

enum PerfilUsuario {
  Admin = "admin", // Acesso total ao sistema
  Gerente = "gerente", // Acesso a todas as funcionalidades, exceto configurações avançadas
  Analista = "analista", // Acesso a clientes, projetos e tarefas
  Operador = "operador", // Acesso limitado a tarefas específicas
  Cliente = "cliente", // Acesso apenas a seus próprios projetos (portal do cliente)
}
```

### Projeto

Representa um projeto associado a um cliente.

```typescript
interface Projeto {
  id: string; // UUID gerado pelo Supabase
  created_at: string; // Data de criação (ISO 8601)
  nome: string; // Nome do projeto
  descricao: string | null; // Descrição detalhada
  cliente_id: string; // ID do cliente associado
  responsavel_id: string; // ID do usuário responsável
  data_inicio: string; // Data de início (ISO 8601)
  data_fim_prevista: string; // Data de término prevista (ISO 8601)
  data_fim_real: string | null; // Data de término real (ISO 8601)
  status: StatusProjeto; // Status do projeto
  progresso: number; // Percentual de progresso (0-100)
  prioridade: Prioridade; // Prioridade do projeto
  valor: number | null; // Valor do projeto
  tags: string[]; // Tags para categorização
  metadata: Record<string, any> | null; // Metadados adicionais
}

enum StatusProjeto {
  Planejamento = "planejamento",
  EmAndamento = "em_andamento",
  Pausado = "pausado",
  Concluido = "concluido",
  Cancelado = "cancelado",
}

enum Prioridade {
  Baixa = "baixa",
  Media = "media",
  Alta = "alta",
  Urgente = "urgente",
}
```

### Tarefa

Representa uma tarefa relacionada a um projeto.

```typescript
interface Tarefa {
  id: string; // UUID gerado pelo Supabase
  created_at: string; // Data de criação (ISO 8601)
  titulo: string; // Título da tarefa
  descricao: string | null; // Descrição detalhada
  projeto_id: string; // ID do projeto associado
  responsavel_id: string | null; // ID do usuário responsável
  criador_id: string; // ID do usuário que criou a tarefa
  data_inicio: string | null; // Data de início (ISO 8601)
  data_fim_prevista: string | null; // Data de término prevista (ISO 8601)
  data_fim_real: string | null; // Data de término real (ISO 8601)
  status: StatusTarefa; // Status da tarefa
  progresso: number; // Percentual de progresso (0-100)
  prioridade: Prioridade; // Prioridade da tarefa
  tempo_estimado: number | null; // Tempo estimado em horas
  tempo_gasto: number | null; // Tempo gasto em horas
  tags: string[]; // Tags para categorização
  subtarefas: Subtarefa[]; // Lista de subtarefas
  metadata: Record<string, any> | null; // Metadados adicionais
}

interface Subtarefa {
  id: string;
  titulo: string;
  concluida: boolean;
  responsavel_id: string | null;
}

enum StatusTarefa {
  Backlog = "backlog",
  ToDo = "to_do",
  EmAndamento = "em_andamento",
  EmRevisao = "em_revisao",
  Concluida = "concluida",
  Cancelada = "cancelada",
}
```

### Documento

Representa um documento associado a um cliente ou projeto.

```typescript
interface Documento {
  id: string; // UUID gerado pelo Supabase
  created_at: string; // Data de criação (ISO 8601)
  nome: string; // Nome do documento
  descricao: string | null; // Descrição do documento
  tipo: TipoDocumento; // Tipo do documento
  cliente_id: string | null; // ID do cliente associado (opcional)
  projeto_id: string | null; // ID do projeto associado (opcional)
  criador_id: string; // ID do usuário que criou o documento
  arquivo_url: string; // URL do arquivo no Storage
  arquivo_nome: string; // Nome original do arquivo
  arquivo_tipo: string; // Tipo MIME do arquivo
  arquivo_tamanho: number; // Tamanho em bytes
  versao: string; // Versão do documento
  tags: string[]; // Tags para categorização
  metadata: Record<string, any> | null; // Metadados adicionais
}

enum TipoDocumento {
  Contrato = "contrato",
  Proposta = "proposta",
  Relatorio = "relatorio",
  Fatura = "fatura",
  Outro = "outro",
}
```

## Relações entre Modelos

### Cliente

- Um cliente pode ter múltiplos **Projetos**
- Um cliente pode ter múltiplos **Documentos**
- Um cliente pode ter múltiplos **Contatos**

### Usuário

- Um usuário pode ser responsável por múltiplos **Projetos**
- Um usuário pode ser responsável por múltiplas **Tarefas**
- Um usuário pode criar múltiplos **Documentos**

### Projeto

- Um projeto pertence a um único **Cliente**
- Um projeto tem um único **Usuário** responsável
- Um projeto pode ter múltiplas **Tarefas**
- Um projeto pode ter múltiplos **Documentos**

### Tarefa

- Uma tarefa pertence a um único **Projeto**
- Uma tarefa pode ter um único **Usuário** responsável
- Uma tarefa tem um único **Usuário** criador
- Uma tarefa pode ter múltiplas **Subtarefas**

### Documento

- Um documento pode estar associado a um **Cliente** ou a um **Projeto** (ou ambos)
- Um documento tem um único **Usuário** criador

## Diagrama de Entidade-Relacionamento

```
[Cliente] 1 --- N [Projeto]
[Cliente] 1 --- N [Documento]
[Cliente] 1 --- N [Contato]

[Usuário] 1 --- N [Projeto] (como responsável)
[Usuário] 1 --- N [Tarefa] (como responsável)
[Usuário] 1 --- N [Tarefa] (como criador)
[Usuário] 1 --- N [Documento] (como criador)

[Projeto] N --- 1 [Cliente]
[Projeto] N --- 1 [Usuário] (responsável)
[Projeto] 1 --- N [Tarefa]
[Projeto] 1 --- N [Documento]

[Tarefa] N --- 1 [Projeto]
[Tarefa] N --- 1 [Usuário] (responsável)
[Tarefa] N --- 1 [Usuário] (criador)
[Tarefa] 1 --- N [Subtarefa]

[Documento] N --- 1 [Cliente] (opcional)
[Documento] N --- 1 [Projeto] (opcional)
[Documento] N --- 1 [Usuário] (criador)
```

## Índices e Consultas Comuns

### Índices Recomendados

- `clientes(id, status)`
- `projetos(id, cliente_id, responsavel_id, status)`
- `tarefas(id, projeto_id, responsavel_id, status)`
- `documentos(id, cliente_id, projeto_id)`

### Consultas Comuns

1. **Listar clientes ativos**:

   ```sql
   SELECT * FROM clientes WHERE status = 'ativo' ORDER BY nome;
   ```

2. **Buscar projetos de um cliente**:

   ```sql
   SELECT * FROM projetos WHERE cliente_id = :cliente_id ORDER BY data_inicio DESC;
   ```

3. **Listar tarefas de um projeto**:

   ```sql
   SELECT * FROM tarefas WHERE projeto_id = :projeto_id ORDER BY prioridade DESC, data_fim_prevista;
   ```

4. **Buscar tarefas atribuídas a um usuário**:

   ```sql
   SELECT t.*, p.nome as projeto_nome, c.nome as cliente_nome
   FROM tarefas t
   JOIN projetos p ON t.projeto_id = p.id
   JOIN clientes c ON p.cliente_id = c.id
   WHERE t.responsavel_id = :usuario_id AND t.status != 'concluida' AND t.status != 'cancelada'
   ORDER BY t.prioridade DESC, t.data_fim_prevista;
   ```

5. **Buscar documentos de um cliente ou projeto**:
   ```sql
   SELECT * FROM documentos
   WHERE (cliente_id = :cliente_id OR projeto_id = :projeto_id)
   ORDER BY created_at DESC;
   ```

## Validação de Dados

As seguintes regras de validação devem ser aplicadas aos modelos de dados:

### Cliente

- `nome`: Obrigatório, mínimo 2 caracteres
- `email`: Obrigatório, formato de email válido
- `telefone`: Obrigatório, formato válido
- `cnpj`: Obrigatório para PJ, formato válido
- `cpf`: Obrigatório para PF, formato válido
- `tipo`: Obrigatório, deve ser 'PF' ou 'PJ'

### Usuário

- `email`: Obrigatório, formato de email válido, único
- `nome`: Obrigatório, mínimo 2 caracteres
- `perfil`: Obrigatório, deve ser um dos valores do enum PerfilUsuario

### Projeto

- `nome`: Obrigatório, mínimo 2 caracteres
- `cliente_id`: Obrigatório, deve existir na tabela clientes
- `responsavel_id`: Obrigatório, deve existir na tabela usuarios
- `data_inicio`: Obrigatório, formato de data válido
- `data_fim_prevista`: Obrigatório, formato de data válido, deve ser posterior a data_inicio

### Tarefa

- `titulo`: Obrigatório, mínimo 2 caracteres
- `projeto_id`: Obrigatório, deve existir na tabela projetos
- `criador_id`: Obrigatório, deve existir na tabela usuarios
- `data_fim_prevista`: Se fornecido, deve ser posterior a data_inicio

## Considerações de Segurança

1. **Políticas de Acesso RLS (Row Level Security)**:

   - Usuários só podem ver clientes, projetos e tarefas de acordo com seu perfil
   - Clientes só podem ver seus próprios projetos e documentos

2. **Auditoria**:

   - Todas as tabelas incluem campos `created_at` e `updated_at`
   - Operações de exclusão são registradas em tabelas de auditoria

3. **Backup**:
   - Backups diários do banco de dados
   - Retenção de 30 dias para backups

## Evolução do Esquema

Ao fazer alterações no esquema de dados, siga estas diretrizes:

1. Use migrações para alterar o esquema
2. Documente as alterações no histórico de alterações
3. Mantenha compatibilidade com versões anteriores quando possível
4. Atualize este documento para refletir as alterações

## Conclusão

Este documento fornece uma visão geral dos modelos de dados utilizados no projeto Valore-81. Ele deve ser atualizado sempre que houver alterações significativas no esquema de dados.
