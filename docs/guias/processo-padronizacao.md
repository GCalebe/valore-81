# Processo de Padronização

Este documento descreve o processo de padronização de código e componentes no projeto Valore-81, incluindo motivações, metodologia e benefícios.

## Visão Geral

A padronização é um processo contínuo que visa melhorar a qualidade, manutenibilidade e escalabilidade do código através da adoção de convenções e práticas consistentes. No Valore-81, a padronização abrange diversos aspectos do desenvolvimento, desde a estrutura de arquivos até a implementação de componentes e padrões de código.

## Motivações para Padronização

1. **Consistência**: Garantir que o código seja consistente em todo o projeto, facilitando a leitura e compreensão.
2. **Manutenibilidade**: Reduzir o esforço necessário para manter e atualizar o código ao longo do tempo.
3. **Escalabilidade**: Permitir que o projeto cresça de forma organizada e sustentável.
4. **Onboarding**: Facilitar a integração de novos desenvolvedores ao projeto.
5. **Qualidade**: Melhorar a qualidade geral do código e reduzir a incidência de bugs.
6. **Produtividade**: Aumentar a velocidade de desenvolvimento através da reutilização de componentes e padrões.

## Áreas de Padronização

### 1. Estrutura de Arquivos e Diretórios

A estrutura de arquivos e diretórios segue um padrão consistente que reflete a organização lógica do projeto:

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── common/          # Componentes comuns (botões, inputs, etc.)
│   ├── layout/          # Componentes de layout (header, footer, etc.)
│   ├── clients/         # Componentes relacionados a clientes
│   └── ui/              # Componentes de UI (modais, tooltips, etc.)
├── contexts/            # Contextos React para estado global
├── hooks/               # Hooks personalizados
├── lib/                 # Bibliotecas e configurações
├── pages/               # Páginas da aplicação (roteamento Next.js)
├── services/            # Serviços para comunicação com APIs
├── stores/              # Stores para gerenciamento de estado
├── styles/              # Estilos globais e temas
├── types/               # Definições de tipos TypeScript
└── utils/               # Funções utilitárias
```

### 2. Nomenclatura

A nomenclatura segue convenções específicas para cada tipo de elemento:

- **Componentes**: PascalCase (ex: `Button.tsx`, `ClientsTable.tsx`)
- **Hooks**: camelCase com prefixo "use" (ex: `useClients.ts`, `useForm.ts`)
- **Utilitários**: camelCase (ex: `formatters.ts`, `validators.ts`)
- **Tipos**: PascalCase (ex: `Client.ts`, `User.ts`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `API_URL`, `MAX_ITEMS`)

### 3. Componentes

Os componentes seguem um padrão de estrutura e implementação consistente:

- Cada componente está em seu próprio diretório com a seguinte estrutura:
  ```
  ComponentName/
  ├── ComponentName.tsx       # Implementação do componente
  ├── ComponentName.module.css # Estilos específicos do componente (opcional)
  ├── ComponentName.test.tsx   # Testes do componente (opcional)
  └── index.ts                # Exportação do componente
  ```

- Os componentes são tipados com TypeScript usando interfaces para props:
  ```tsx
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    label: string;
    onClick?: () => void;
    disabled?: boolean;
  }
  ```

- Os componentes padronizados seguem a convenção de nomenclatura com sufixo "Standardized":
  ```
  ClientsTableStandardized
  ClientDetailSheetStandardized
  ```

### 4. Estilos

Os estilos seguem uma abordagem consistente usando CSS Modules e/ou Tailwind CSS:

- **CSS Modules**: Para estilos específicos de componentes
  ```css
  /* Button.module.css */
  .button {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: 600;
  }
  
  .primary {
    background-color: var(--color-primary);
    color: white;
  }
  ```

- **Tailwind CSS**: Para estilos utilitários inline
  ```tsx
  <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
    {label}
  </button>
  ```

### 5. Estado

O gerenciamento de estado segue padrões específicos para diferentes tipos de estado:

- **Estado Local**: Gerenciado com `useState` ou `useReducer`
- **Estado Global**: Gerenciado com Context API, Zustand ou outras bibliotecas
- **Estado do Servidor**: Gerenciado com React Query

### 6. Formulários

Os formulários seguem um padrão consistente usando React Hook Form e Zod para validação:

```tsx
// Schema de validação com Zod
const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

// React Hook Form
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<ClientFormData>({
  resolver: zodResolver(clientSchema),
});
```

## Processo de Padronização de Componentes

A padronização de componentes é um processo contínuo que envolve várias etapas:

### 1. Identificação

A primeira etapa é identificar componentes que precisam ser padronizados. Isso pode ocorrer por diversos motivos:

- Componentes duplicados ou similares em diferentes partes do projeto
- Componentes com implementações inconsistentes
- Componentes que não seguem as melhores práticas ou convenções do projeto
- Componentes que precisam ser reutilizados em novas funcionalidades

**Exemplo**: Identificação de tabelas de clientes inconsistentes em diferentes partes do projeto.

### 2. Análise

Após a identificação, é necessário analisar os componentes existentes para entender suas funcionalidades, comportamentos e requisitos:

- Quais props são necessárias?
- Quais comportamentos são comuns?
- Quais variações existem?
- Quais dependências são utilizadas?

**Exemplo**: Análise das diferentes implementações de tabelas de clientes para identificar props comuns, comportamentos e variações.

### 3. Design

Com base na análise, é criado um design para o componente padronizado:

- Definição da interface de props
- Definição da estrutura interna
- Definição de comportamentos e variações
- Definição de estilos

**Exemplo**: Design da interface de props para o componente `ClientsTableStandardized`:

```tsx
interface ClientsTableStandardizedProps {
  clients: Client[];
  isLoading?: boolean;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  columns?: Array<keyof Client | 'actions'>;
  pageSize?: number;
  currentPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
}
```

### 4. Implementação

Com o design definido, o componente padronizado é implementado:

- Criação da estrutura de arquivos
- Implementação do componente
- Implementação de testes
- Documentação

**Exemplo**: Implementação do componente `ClientsTableStandardized`:

```tsx
// src/components/clients/ClientsTableStandardized/ClientsTableStandardized.tsx
import React from 'react';
import { Client } from '@/types/client';

interface ClientsTableStandardizedProps {
  clients: Client[];
  isLoading?: boolean;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  columns?: Array<keyof Client | 'actions'>;
  pageSize?: number;
  currentPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
}

const ClientsTableStandardized: React.FC<ClientsTableStandardizedProps> = ({
  clients,
  isLoading = false,
  onViewDetails,
  onEdit,
  onDelete,
  columns = ['name', 'email', 'phone', 'actions'],
  pageSize = 10,
  currentPage = 1,
  totalCount,
  onPageChange,
}) => {
  // Implementação do componente
  
  return (
    <div>
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.includes('name') && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                )}
                {columns.includes('email') && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                )}
                {columns.includes('phone') && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                )}
                {columns.includes('actions') && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  {columns.includes('name') && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    </td>
                  )}
                  {columns.includes('email') && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </td>
                  )}
                  {columns.includes('phone') && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </td>
                  )}
                  {columns.includes('actions') && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(client.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          Detalhes
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(client.id)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(client.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalCount && onPageChange && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage * pageSize >= totalCount}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, totalCount)}
                    </span>{' '}
                    de <span className="font-medium">{totalCount}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    {/* Páginas */}
                    {Array.from({ length: Math.ceil(totalCount / pageSize) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => onPageChange(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${currentPage === index + 1 ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage * pageSize >= totalCount}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Próximo
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientsTableStandardized;
```

### 5. Migração

Após a implementação, é necessário migrar os componentes existentes para usar o componente padronizado:

- Identificação de todos os locais onde os componentes antigos são utilizados
- Substituição dos componentes antigos pelo componente padronizado
- Adaptação das props conforme necessário
- Testes para garantir que a funcionalidade é mantida

**Exemplo**: Migração de uma página que usa uma tabela de clientes antiga para usar o componente `ClientsTableStandardized`:

```tsx
// Antes
<ClientsTable
  data={clients}
  loading={isLoading}
  onView={handleViewClient}
  onEdit={handleEditClient}
  onDelete={handleDeleteClient}
/>

// Depois
<ClientsTableStandardized
  clients={clients}
  isLoading={isLoading}
  onViewDetails={handleViewClient}
  onEdit={handleEditClient}
  onDelete={handleDeleteClient}
/>
```

### 6. Documentação

A documentação do componente padronizado é essencial para garantir seu uso correto:

- Descrição do componente
- Interface de props
- Exemplos de uso
- Comportamentos e variações
- Notas de implementação

**Exemplo**: Documentação do componente `ClientsTableStandardized`:

```markdown
# ClientsTableStandardized

Um componente de tabela padronizado para exibir listas de clientes com suporte a paginação, ordenação e ações personalizáveis.

## Props

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|------|------|------------|--------|------------|
| clients | Client[] | Sim | - | Lista de clientes a serem exibidos |
| isLoading | boolean | Não | false | Indica se os dados estão sendo carregados |
| onViewDetails | (id: string) => void | Não | - | Função chamada quando o botão "Detalhes" é clicado |
| onEdit | (id: string) => void | Não | - | Função chamada quando o botão "Editar" é clicado |
| onDelete | (id: string) => void | Não | - | Função chamada quando o botão "Excluir" é clicado |
| columns | Array<keyof Client \| 'actions'> | Não | ['name', 'email', 'phone', 'actions'] | Colunas a serem exibidas |
| pageSize | number | Não | 10 | Número de itens por página |
| currentPage | number | Não | 1 | Página atual |
| totalCount | number | Não | - | Número total de itens (necessário para paginação) |
| onPageChange | (page: number) => void | Não | - | Função chamada quando a página é alterada |

## Exemplos de Uso

### Tabela Básica

```tsx
<ClientsTableStandardized
  clients={clients}
  isLoading={isLoading}
/>
```

### Tabela com Ações

```tsx
<ClientsTableStandardized
  clients={clients}
  isLoading={isLoading}
  onViewDetails={handleViewDetails}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Tabela com Paginação

```tsx
<ClientsTableStandardized
  clients={clients}
  isLoading={isLoading}
  pageSize={10}
  currentPage={currentPage}
  totalCount={totalCount}
  onPageChange={handlePageChange}
/>
```

### Tabela com Colunas Personalizadas

```tsx
<ClientsTableStandardized
  clients={clients}
  isLoading={isLoading}
  columns={['name', 'email', 'actions']}
/>
```
```

## Benefícios da Padronização

A padronização traz diversos benefícios para o projeto:

### 1. Consistência

A padronização garante que o código seja consistente em todo o projeto, o que facilita a leitura e compreensão. Isso é especialmente importante em projetos com múltiplos desenvolvedores, onde cada um pode ter seu próprio estilo de codificação.

### 2. Reutilização

Componentes padronizados podem ser reutilizados em diferentes partes do projeto, reduzindo a duplicação de código e aumentando a produtividade. Isso também facilita a implementação de novas funcionalidades, pois os componentes já existem e podem ser facilmente adaptados.

### 3. Manutenibilidade

Código padronizado é mais fácil de manter, pois segue convenções consistentes e previsíveis. Isso reduz o tempo necessário para entender o código e fazer alterações, além de diminuir a probabilidade de introduzir bugs durante a manutenção.

### 4. Escalabilidade

A padronização permite que o projeto cresça de forma organizada e sustentável. Novos componentes podem ser adicionados seguindo os mesmos padrões, garantindo que o projeto mantenha sua coesão mesmo com o aumento de tamanho e complexidade.

### 5. Onboarding

Novos desenvolvedores podem se integrar mais rapidamente ao projeto, pois os padrões são claros e consistentes. Isso reduz o tempo de aprendizado e aumenta a produtividade da equipe como um todo.

### 6. Qualidade

A padronização melhora a qualidade geral do código, reduzindo a incidência de bugs e facilitando a identificação e correção de problemas. Componentes padronizados são mais testáveis e podem ter testes automatizados mais abrangentes.

## Métricas de Sucesso

Para avaliar o sucesso do processo de padronização, podem ser utilizadas diversas métricas:

### 1. Cobertura de Padronização

Porcentagem de componentes que seguem os padrões definidos em relação ao total de componentes do projeto.

### 2. Duplicação de Código

Redução na quantidade de código duplicado ou similar em diferentes partes do projeto.

### 3. Tempo de Desenvolvimento

Redução no tempo necessário para implementar novas funcionalidades devido à reutilização de componentes padronizados.

### 4. Bugs e Problemas

Redução na quantidade de bugs e problemas relacionados a inconsistências no código.

### 5. Tempo de Onboarding

Redução no tempo necessário para novos desenvolvedores se integrarem ao projeto e começarem a contribuir de forma efetiva.

## Conclusão

A padronização é um processo contínuo que traz diversos benefícios para o projeto Valore-81. Ao seguir padrões consistentes para estrutura de arquivos, nomenclatura, componentes, estilos, estado e formulários, o projeto se torna mais consistente, manutenível, escalável e de alta qualidade.

O processo de padronização de componentes, em particular, é uma parte importante desse esforço, permitindo a criação de uma biblioteca de componentes reutilizáveis que podem ser facilmente adaptados para diferentes necessidades.

A documentação adequada dos padrões e componentes é essencial para garantir que todos os membros da equipe possam seguir e contribuir para o processo de padronização, mantendo a consistência e qualidade do código em todo o projeto.