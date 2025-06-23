# Diretrizes para Padronização da Interface de Clientes

## Visão Geral

Este documento estabelece as diretrizes para a padronização da exibição de informações de clientes em todas as interfaces do sistema Valore. O objetivo é garantir consistência, melhorar a experiência do usuário e facilitar a manutenção do código.

## Componentes Padronizados

### UnifiedClientInfo

O componente `UnifiedClientInfo` é a base para exibição de informações de clientes em qualquer contexto. Ele organiza os dados em categorias lógicas e permite configuração flexível para diferentes contextos de uso.

**Localização:** `src/components/clients/UnifiedClientInfo.tsx`

**Características principais:**
- Organização em abas (Básico, Comercial, UTM, Personalizado, Documentos)
- Suporte a campos dinâmicos
- Modos de exibição compacto e detalhado
- Suporte a modo somente leitura ou editável

### ClientInfoStandardized

O componente `ClientInfoStandardized` é um wrapper que configura o `UnifiedClientInfo` para contextos específicos.

**Localização:** `src/components/clients/ClientInfoStandardized.tsx`

**Contextos suportados:**
- `chat`: Exibição na tela de chat
- `table`: Exibição resumida na tabela de clientes
- `details`: Exibição detalhada na tela de detalhes do cliente
- `edit`: Exibição editável no formulário de edição

## Categorias de Informações

As informações do cliente são organizadas nas seguintes categorias:

### 1. Informações Básicas
- Nome
- Email
- Telefone
- Nome do Cliente
- Tipo de Cliente
- Tamanho do Cliente
- CPF/CNPJ
- Endereço

### 2. Informações Comerciais
- Status
- Etapa do Funil
- Etapa da Consulta
- Setor do Cliente
- Usuário Responsável
- Vendas
- Orçamento
- Método de Pagamento
- Objetivo do Cliente
- Motivo de Perda
- Número de Contrato
- Data de Contrato
- Pagamento

### 3. Dados UTM
- Métricas de UTM (interações, campanhas, taxa de conversão)
- Principais fontes
- Principais campanhas
- Configurações de UTM

### 4. Campos Personalizados
- Campos dinâmicos definidos pelo usuário

### 5. Documentos
- Arquivos e documentos associados ao cliente

## Terminologia Padronizada

Para garantir consistência em toda a aplicação, utilize os seguintes termos:

| Campo | Termo Padronizado |
|-------|-------------------|
| name | Nome |
| email | Email |
| phone | Telefone |
| clientName | Nome do Cliente |
| clientType | Tipo de Cliente |
| clientSize | Tamanho do Cliente |
| cpfCnpj | CPF/CNPJ |
| address | Endereço |
| status | Status |
| kanbanStage | Etapa do Funil |
| consultationStage | Etapa da Consulta |
| clientSector | Setor do Cliente |
| responsibleUser | Usuário Responsável |
| sales | Vendas |
| budget | Orçamento |
| paymentMethod | Método de Pagamento |
| clientObjective | Objetivo do Cliente |
| lossReason | Motivo de Perda |
| contractNumber | Número de Contrato |
| contractDate | Data de Contrato |
| payment | Pagamento |

## Implementação

### Como usar o componente padronizado

```tsx
// Exemplo de uso do componente padronizado
import ClientInfoStandardized from '@/components/clients/ClientInfoStandardized';

// Na tela de chat
<ClientInfoStandardized 
  clientData={clientData}
  dynamicFields={dynamicFields}
  context="chat"
/>

// Na tabela de clientes (modo compacto)
<ClientInfoStandardized 
  clientData={clientData}
  context="table"
  compact={true}
/>

// Na tela de detalhes
<ClientInfoStandardized 
  clientData={clientData}
  dynamicFields={dynamicFields}
  context="details"
/>

// No formulário de edição
<ClientInfoStandardized 
  clientData={clientData}
  dynamicFields={dynamicFields}
  context="edit"
  onFieldUpdate={handleFieldUpdate}
/>
```

### Plano de Migração

1. **Fase 1**: Implementar o componente padronizado na tela de chat
   - Substituir o `ClientInfoTabs` pelo `ClientInfoStandardized`

2. **Fase 2**: Implementar na tela de detalhes do cliente
   - Substituir o `ClientDetailSheet` pelo `ClientInfoStandardized`

3. **Fase 3**: Implementar na tabela de clientes
   - Adicionar visualização compacta usando `ClientInfoStandardized`

4. **Fase 4**: Implementar nos formulários de edição e criação
   - Adaptar os formulários para usar o componente padronizado

## Benefícios da Padronização

- **Consistência visual**: Mesma organização e terminologia em todas as telas
- **Facilidade de manutenção**: Alterações em um único componente refletem em toda a aplicação
- **Melhor experiência do usuário**: Familiaridade com a interface em diferentes contextos
- **Desenvolvimento mais rápido**: Reutilização de componentes reduz tempo de desenvolvimento
- **Facilidade de treinamento**: Usuários aprendem uma única interface

## Próximos Passos

- Implementar testes automatizados para o componente padronizado
- Criar documentação visual (Storybook) para os componentes
- Desenvolver variações adicionais para contextos específicos
- Implementar feedback dos usuários para melhorias contínuas