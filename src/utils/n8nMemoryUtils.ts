/**
 * Utilitários para integração da memória com n8n
 * 
 * Este arquivo contém funções que ajudam a integrar o sistema de memória
 * com workflows do n8n, permitindo que a IA armazenada no n8n possa
 * ler e escrever nos novos campos de memória.
 */

import { N8nChatMemory, MemoryType, MemoryLevel, SemanticEntity, EntityRelationship } from '@/types/memory';

/**
 * Converte uma memória para o formato que pode ser facilmente processado pelo n8n
 * @param memory Objeto de memória do banco de dados
 * @returns Objeto formatado para uso no n8n
 */
export const formatMemoryForN8n = (memory: N8nChatMemory): Record<string, any> => {
  // Extrair o conteúdo da mensagem
  let messageContent = '';
  let messageType = '';
  
  if (typeof memory.message === 'string') {
    try {
      const parsed = JSON.parse(memory.message);
      messageContent = parsed.content || parsed.message || '';
      messageType = parsed.type || 'unknown';
    } catch (e) {
      messageContent = memory.message;
      messageType = 'unknown';
    }
  } else if (memory.message && typeof memory.message === 'object') {
    messageContent = memory.message.content || memory.message.message || '';
    messageType = memory.message.type || 'unknown';
  }

  // Formatar para n8n
  return {
    id: memory.id,
    sessionId: memory.session_id,
    message: {
      content: messageContent,
      type: messageType
    },
    timestamp: memory.created_at || memory.hora || memory.data || new Date().toISOString(),
    memoryType: memory.memory_type || 'contextual',
    memoryLevel: memory.memory_level || 'short_term',
    importance: memory.importance || 1,
    entities: memory.entities || [],
    relationships: memory.relationships || [],
    context: memory.context || {},
    metadata: memory.metadata || {}
  };
};

/**
 * Converte um objeto do n8n para o formato de memória do banco de dados
 * @param n8nObject Objeto recebido do n8n
 * @returns Objeto formatado para inserção no banco de dados
 */
export const formatN8nObjectToMemory = (n8nObject: Record<string, any>): Omit<N8nChatMemory, 'id'> => {
  // Verificar se o objeto tem a estrutura esperada
  if (!n8nObject.sessionId || !n8nObject.message) {
    throw new Error('Objeto n8n inválido: sessionId e message são obrigatórios');
  }

  // Formatar a mensagem
  let message: any;
  if (typeof n8nObject.message === 'string') {
    try {
      message = JSON.parse(n8nObject.message);
    } catch (e) {
      message = { content: n8nObject.message, type: 'text' };
    }
  } else {
    message = n8nObject.message;
  }

  // Criar objeto de memória
  return {
    session_id: n8nObject.sessionId,
    message,
    created_at: n8nObject.timestamp || new Date().toISOString(),
    memory_type: n8nObject.memoryType || 'contextual',
    memory_level: n8nObject.memoryLevel || 'short_term',
    importance: n8nObject.importance || 1,
    entities: n8nObject.entities || null,
    relationships: n8nObject.relationships || null,
    context: n8nObject.context || null,
    metadata: n8nObject.metadata || null,
    expiration_date: n8nObject.expirationDate || null
  };
};

/**
 * Extrai entidades de um texto usando processamento simples
 * Esta função pode ser substituída por uma chamada a um serviço de NLP mais avançado
 * @param text Texto para extrair entidades
 * @returns Lista de entidades encontradas
 */
export const extractEntitiesFromText = (text: string): SemanticEntity[] => {
  // Esta é uma implementação simplificada
  // Em produção, seria melhor usar um serviço de NLP como OpenAI, Google NLP, etc.
  const entities: SemanticEntity[] = [];
  
  // Exemplo: detectar nomes próprios (palavras capitalizadas)
  const words = text.split(/\s+/);
  const capitalizedWords = words.filter(word => 
    /^[A-Z][a-z]{2,}$/.test(word) && 
    !['Eu', 'Você', 'Ele', 'Ela', 'Nós', 'Eles', 'Elas'].includes(word)
  );
  
  // Adicionar entidades encontradas
  capitalizedWords.forEach(word => {
    entities.push({
      name: word,
      type: 'person', // Tipo padrão, em produção seria determinado por NLP
      confidence: 0.7
    });
  });
  
  return entities;
};

/**
 * Gera um resumo do contexto da conversa para uso pela IA
 * @param memories Lista de memórias para resumir
 * @param maxLength Tamanho máximo do resumo
 * @returns Resumo do contexto
 */
export const generateContextSummary = (memories: N8nChatMemory[], maxLength = 500): string => {
  if (!memories || memories.length === 0) {
    return '';
  }
  
  // Extrair conteúdo das mensagens
  const messageContents = memories.map(memory => {
    let content = '';
    
    if (typeof memory.message === 'string') {
      try {
        const parsed = JSON.parse(memory.message);
        content = parsed.content || parsed.message || '';
      } catch (e) {
        content = memory.message;
      }
    } else if (memory.message && typeof memory.message === 'object') {
      content = memory.message.content || memory.message.message || '';
    }
    
    return content;
  }).filter(content => content.length > 0);
  
  // Juntar mensagens e limitar tamanho
  let summary = messageContents.join(' ');
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength) + '...';
  }
  
  return summary;
};

/**
 * Prepara um objeto com o contexto completo para envio ao n8n
 * @param sessionId ID da sessão
 * @param memories Lista de memórias
 * @returns Objeto de contexto para n8n
 */
export const prepareContextForN8n = async (
  sessionId: string,
  memories: N8nChatMemory[]
): Promise<Record<string, any>> => {
  // Extrair entidades únicas de todas as memórias
  const allEntities: Record<string, SemanticEntity> = {};
  memories.forEach(memory => {
    if (memory.entities && Array.isArray(memory.entities)) {
      memory.entities.forEach(entity => {
        if (entity.name) {
          allEntities[entity.name] = entity;
        }
      });
    }
  });
  
  // Criar resumo do contexto
  const contextSummary = generateContextSummary(memories);
  
  // Formatar mensagens recentes
  const recentMessages = memories
    .slice(-5) // Últimas 5 mensagens
    .map(memory => formatMemoryForN8n(memory));
  
  // Retornar objeto de contexto
  return {
    sessionId,
    contextSummary,
    entities: Object.values(allEntities),
    recentMessages,
    timestamp: new Date().toISOString()
  };
};