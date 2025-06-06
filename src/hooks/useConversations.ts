
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
      
      // Buscar sessions únicos do chat
      const { data: chatHistoryData, error: chatHistoryError } = await supabase
        .from('n8n_chat_histories')
        .select('session_id')
        .order('id', { ascending: false });
      
      if (chatHistoryError) {
        console.error('Error fetching chat history:', chatHistoryError);
        throw chatHistoryError;
      }
      
      if (!chatHistoryData || chatHistoryData.length === 0) {
        console.log('No chat history found');
        setConversations([]);
        setLoading(false);
        return;
      }
      
      const uniqueSessionIds = Array.from(new Set(
        chatHistoryData.map(item => item.session_id)
      ));
      
      console.log(`Found ${uniqueSessionIds.length} unique sessions:`, uniqueSessionIds);
      
      // Buscar clientes que correspondem aos session IDs
      const { data: clientsData, error: clientsError } = await supabase
        .from('dados_cliente')
        .select('*')
        .in('sessionid', uniqueSessionIds);
      
      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        // Não lançar erro aqui, continuar com dados temporários
      }
      
      console.log(`Found ${clientsData?.length || 0} clients with session data`);
      console.log('Clients data:', clientsData);
      
      let conversationsData: Conversation[] = [];
      
      if (clientsData && clientsData.length > 0) {
        // Usar dados reais dos clientes
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
            clientName: client.nome_cliente || 'Não informado',
            clientSize: client.tamanho_cliente || 'Não informado',
            clientType: client.tipo_cliente || 'Não informado',
            sessionId: client.sessionid
          };
        });
      } else {
        // Se não encontrarmos clientes com sessionid, criar conversas temporárias
        console.log('Creating temporary conversations from session IDs');
        conversationsData = uniqueSessionIds.slice(0, 10).map((sessionId, index) => {
          return {
            id: sessionId,
            name: `Cliente ${sessionId.slice(-6)}`,
            lastMessage: 'Carregando...',
            time: 'Recente',
            unread: Math.floor(Math.random() * 3),
            avatar: '👤',
            phone: `+55 11 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
            email: `cliente${index + 1}@email.com`,
            clientName: `Cliente ${index + 1}`,
            clientSize: ['Pequeno', 'Médio', 'Grande'][Math.floor(Math.random() * 3)],
            clientType: ['Pessoa Física', 'Pessoa Jurídica'][Math.floor(Math.random() * 2)],
            sessionId: sessionId
          };
        });
      }
      
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
            
            const messageDate = chatHistory.hora 
              ? new Date(chatHistory.hora) 
              : chatHistory.data 
                ? new Date(chatHistory.data) 
                : new Date();
            
            conversation.time = formatMessageTime(messageDate);
          }
        } catch (error) {
          console.error(`Error fetching last message for conversation ${conversation.sessionId}:`, error);
          // Continuar com dados padrão se houver erro
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
      // Em caso de erro, definir array vazio
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
