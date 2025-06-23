import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Conversation, N8nChatHistory } from '@/types/chat';
import { formatMessageTime } from '@/utils/chatUtils';

interface DatabaseClient {
  asaas_customer_id: string | null;
  client_name: string | null;
  client_size: string | null;
  client_type: string | null;
  cpf_cnpj: string | null;
  created_at: string;
  email: string | null;
  id: number;
  kanban_stage: string | null;
  nome: string | null;
  nome_pet: string | null;
  payments: any;
  porte_pet: string | null;
  raca_pet: string | null;
  sessionid: string;
  telefone: string | null;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const updateConversationLastMessage = async (sessionId: string) => {
    try {
      const { data: historyData, error: historyError } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', sessionId)
        .order('id', { ascending: false })
        .limit(1);
      
      if (historyError) throw historyError;
      
      if (historyData && historyData.length > 0) {
        const chatHistory = historyData[0] as N8nChatHistory;
        
        setConversations(currentConversations => {
          return currentConversations.map(conv => {
            if (conv.id === sessionId) {
              let lastMessageContent = 'Sem mensagem';
              if (chatHistory.message) {
                if (typeof chatHistory.message === 'string') {
                  try {
                    const jsonMessage = JSON.parse(chatHistory.message);
                    if (jsonMessage.type && jsonMessage.content) {
                      lastMessageContent = jsonMessage.content;
                    }
                  } catch (e) {
                    lastMessageContent = chatHistory.message;
                  }
                } else if (typeof chatHistory.message === 'object') {
                  if (chatHistory.message.content) {
                    lastMessageContent = chatHistory.message.content;
                  } else if (chatHistory.message.messages && Array.isArray(chatHistory.message.messages)) {
                    const lastMsg = chatHistory.message.messages[chatHistory.message.messages.length - 1];
                    lastMessageContent = lastMsg?.content || 'Sem mensagem';
                  } else if (chatHistory.message.type && chatHistory.message.content) {
                    lastMessageContent = chatHistory.message.content;
                  }
                }
              }
              
              // Use hora field if available, otherwise fall back to data field
              const messageDate = chatHistory.hora 
                ? new Date(chatHistory.hora) 
                : chatHistory.data 
                  ? new Date(chatHistory.data) 
                  : new Date();
                
              return {
                ...conv,
                lastMessage: lastMessageContent || 'Sem mensagem',
                time: formatMessageTime(messageDate),
                unread: conv.unread + 1
              };
            }
            return conv;
          });
        });
      }
    } catch (error) {
      console.error('Error updating conversation last message:', error);
    }
  };

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Iniciando busca otimizada por conversas...');

      const { data: sessionData, error: sessionError } = await supabase
        .from('n8n_chat_histories')
        .select('session_id')
        .not('session_id', 'is', null);

      if (sessionError) throw sessionError;
      if (!sessionData || sessionData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const uniqueSessionIds = Array.from(new Set(sessionData.map(item => item.session_id)));
      if (uniqueSessionIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      console.log(`🔑 Encontrados ${uniqueSessionIds.length} IDs de sessão únicos. Buscando dados...`);

      const { data: clientsData, error: clientsError } = await supabase
        .from('dados_cliente')
        .select('*')
        .in('sessionid', uniqueSessionIds);

      if (clientsError) throw clientsError;
      if (!clientsData || clientsData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      console.log(`👥 ${clientsData.length} clientes encontrados.`);

      const conversationsData: Conversation[] = clientsData.map((client: DatabaseClient) => {
        return {
          id: client.sessionid,
          name: client.nome || 'Cliente sem nome',
          lastMessage: 'Carregando mensagem...',
          time: '...',
          unread: 0,
          avatar: '👤',
          phone: client.telefone || 'Não informado',
          email: client.email || 'Sem email',
          address: 'Não informado',
          clientName: client.client_name || 'Não informado',
          clientSize: client.client_size || 'Não informado',
          clientType: client.client_type || 'Não informado',
          sessionId: client.sessionid,
        };
      });

      // Fetch latest messages for each conversation
      for (const conversation of conversationsData) {
        try {
          const { data: historyData, error: historyError } = await supabase
            .from('n8n_chat_histories')
            .select('*')
            .eq('session_id', conversation.sessionId)
            .order('id', { ascending: false })
            .limit(1);
          
          if (!historyError && historyData && historyData.length > 0) {
            const chatHistory = historyData[0] as N8nChatHistory;
            
            let lastMessageContent = 'Sem mensagem';
            if (chatHistory.message) {
              if (typeof chatHistory.message === 'string') {
                try {
                  const jsonMessage = JSON.parse(chatHistory.message);
                  if (jsonMessage.type && jsonMessage.content) {
                    lastMessageContent = jsonMessage.content;
                  }
                } catch (e) {
                  lastMessageContent = chatHistory.message;
                }
              } else if (typeof chatHistory.message === 'object') {
                if (chatHistory.message.content) {
                  lastMessageContent = chatHistory.message.content;
                } else if (chatHistory.message.messages && Array.isArray(chatHistory.message.messages)) {
                  const lastMsg = chatHistory.message.messages[chatHistory.message.messages.length - 1];
                  lastMessageContent = lastMsg?.content || 'Sem mensagem';
                } else if (chatHistory.message.type && chatHistory.message.content) {
                  lastMessageContent = chatHistory.message.content;
                }
              }
            }
            
            conversation.lastMessage = lastMessageContent || 'Sem mensagem';
            
            // Use hora field if available, otherwise fall back to data field
            const messageDate = chatHistory.hora 
              ? new Date(chatHistory.hora) 
              : chatHistory.data 
                ? new Date(chatHistory.data) 
                : new Date();
            
            conversation.time = formatMessageTime(messageDate);
          }
        } catch (error) {
          console.error(`Error fetching messages for session ${conversation.sessionId}:`, error);
          conversation.lastMessage = 'Erro ao carregar mensagem';
          conversation.time = 'Erro';
        }
      }
      
      console.log('🎉 Conversas finais montadas:', conversationsData.length);
      setConversations(conversationsData);

    } catch (error) {
      console.error('❌ Erro geral ao buscar conversas:', error);
      toast({
        title: "Erro ao carregar conversas",
        description: "Ocorreu um erro ao carregar as conversas. A busca foi otimizada para melhor performance.",
        variant: "destructive"
      });
      setConversations([]);
    } finally {
      setLoading(false);
      console.log('🏁 Busca de conversas finalizada.');
    }
  }, [toast]);

  useEffect(() => {
    console.log('🚀 useConversations: Iniciando carregamento inicial');
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    setConversations,
    loading,
    updateConversationLastMessage,
    fetchConversations
  };
}
