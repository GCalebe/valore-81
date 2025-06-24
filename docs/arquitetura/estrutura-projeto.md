# Estrutura do Projeto

Este documento descreve a organização de pastas e arquivos do projeto Valore-81, explicando a estrutura geral e as convenções adotadas.

## Visão Geral

O Valore-81 é uma aplicação React/Next.js com uma estrutura organizada para facilitar a manutenção, escalabilidade e colaboração entre desenvolvedores. A estrutura segue princípios de separação de responsabilidades e modularidade.

## Estrutura de Diretórios

```
valore-81/
├── docs/                    # Documentação do projeto
│   ├── arquitetura/         # Documentação da arquitetura
│   ├── componentes/         # Documentação dos componentes
│   ├── guias/               # Guias e boas práticas
│   └── historico/           # Histórico de alterações
├── public/                  # Arquivos estáticos públicos
│   ├── favicon.ico          # Favicon do site
│   ├── images/              # Imagens públicas
│   └── fonts/               # Fontes personalizadas
├── src/                     # Código-fonte da aplicação
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── common/          # Componentes comuns (botões, inputs, etc.)
│   │   ├── layout/          # Componentes de layout (header, footer, etc.)
│   │   ├── clients/         # Componentes relacionados a clientes
│   │   ├── projects/        # Componentes relacionados a projetos
│   │   └── ui/              # Componentes de UI (modais, tooltips, etc.)
│   ├── contexts/            # Contextos React para estado global
│   ├── hooks/               # Hooks personalizados
│   ├── lib/                 # Bibliotecas e configurações
│   │   ├── supabaseClient.ts # Cliente Supabase
│   │   └── queryClient.ts   # Configuração do React Query
│   ├── pages/               # Páginas da aplicação (roteamento Next.js)
│   │   ├── _app.tsx         # Componente App principal
│   │   ├── _document.tsx    # Documento HTML personalizado
│   │   ├── api/             # Rotas de API (Next.js API Routes)
│   │   ├── auth/            # Páginas de autenticação
│   │   ├── clients/         # Páginas relacionadas a clientes
│   │   └── projects/        # Páginas relacionadas a projetos
│   ├── services/            # Serviços para comunicação com APIs
│   ├── stores/              # Stores para gerenciamento de estado
│   ├── styles/              # Estilos globais e temas
│   │   ├── globals.css      # Estilos globais
│   │   └── theme.ts         # Definição de temas
│   ├── types/               # Definições de tipos TypeScript
│   └── utils/               # Funções utilitárias
│       ├── formatters.ts    # Funções de formatação
│       ├── validators.ts    # Funções de validação
│       └── helpers.ts       # Funções auxiliares diversas
├── scripts/                 # Scripts de automação e utilitários
├── supabase/                # Configurações e migrações do Supabase
│   ├── migrations/          # Migrações de banco de dados
│   └── seed/                # Dados iniciais para desenvolvimento
├── .env.local               # Variáveis de ambiente locais
├── .env.example             # Exemplo de variáveis de ambiente
├── .eslintrc.js             # Configuração do ESLint
├── .gitignore               # Arquivos ignorados pelo Git
├── .prettierrc              # Configuração do Prettier
├── jest.config.js           # Configuração do Jest
├── next.config.js           # Configuração do Next.js
├── package.json             # Dependências e scripts
├── README.md                # Documentação principal
├── tailwind.config.js       # Configuração do Tailwind CSS
└── tsconfig.json            # Configuração do TypeScript
```

## Detalhamento dos Diretórios Principais

### `/docs`

Contém toda a documentação do projeto, organizada em subpastas temáticas:

- **arquitetura/**: Documentação sobre a arquitetura do sistema, padrões de projeto, fluxo de dados, etc.
- **componentes/**: Documentação detalhada dos componentes reutilizáveis, incluindo props, exemplos de uso e comportamentos.
- **guias/**: Guias e tutoriais para desenvolvedores, incluindo boas práticas, padrões de código e fluxos de trabalho.
- **historico/**: Registro de alterações significativas no projeto, incluindo refatorações, novas funcionalidades e correções importantes.

### `/public`

Arquivos estáticos que são servidos diretamente pelo servidor web:

- **images/**: Imagens utilizadas na aplicação, como logos, ícones e ilustrações.
- **fonts/**: Arquivos de fontes personalizadas utilizadas no projeto.

### `/src`

Contém todo o código-fonte da aplicação, organizado em subpastas por responsabilidade:

#### `/src/components`

Componentes React reutilizáveis, organizados por domínio ou função:

- **common/**: Componentes básicos e genéricos que são utilizados em toda a aplicação, como botões, inputs, cards, etc.
  ```
  common/
  ├── Button/
  │   ├── Button.tsx
  │   ├── Button.module.css
  │   └── index.ts
  ├── Input/
  │   ├── Input.tsx
  │   ├── Input.module.css
  │   └── index.ts
  └── Card/
      ├── Card.tsx
      ├── Card.module.css
      └── index.ts
  ```

- **layout/**: Componentes relacionados à estrutura de layout da aplicação, como header, footer, sidebar, etc.
  ```
  layout/
  ├── Header/
  │   ├── Header.tsx
  │   ├── Header.module.css
  │   └── index.ts
  ├── Footer/
  │   ├── Footer.tsx
  │   ├── Footer.module.css
  │   └── index.ts
  ├── Sidebar/
  │   ├── Sidebar.tsx
  │   ├── Sidebar.module.css
  │   └── index.ts
  └── MainLayout/
      ├── MainLayout.tsx
      ├── MainLayout.module.css
      └── index.ts
  ```

- **clients/**: Componentes específicos para a funcionalidade de clientes, incluindo tabelas, formulários, detalhes, etc.
  ```
  clients/
  ├── ClientsTableStandardized/
  │   ├── ClientsTableStandardized.tsx
  │   ├── ClientsTableStandardized.module.css
  │   └── index.ts
  ├── ClientDetailSheetStandardized/
  │   ├── ClientDetailSheetStandardized.tsx
  │   ├── ClientDetailSheetStandardized.module.css
  │   └── index.ts
  ├── ClientForm/
  │   ├── ClientForm.tsx
  │   ├── ClientForm.module.css
  │   └── index.ts
  └── ClientsModals/
      ├── ClientsModals.tsx
      ├── ClientsModals.module.css
      └── index.ts
  ```

- **projects/**: Componentes específicos para a funcionalidade de projetos.
- **ui/**: Componentes de interface do usuário mais complexos, como modais, tooltips, menus dropdown, etc.

#### `/src/contexts`

Contextos React para gerenciamento de estado global e compartilhamento de dados entre componentes:

```
contexts/
├── AuthContext.tsx       # Contexto de autenticação
├── ThemeContext.tsx      # Contexto de tema (claro/escuro)
└── NotificationContext.tsx # Contexto de notificações
```

#### `/src/hooks`

Hooks personalizados para encapsular lógica reutilizável:

```
hooks/
├── useClients.ts         # Hook para operações com clientes
├── useProjects.ts        # Hook para operações com projetos
├── useForm.ts            # Hook para gerenciamento de formulários
├── useLocalStorage.ts    # Hook para interação com localStorage
└── useMediaQuery.ts      # Hook para consultas de media queries
```

#### `/src/lib`

Bibliotecas e configurações de serviços externos:

```
lib/
├── supabaseClient.ts     # Cliente Supabase configurado
├── queryClient.ts        # Configuração do React Query
└── axios.ts              # Cliente Axios configurado
```

#### `/src/pages`

Páginas da aplicação, seguindo a estrutura de roteamento do Next.js:

```
pages/
├── _app.tsx              # Componente App principal
├── _document.tsx         # Documento HTML personalizado
├── index.tsx             # Página inicial
├── api/                  # Rotas de API (Next.js API Routes)
│   ├── auth/             # Endpoints de autenticação
│   ├── clients/          # Endpoints de clientes
│   └── projects/         # Endpoints de projetos
├── auth/                 # Páginas de autenticação
│   ├── login.tsx         # Página de login
│   ├── register.tsx      # Página de registro
│   └── reset-password.tsx # Página de redefinição de senha
├── clients/              # Páginas relacionadas a clientes
│   ├── index.tsx         # Lista de clientes
│   ├── [id].tsx          # Detalhes de um cliente específico
│   └── new.tsx           # Página para criar novo cliente
└── projects/             # Páginas relacionadas a projetos
    ├── index.tsx         # Lista de projetos
    ├── [id].tsx          # Detalhes de um projeto específico
    └── new.tsx           # Página para criar novo projeto
```

#### `/src/services`

Serviços para comunicação com APIs e fontes de dados externas:

```
services/
├── api.ts                # Configuração base da API
├── authService.ts        # Serviço de autenticação
├── clientsService.ts     # Serviço para operações com clientes
└── projectsService.ts    # Serviço para operações com projetos
```

#### `/src/stores`

Stores para gerenciamento de estado global (usando Zustand ou outra biblioteca):

```
stores/
├── uiStore.ts            # Store para estado da UI
├── clientsStore.ts       # Store para dados de clientes
└── projectsStore.ts      # Store para dados de projetos
```

#### `/src/styles`

Estilos globais e configurações de tema:

```
styles/
├── globals.css           # Estilos globais
├── theme.ts              # Definição de temas
└── variables.css         # Variáveis CSS
```

#### `/src/types`

Definições de tipos TypeScript para a aplicação:

```
types/
├── client.ts             # Tipos relacionados a clientes
├── project.ts            # Tipos relacionados a projetos
├── user.ts               # Tipos relacionados a usuários
└── common.ts             # Tipos comuns utilizados em toda a aplicação
```

#### `/src/utils`

Funções utilitárias reutilizáveis:

```
utils/
├── formatters.ts         # Funções para formatação de dados
├── validators.ts         # Funções para validação de dados
├── date.ts               # Utilitários para manipulação de datas
└── helpers.ts            # Funções auxiliares diversas
```

### `/scripts`

Scripts de automação e utilitários para tarefas de desenvolvimento, build, deploy, etc.:

```
scripts/
├── generate-component.js  # Script para gerar estrutura de componentes
├── db-seed.js             # Script para popular banco de dados de desenvolvimento
└── analyze-bundle.js      # Script para análise de tamanho do bundle
```

### `/supabase`

Configurações e migrações do Supabase:

```
supabase/
├── migrations/            # Migrações de banco de dados
│   ├── 20230601_initial_schema.sql
│   └── 20230615_add_client_fields.sql
└── seed/                  # Dados iniciais para desenvolvimento
    ├── clients.sql
    └── projects.sql
```

## Convenções de Nomenclatura

### Arquivos e Diretórios

- **Componentes**: PascalCase para nomes de componentes e seus diretórios
  - Exemplo: `Button.tsx`, `ClientsTable.tsx`

- **Hooks**: camelCase com prefixo "use"
  - Exemplo: `useClients.ts`, `useForm.ts`

- **Utilitários**: camelCase
  - Exemplo: `formatters.ts`, `validators.ts`

- **Páginas**: kebab-case para URLs, mas camelCase ou PascalCase para nomes de arquivos
  - Exemplo: `/clients/new` (URL), `new.tsx` (arquivo)

### Componentes

- Cada componente deve estar em seu próprio diretório com a seguinte estrutura:
  ```
  ComponentName/
  ├── ComponentName.tsx       # Implementação do componente
  ├── ComponentName.module.css # Estilos específicos do componente (opcional)
  ├── ComponentName.test.tsx   # Testes do componente (opcional)
  └── index.ts                # Exportação do componente
  ```

- O arquivo `index.ts` deve exportar o componente como exportação padrão:
  ```typescript
  export { default } from './ComponentName';
  export * from './ComponentName'; // Para exportações nomeadas adicionais
  ```

### Importações

- Importações são organizadas em grupos, separados por uma linha em branco:
  1. Importações de bibliotecas externas
  2. Importações de componentes internos
  3. Importações de hooks, utilitários, tipos, etc.
  4. Importações de estilos

```typescript
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

import { useClients } from '@/hooks/useClients';
import { formatCurrency } from '@/utils/formatters';
import type { Client } from '@/types/client';

import styles from './ComponentName.module.css';
```

## Padrões de Código

### Componentes

- Preferência por componentes funcionais com hooks
- Props tipadas com interfaces TypeScript
- Uso de destructuring para props
- Exportação padrão para componentes principais

```typescript
import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  label,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
```

### Hooks

- Encapsulam lógica reutilizável
- Seguem as regras de hooks do React
- Retornam valores e funções em um objeto para facilitar o destructuring

```typescript
import { useState, useCallback } from 'react';

interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

export const useToggle = (initialValue = false): UseToggleReturn => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse, setValue };
};
```

### Páginas

- Seguem a estrutura de roteamento do Next.js
- Focam na composição de componentes e gerenciamento de estado da página
- Utilizam hooks para lógica de negócios e acesso a dados

```typescript
import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import MainLayout from '@/components/layout/MainLayout';
import ClientsTableStandardized from '@/components/clients/ClientsTableStandardized';
import ClientsModals from '@/components/clients/ClientsModals';

import { useClients, useDeleteClient } from '@/hooks/useClients';
import { useUIStore } from '@/stores/uiStore';

const ClientsPage: NextPage = () => {
  const { data: clients, isLoading, error } = useClients();
  const deleteClient = useDeleteClient();
  const { addNotification } = useUIStore();

  const handleViewDetails = (id: string) => {
    // Lógica para visualizar detalhes
  };

  const handleEdit = (id: string) => {
    // Lógica para editar cliente
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteClient.mutateAsync(id);
        addNotification('Cliente excluído com sucesso', 'success');
      } catch (error) {
        addNotification(`Erro ao excluir cliente: ${error.message}`, 'error');
      }
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>Clientes | Valore-81</title>
      </Head>

      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Clientes</h1>

        <ClientsTableStandardized
          clients={clients || []}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ClientsModals />
      </div>
    </MainLayout>
  );
};

export default ClientsPage;
```

## Gerenciamento de Dependências

### Dependências Principais

- **React & Next.js**: Framework principal
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework de CSS utilitário
- **React Query**: Gerenciamento de estado do servidor
- **Zustand**: Gerenciamento de estado global simples
- **Supabase**: Backend as a Service (BaaS)
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de esquemas

### Organização do package.json

- Dependências são organizadas por função
- Scripts são nomeados de forma descritiva
- Versões são fixadas para garantir consistência

```json
{
  "name": "valore-81",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.21.0",
    "@tanstack/react-query": "^4.29.5",
    "@tanstack/react-query-devtools": "^4.29.6",
    "next": "13.4.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-hook-form": "^7.43.9",
    "zod": "^3.21.4",
    "zustand": "^4.3.8"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^14.0.0",
    "@types/node": "18.16.3",
    "@types/react": "18.2.0",
    "@types/react-dom": "18.2.1",
    "autoprefixer": "^10.4.14",
    "eslint": "8.39.0",
    "eslint-config-next": "13.4.1",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "postcss": "^8.4.23",
    "prettier": "^2.8.8",
    "tailwindcss": "^3.3.2",
    "typescript": "5.0.4"
  }
}
```

## Conclusão

A estrutura do projeto Valore-81 foi projetada para promover a organização, manutenibilidade e escalabilidade do código. Seguindo as convenções e padrões descritos neste documento, a equipe de desenvolvimento pode trabalhar de forma mais eficiente e consistente.

Esta estrutura não é estática e pode evoluir conforme as necessidades do projeto, mas sempre mantendo os princípios de separação de responsabilidades, modularidade e clareza.