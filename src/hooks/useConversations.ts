
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Conversation, N8nChatHistory, Client } from '@/types/chat';
import { formatMessageTime } from '@/utils/chatUtils';

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
      console.log('Fetching conversations from database...');
      
      // Buscar clientes com sessionid
      const { data: clientsData, error: clientsError } = await supabase
        .from('dados_cliente')
        .select('*')
        .not('sessionid', 'is', null);
      
      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        throw clientsError;
      }
      
      console.log(`Found ${clientsData?.length || 0} clients with session data`);
      
      let conversationsData: Conversation[] = [];
      
      if (clientsData && clientsData.length > 0) {
        // Criar conversas a partir dos clientes
        conversationsData = clientsData.map((client: Client) => {
          return {
            id: client.sessionid,
            name: client.nome || 'Cliente sem nome',
            lastMessage: 'Carregando...',
            time: 'Recente',
            unread: 0,
            avatar: '👤',
            phone: client.telefone || 'Não informado',
            email: client.email || 'Sem email',
            address: 'Não informado',
            clientName: client.client_name || 'Não informado',
            clientSize: client.client_size || 'Não informado',
            clientType: client.client_type || 'Não informado',
            sessionId: client.sessionid
          };
        });
        
        // Buscar última mensagem para cada conversa
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
              if (chatHistory.message && typeof chatHistory.message === 'object') {
                if (chatHistory.message.content) {
                  lastMessageContent = chatHistory.message.content;
                }
              }
              
              conversation.lastMessage = lastMessageContent || 'Sem mensagem';
              
              const messageDate = chatHistory.hora 
                ? new Date(chatHistory.hora) 
                : chatHistory.data 
                  ? new Date(chatHistory.data) 
                  : new Date();
              
              conversation.time = formatMessageTime(messageDate);
            }
          } catch (error) {
            console.error(`Error fetching last message for conversation ${conversation.sessionId}:`, error);
          }
        }
      }
      
      console.log(`Successfully created ${conversationsData.length} conversations`);
      setConversations(conversationsData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Erro ao carregar conversas",
        description: "Ocorreu um erro ao carregar as conversas.",
        variant: "destructive"
      });
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    console.log('useConversations: Initial data fetch');
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
