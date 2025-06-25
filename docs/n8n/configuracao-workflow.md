# Configuração do Workflow de Memória no n8n

## Visão Geral

Este documento fornece instruções sobre como importar e configurar o workflow de exemplo para gerenciamento de memória da IA no n8n.

## Pré-requisitos

1. Instância do n8n em execução
2. Acesso ao banco de dados Supabase
3. Credenciais do Supabase configuradas no n8n

## Importando o Workflow

1. Acesse a interface do n8n
2. Clique em "Workflows" no menu lateral
3. Clique no botão "Import from File"
4. Selecione o arquivo `exemplo-workflow-memoria.json`
5. Clique em "Import"

## Configurando as Credenciais do Supabase

1. No workflow importado, clique em qualquer nó do Supabase
2. Na seção "Credentials", clique em "Create New"
3. Preencha os seguintes campos:
   - **Name**: Nome para identificar as credenciais (ex: "Supabase Produção")
   - **API Key**: Sua chave de API do Supabase (encontrada no painel do Supabase em "Settings" > "API")
   - **API URL**: URL da sua API do Supabase (encontrada no mesmo local)
4. Clique em "Save" para salvar as credenciais
5. Repita o processo para todos os nós do Supabase no workflow

## Testando o Workflow

O workflow fornece três endpoints HTTP que podem ser usados para interagir com o sistema de memória:

### 1. Consultar Memória

**Endpoint**: `POST /webhook/memoria/consultar`

**Payload de exemplo**:
```json
{
  "sessionId": "abc123",
  "memoryType": "contextual",
  "limit": 10
}
```

**Resposta esperada**:
```json
{
  "memories": [
    {
      "id": 1,
      "sessionId": "abc123",
      "content": "Conteúdo da mensagem",
      "type": "assistant",
      "timestamp": "2023-06-01T12:00:00Z",
      "memoryType": "contextual",
      "memoryLevel": "short_term",
      "importance": 5,
      "entities": [],
      "relationships": [],
      "context": {},
      "metadata": {}
    }
  ],
  "count": 1,
  "contextSummary": "Conteúdo da mensagem",
  "entities": []
}
```

### 2. Armazenar Memória

**Endpoint**: `POST /webhook/memoria/armazenar`

**Payload de exemplo**:
```json
{
  "sessionId": "abc123",
  "message": {
    "content": "Esta é uma mensagem de teste",
    "type": "assistant"
  },
  "memoryType": "contextual",
  "memoryLevel": "short_term",
  "importance": 5,
  "entities": [
    {
      "name": "Empresa XYZ",
      "type": "organization",
      "confidence": 0.9
    }
  ],
  "context": {
    "topic": "teste"
  },
  "metadata": {
    "tags": ["teste", "exemplo"]
  }
}
```

**Resposta esperada**:
```json
{
  "success": true,
  "memoryId": 123,
  "message": "Memória armazenada com sucesso"
}
```

### 3. Limpar Memórias Expiradas

**Endpoint**: `POST /webhook/memoria/limpar-expiradas`

**Payload**: Não é necessário payload

**Resposta esperada**:
```json
{
  "success": true,
  "removedCount": 5,
  "removedIds": [1, 2, 3, 4, 5]
}
```

## Integrando com a Aplicação

Para integrar o workflow com a aplicação, você precisará atualizar o arquivo `src/lib/chatService.ts` para chamar os endpoints do n8n em vez de interagir diretamente com o Supabase.

### Exemplo de Integração

```typescript
// Exemplo de como atualizar o chatService.ts para usar o n8n

import axios from 'axios';
import { N8nChatHistory } from '@/types/chat';

// URL base do n8n
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

// Endpoints do workflow
const ENDPOINTS = {
  CONSULTAR: `${N8N_BASE_URL}/webhook/memoria/consultar`,
  ARMAZENAR: `${N8N_BASE_URL}/webhook/memoria/armazenar`,
  LIMPAR: `${N8N_BASE_URL}/webhook/memoria/limpar-expiradas`
};

export async function fetchChatHistory(conversationId: string) {
  try {
    const response = await axios.post(ENDPOINTS.CONSULTAR, {
      sessionId: conversationId,
      memoryType: 'contextual'
    });
    
    // Converter para o formato N8nChatHistory
    return response.data.memories.map((memory: any) => ({
      id: memory.id,
      session_id: memory.sessionId,
      message: {
        content: memory.content,
        type: memory.type
      },
      data: memory.timestamp,
      hora: memory.timestamp
    })) as N8nChatHistory[];
  } catch (error) {
    console.error('Erro ao buscar histórico de chat:', error);
    return [] as N8nChatHistory[];
  }
}

export async function storeMessage(conversationId: string, message: any) {
  try {
    await axios.post(ENDPOINTS.ARMAZENAR, {
      sessionId: conversationId,
      message,
      memoryType: 'contextual',
      memoryLevel: 'short_term'
    });
    return true;
  } catch (error) {
    console.error('Erro ao armazenar mensagem:', error);
    return false;
  }
}
```

## Configurando Tarefas Agendadas

Para garantir que as memórias expiradas sejam removidas regularmente, você pode configurar uma tarefa agendada no n8n:

1. No n8n, crie um novo workflow
2. Adicione um nó "Cron" e configure-o para executar diariamente (ex: às 3h da manhã)
3. Adicione um nó "HTTP Request" com as seguintes configurações:
   - **Method**: POST
   - **URL**: `http://localhost:5678/webhook/memoria/limpar-expiradas` (ajuste conforme necessário)
4. Salve e ative o workflow

## Considerações de Segurança

1. **Proteção dos Endpoints**: Considere adicionar autenticação aos endpoints do webhook para evitar acesso não autorizado
2. **Armazenamento Seguro de Credenciais**: Certifique-se de que as credenciais do Supabase estão armazenadas de forma segura no n8n
3. **Validação de Entrada**: Adicione validação adicional nos nós de função para garantir que os dados recebidos são válidos

## Solução de Problemas

### Problema: Erro de Conexão com o Supabase

**Solução**: Verifique se as credenciais do Supabase estão corretas e se o banco de dados está acessível a partir do n8n.

### Problema: Webhook não está recebendo requisições

**Solução**: Verifique se o n8n está configurado corretamente para receber requisições HTTP externas. Pode ser necessário configurar o proxy reverso ou ajustar as configurações de rede.

### Problema: Erros nos nós de função

**Solução**: Verifique a sintaxe do código JavaScript nos nós de função. O n8n fornece um console de depuração que pode ajudar a identificar erros.

## Conclusão

O workflow de exemplo fornece uma base sólida para implementar o sistema de memória da IA no n8n. Ele pode ser estendido e personalizado conforme necessário para atender aos requisitos específicos do projeto.