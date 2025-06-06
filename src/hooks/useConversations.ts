
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
      console.log(`Updating last message for session: ${sessionId}`);
      
      const { data: historyData, error: historyError } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', sessionId)
        .order('id', { ascending: false })
        .limit(1);
      
      if (historyError) {
        console.error('Error fetching chat history for update:', historyError);
        throw historyError;
      }
      
      console.log(`Found ${historyData?.length || 0} history records for session ${sessionId}`);
      
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
      console.log('Starting to fetch conversations...');
      
      // First, get all unique session IDs from chat histories
      const { data: chatHistoryData, error: chatHistoryError } = await supabase
        .from('n8n_chat_histories')
        .select('session_id')
        .order('id', { ascending: false });
      
      if (chatHistoryError) {
        console.error('Error fetching chat history session IDs:', chatHistoryError);
        throw chatHistoryError;
      }
      
      console.log(`Found ${chatHistoryData?.length || 0} chat history records`);
      
      if (!chatHistoryData || chatHistoryData.length === 0) {
        console.log('No chat history found, setting empty conversations');
        setConversations([]);
        setLoading(false);
        return;
      }
      
      // Get unique session IDs
      const uniqueSessionIds = Array.from(new Set(
        chatHistoryData.map(item => item.session_id).filter(id => id && id.trim() !== '')
      ));
      
      console.log(`Found ${uniqueSessionIds.length} unique session IDs:`, uniqueSessionIds);
      
      if (uniqueSessionIds.length === 0) {
        console.log('No valid session IDs found');
        setConversations([]);
        setLoading(false);
        return;
      }
      
      // Try to get client data for these session IDs
      const { data: clientsData, error: clientsError } = await supabase
        .from('dados_cliente')
        .select('*')
        .in('sessionid', uniqueSessionIds)
        .not('telefone', 'is', null);
      
      if (clientsError) {
        console.error('Error fetching clients data:', clientsError);
        // Don't throw error here, continue with empty client data
      }
      
      console.log(`Found ${clientsData?.length || 0} clients with session IDs`);
      
      // Create conversations array - if no client data, create conversations with session IDs only
      let conversationsData: Conversation[] = [];
      
      if (clientsData && clientsData.length > 0) {
        // Create conversations from client data
        conversationsData = clientsData.map((client: Client) => {
          return {
            id: client.sessionid,
            name: client.nome || 'Cliente sem nome',
            lastMessage: 'Carregando...',
            time: 'Recente',
            unread: 0,
            avatar: '👤',
            phone: client.telefone || 'Sem telefone',
            email: client.email || 'Sem email',
            clientName: client.nome_cliente || 'Não informado',
            clientSize: client.tamanho_cliente || 'Não informado',
            clientType: client.tipo_cliente || 'Não informado',
            sessionId: client.sessionid
          };
        });
      } else {
        // Create conversations from session IDs only (fallback)
        console.log('Creating conversations from session IDs as fallback');
        conversationsData = uniqueSessionIds.map((sessionId, index) => ({
          id: sessionId,
          name: `Conversa ${index + 1}`,
          lastMessage: 'Carregando...',
          time: 'Recente',
          unread: 0,
          avatar: '👤',
          phone: 'Não informado',
          email: 'Não informado',
          clientName: 'Não informado',
          clientSize: 'Não informado',
          clientType: 'Não informado',
          sessionId: sessionId
        }));
      }
      
      console.log(`Created ${conversationsData.length} conversations`);
      
      // Fetch last message for each conversation
      for (const conversation of conversationsData) {
        console.log(`Fetching last message for session: ${conversation.sessionId}`);
        
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
                } else if (jsonMessage.content) {
                  lastMessageContent = jsonMessage.content;
                }
              } catch (e) {
                lastMessageContent = chatHistory.message.substring(0, 100) + '...';
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
          
          console.log(`Updated conversation ${conversation.sessionId} with message: ${lastMessageContent.substring(0, 50)}...`);
        } else {
          console.log(`No history found for session: ${conversation.sessionId}`);
        }
      }
      
      console.log(`Final conversations count: ${conversationsData.length}`);
      setConversations(conversationsData);
      
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Erro ao carregar conversas",
        description: "Ocorreu um erro ao carregar as conversas. Tentando novamente...",
        variant: "destructive"
      });
      
      // Set empty array as fallback
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    console.log('useConversations: Initial fetch triggered');
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
