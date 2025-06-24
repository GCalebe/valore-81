# Guia de Padronização de Componentes

Este guia descreve o processo de padronização de componentes no projeto Valore-81, incluindo convenções de nomenclatura, estrutura de props e boas práticas.

## Objetivo da Padronização

A padronização de componentes tem como objetivos:

1. **Consistência**: Garantir que todos os componentes sigam o mesmo padrão visual e comportamental
2. **Manutenibilidade**: Facilitar a manutenção e evolução do código
3. **Reutilização**: Permitir a reutilização de componentes em diferentes contextos
4. **Testabilidade**: Melhorar a testabilidade dos componentes

## Convenções de Nomenclatura

### Componentes Padronizados

- **Nome**: `[Nome]Standardized.tsx`
- **Exemplo**: `ClientsTableStandardized.tsx`, `ClientDetailSheetStandardized.tsx`

### Componentes Adaptadores

- **Nome**: `[Nome]Adapter.tsx`
- **Exemplo**: `ClientDetailSheetAdapter.tsx`

## Estrutura de Props

As props dos componentes padronizados devem seguir as seguintes diretrizes:

1. **Tipagem**: Todas as props devem ser tipadas usando TypeScript
2. **Obrigatoriedade**: Props obrigatórias não devem ter valores padrão
3. **Documentação**: Todas as props devem ser documentadas com comentários JSDoc
4. **Nomenclatura**: Props devem seguir o padrão camelCase

Exemplo:

```tsx
type ClientsTableStandardizedProps = {
  /** Array de contatos/clientes a serem exibidos na tabela */
  contacts: Contact[];
  /** Indica se os dados estão sendo carregados */
  isLoading?: boolean;
  /** Termo de busca para filtrar os contatos */
  searchTerm?: string;
  /** Filtro por status do cliente */
  statusFilter?: string;
  /** Função chamada quando o usuário clica para ver detalhes de um cliente */
  onViewDetails: (contact: Contact) => void;
  // ... outras props
};
```

## Estrutura de Componentes

Os componentes padronizados devem seguir a seguinte estrutura:

```tsx
// Imports
import { FC } from 'react';
import { ComponenteA, ComponenteB } from './components';

// Tipagem de Props
type ComponenteStandardizedProps = {
  // ... definição de props
};

// Componente
export const ComponenteStandardized: FC<ComponenteStandardizedProps> = ({
  propA,
  propB,
  // ... outras props
}) => {
  // Lógica do componente

  return (
    // JSX do componente
  );
};
```

## Processo de Padronização

### 1. Identificação de Componentes a Serem Padronizados

- Componentes que são usados em múltiplos lugares
- Componentes que têm variações similares
- Componentes que são parte de um fluxo de usuário importante

### 2. Criação do Componente Padronizado

1. Crie um novo arquivo com o nome `[Nome]Standardized.tsx`
2. Defina as props do componente com tipagem adequada
3. Implemente o componente seguindo as boas práticas
4. Documente o componente com comentários JSDoc

### 3. Migração para o Componente Padronizado

1. Identifique todos os lugares onde o componente original é usado
2. Crie adaptadores se necessário para compatibilidade
3. Substitua o componente original pelo padronizado
4. Verifique se tudo funciona corretamente
5. Remova o componente original quando não for mais necessário

## Exemplo de Padronização

### Antes da Padronização

```tsx
// ClientsTable.tsx
export const ClientsTable = ({ clients, onEdit, onDelete }) => {
  // Implementação original
};

// Uso em diferentes lugares com variações
<ClientsTable clients={allClients} onEdit={handleEdit} onDelete={handleDelete} />
<ClientsTable clients={filteredClients} onEdit={handleEdit} />
```

### Após a Padronização

```tsx
// ClientsTableStandardized.tsx
type ClientsTableStandardizedProps = {
  contacts: Contact[];
  isLoading?: boolean;
  onEditClient: (contact: Contact) => void;
  onDeleteClient?: (contact: Contact) => void;
  // ... outras props
};

export const ClientsTableStandardized: FC<ClientsTableStandardizedProps> = ({
  contacts,
  isLoading = false,
  onEditClient,
  onDeleteClient,
  // ... outras props
}) => {
  // Implementação padronizada
};

// Uso do componente padronizado
<ClientsTableStandardized 
  contacts={allClients}
  onEditClient={handleEdit}
  onDeleteClient={handleDelete}
/>

<ClientsTableStandardized 
  contacts={filteredClients}
  onEditClient={handleEdit}
  onDeleteClient={() => {}}
/>
```

## Boas Práticas

1. **Componentes Puros**: Prefira componentes puros que dependem apenas de suas props
2. **Separação de Responsabilidades**: Cada componente deve ter uma única responsabilidade
3. **Composição**: Use composição de componentes em vez de componentes monolíticos
4. **Props Opcionais**: Use props opcionais com valores padrão quando apropriado
5. **Tipagem Estrita**: Use tipagem estrita para props e estado
6. **Documentação**: Documente o componente e suas props
7. **Testes**: Escreva testes para o componente

## Ferramentas de Padronização

O projeto inclui um script de padronização que pode ajudar na migração de componentes existentes para o padrão:

```bash
node scripts/implementar-padronizacao.js
```

Este script ajuda a:

1. Identificar componentes que precisam ser padronizados
2. Criar a estrutura inicial do componente padronizado
3. Migrar props e implementação do componente original
4. Atualizar importações nos arquivos que usam o componente

## Conclusão

A padronização de componentes é um processo contínuo que ajuda a manter a qualidade e consistência do código. Siga este guia ao criar novos componentes ou padronizar componentes existentes.