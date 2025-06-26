# Arquitetura da Integração n8n para Memória e Customização da IA

## Visão Geral

Este documento descreve a arquitetura atual do sistema de memória e customização da IA integrado com o n8n. O sistema foi projetado para permitir a personalização do comportamento da IA, gerenciamento de fluxos de conversação e armazenamento de histórico de interações.

## Componentes Principais

### 1. Interface de Gerenciamento de Conhecimento

A interface principal é implementada através do componente `KnowledgeManager.tsx`, que serve como hub central para todas as funcionalidades relacionadas à IA. Esta interface é organizada em abas temáticas:

- **Personalidade da IA**: Configuração de características comportamentais
- **Etapas de Conversação**: Definição do fluxo de diálogo
- **Mensagens Padronizadas**: Templates para diferentes situações
- **Ambiente de Teste**: Simulação de interações com a IA

### 2. Modelo de Dados

O sistema utiliza as seguintes estruturas de dados principais:

#### 2.1 N8nChatHistory

```typescript
export interface N8nChatHistory {
  id: number;
  session_id: string;
  message: any;
  data?: string;
  hora?: string;
}
```

Esta interface representa o histórico de chat armazenado no n8n, contendo:

- Identificador único
- ID da sessão para agrupar mensagens
- Conteúdo da mensagem (formato flexível)
- Informações temporais (data e hora)

#### 2.2 Personalidade da IA

```typescript
interface PersonalitySettings {
  name: string;
  description: string;
  tone: string;
  personality: string;
  formality: number;
  empathy: number;
  creativity: number;
  directness: number;
  greeting: string;
  farewell: string;
  specialInstructions: string;
  maxResponses: number;
  messageSize: number;
  responseTime: number;
  audioResponse: boolean;
  responseCreativity: number;
}
```

Esta estrutura define as características comportamentais da IA, incluindo tom, estilo de comunicação e parâmetros operacionais.

#### 2.3 Etapas de Conversação

```typescript
interface AIStage {
  id: number;
  name: string;
  description: string;
  trigger: string;
  actions: string;
  nextStage: string;
  isActive: boolean;
}
```

Esta estrutura define as etapas do fluxo de conversação, com gatilhos, ações e transições.

#### 2.4 Mensagens Padronizadas

```typescript
interface AIMessage {
  id: number;
  category: string;
  name: string;
  content: string;
  variables: string[];
  context: string;
  isActive: boolean;
}
```

Esta estrutura define templates de mensagens categorizados, com suporte a variáveis dinâmicas.

### 3. Integração com n8n

A integração com o n8n é realizada através dos seguintes componentes:

#### 3.1 Serviço de Chat

O arquivo `chatService.ts` contém funções para interagir com o histórico de chat armazenado no n8n:

```typescript
export async function fetchChatHistory(conversationId: string) {
  // Implementação para buscar histórico do n8n
}

export function subscribeToChat(
  conversationId: string,
  onInsert: (chatHistory: N8nChatHistory) => void,
) {
  // Implementação para assinatura em tempo real
}
```

#### 3.2 Formatação de Dados

O arquivo `dateUtils.ts` contém funções para formatar datas para a API do n8n:

```typescript
export const formatDateForN8NApi = (date: Date, isEndOfDay = false): string => {
  // Implementação para formatar datas no padrão esperado pelo n8n
};
```

#### 3.3 Processamento de Mensagens

O arquivo `chatUtils.ts` contém funções para processar mensagens do n8n:

```typescript
export const parseMessage = (chatHistory: N8nChatHistory): ChatMessage[] => {
  // Implementação para converter mensagens do formato n8n para o formato interno
};
```

## Fluxo de Dados

1. **Configuração da IA**: Os usuários configuram a personalidade, etapas e mensagens através da interface de gerenciamento.

2. **Armazenamento de Configurações**: As configurações são armazenadas no n8n para uso posterior.

3. **Interação com Usuários**: Quando um usuário interage com a IA, o sistema:

   - Recupera as configurações relevantes
   - Identifica a etapa atual da conversação
   - Seleciona mensagens apropriadas com base no contexto
   - Aplica características de personalidade à resposta

4. **Armazenamento de Histórico**: As interações são armazenadas como registros `N8nChatHistory` para referência futura.

## Estado Atual da Implementação

Atualmente, o sistema está parcialmente implementado, com algumas limitações:

1. **Dados Mockup**: Muitas partes do código estão configuradas para usar dados mockup em vez de integração real com o n8n.

2. **Funcionalidades Desativadas**: Algumas funcionalidades de integração com o n8n estão comentadas ou desativadas no código.

3. **Tabelas no Banco de Dados**: O sistema faz referência a tabelas como `n8n_chat_histories` que devem existir no banco de dados para funcionamento completo.

## Próximos Passos para Implementação Completa

1. Ativar a integração real com o n8n, removendo o uso de dados mockup.

2. Implementar a persistência completa das configurações de IA no n8n.

3. Desenvolver workflows no n8n para processamento de mensagens e aplicação de regras de conversação.

4. Implementar mecanismos de sincronização em tempo real entre a interface e o n8n.

---

_Este documento representa o estado atual da arquitetura e pode ser atualizado conforme o sistema evolui._
