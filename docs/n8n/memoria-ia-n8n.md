# Integração de Memória da IA com n8n

Este documento descreve como uma IA hospedada no n8n pode interagir com o sistema de memória implementado no banco de dados Supabase.

## Visão Geral

O sistema de memória foi projetado para permitir que a IA armazenada no n8n possa:

1. Ler e escrever diferentes tipos de memória (contextual, semântica, episódica)
2. Gerenciar diferentes níveis de memória (curto, médio e longo prazo)
3. Atribuir importância às memórias
4. Armazenar entidades e relacionamentos
5. Manter contexto entre interações

## Estrutura da Tabela

A tabela `n8n_chat_memory` foi criada para consolidar as tabelas anteriores e adicionar suporte para os novos tipos de memória:

```sql
CREATE TABLE n8n_chat_memory (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  message JSONB NOT NULL,
  data TEXT,
  hora TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Novos campos para suportar diferentes tipos de memória
  memory_type TEXT, -- 'contextual', 'semantic', 'episodic'
  memory_level TEXT, -- 'short_term', 'medium_term', 'long_term'
  expiration_date TIMESTAMP WITH TIME ZONE,
  importance INTEGER,
  entities JSONB,
  relationships JSONB,
  context JSONB,
  metadata JSONB
);
```

## Exemplos de Workflows n8n

### 1. Leitura de Memória Contextual

Este exemplo mostra como um workflow do n8n pode ler a memória contextual para uma sessão específica:

```javascript
// Código para um nó Function no n8n

// Entrada esperada: { sessionId: "abc123" }
const sessionId = $input.item.json.sessionId;

// Consultar memória contextual
const response = await $node["Supabase"].query({
  sql: `
    SELECT * FROM n8n_chat_memory
    WHERE session_id = '${sessionId}'
    AND memory_type = 'contextual'
    ORDER BY created_at DESC
    LIMIT 10
  `,
});

// Processar resultados
const memories = response.map((memory) => {
  // Extrair conteúdo da mensagem
  let content = "";
  if (typeof memory.message === "string") {
    try {
      content = JSON.parse(memory.message).content || "";
    } catch (e) {
      content = memory.message;
    }
  } else if (memory.message && memory.message.content) {
    content = memory.message.content;
  }

  return {
    id: memory.id,
    content,
    timestamp: memory.created_at || memory.hora || memory.data,
    importance: memory.importance || 1,
  };
});

// Retornar memórias processadas
return { memories };
```

### 2. Escrita de Memória Semântica

Este exemplo mostra como um workflow do n8n pode escrever uma memória semântica com entidades:

```javascript
// Código para um nó Function no n8n

// Entrada esperada: { sessionId: "abc123", message: "...", entities: [...] }
const { sessionId, message, entities } = $input.item.json;

// Preparar objeto de memória
const memoryObject = {
  session_id: sessionId,
  message: { content: message, type: "assistant" },
  created_at: new Date().toISOString(),
  memory_type: "semantic",
  memory_level: "long_term",
  importance: 7,
  entities: entities || [],
  metadata: {
    tags: ["knowledge_base", "user_preference"],
  },
};

// Inserir na tabela de memória
const response = await $node["Supabase"].insert({
  table: "n8n_chat_memory",
  objects: [memoryObject],
});

return { success: true, memoryId: response[0].id };
```

### 3. Recuperação de Memória por Entidade

Este exemplo mostra como um workflow do n8n pode recuperar memórias relacionadas a uma entidade específica:

```javascript
// Código para um nó Function no n8n

// Entrada esperada: { sessionId: "abc123", entityName: "Empresa XYZ" }
const { sessionId, entityName } = $input.item.json;

// Consultar memórias que mencionam a entidade
const response = await $node["Supabase"].query({
  sql: `
    SELECT * FROM n8n_chat_memory
    WHERE session_id = '${sessionId}'
    AND entities::text ILIKE '%${entityName}%'
    ORDER BY importance DESC, created_at DESC
    LIMIT 5
  `,
});

// Processar e retornar resultados
return {
  entityMemories: response,
  count: response.length,
};
```

### 4. Atualização de Importância de Memória

Este exemplo mostra como um workflow do n8n pode atualizar a importância de uma memória existente:

```javascript
// Código para um nó Function no n8n

// Entrada esperada: { memoryId: 123, importance: 9 }
const { memoryId, importance } = $input.item.json;

// Atualizar importância
const response = await $node["Supabase"].update({
  table: "n8n_chat_memory",
  id: memoryId,
  data: { importance },
});

return {
  success: true,
  updatedMemory: response,
};
```

### 5. Limpeza de Memórias Expiradas

Este exemplo mostra como um workflow do n8n pode limpar memórias expiradas:

```javascript
// Código para um nó Function no n8n

// Obter data atual
const now = new Date().toISOString();

// Remover memórias expiradas
const response = await $node["Supabase"].query({
  sql: `
    DELETE FROM n8n_chat_memory
    WHERE expiration_date IS NOT NULL
    AND expiration_date < '${now}'
    RETURNING id
  `,
});

return {
  success: true,
  removedCount: response.length,
  removedIds: response.map((r) => r.id),
};
```

## Recomendações para Implementação no n8n

1. **Criar Workflows Dedicados**: Desenvolva workflows específicos para cada tipo de operação de memória (leitura, escrita, atualização, limpeza).

2. **Usar Triggers HTTP**: Configure triggers HTTP para permitir que a aplicação web chame os workflows de memória.

3. **Implementar Filas**: Para operações assíncronas, considere implementar filas usando o n8n para processar operações de memória em segundo plano.

4. **Configurar Credenciais**: Armazene as credenciais do Supabase de forma segura no n8n usando o gerenciador de credenciais.

5. **Monitorar Desempenho**: Configure alertas para monitorar o desempenho dos workflows de memória e identificar possíveis gargalos.

## Próximos Passos

1. Implementar workflows básicos de CRUD para memória no n8n
2. Desenvolver um workflow para processamento de linguagem natural que extraia entidades e relacionamentos
3. Criar um workflow para gerenciamento automático de níveis de memória (promoção/rebaixamento)
4. Implementar um sistema de cache para melhorar o desempenho de consultas frequentes
5. Desenvolver métricas e dashboards para monitorar o uso da memória

## Conclusão

A nova estrutura de memória permite que a IA no n8n tenha acesso a diferentes tipos e níveis de memória, melhorando significativamente sua capacidade de manter contexto e personalizar interações com os usuários. A implementação dos workflows sugeridos permitirá que a IA utilize efetivamente esses recursos de memória.
