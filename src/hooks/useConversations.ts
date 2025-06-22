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

      const [clientsResult, latestMessagesResult] = await Promise.all([
        supabase
          .from('dados_cliente')
          .select('*')
          .in('session_id', uniqueSessionIds),
        supabase
          .from('latest_chat_messages')
          .select('session_id, message, message_time')
          .in('session_id', uniqueSessionIds)
      ]);

      const { data: clientsData, error: clientsError } = clientsResult;
      const { data: latestMessagesData, error: latestMessagesError } = latestMessagesResult;

      if (clientsError) throw clientsError;
      if (latestMessagesError) throw latestMessagesError;
      if (!clientsData || clientsData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      console.log(`👥 ${clientsData.length} clientes e ${latestMessagesData?.length || 0} últimas mensagens encontradas.`);

      const lastMessagesMap = new Map(
        latestMessagesData?.map(msg => [msg.session_id, msg]) || []
      );

      const conversationsData: Conversation[] = clientsData.map((client: Client) => {
        const lastMessage = lastMessagesMap.get(client.session_id);
        let lastMessageContent = 'Nenhuma mensagem ainda';
        let messageTime = '...';

        if (lastMessage) {
          const msgData = lastMessage.message;
          if (msgData) {
            if (Array.isArray(msgData)) {
              lastMessageContent = 'Recebida uma lista de mensagens.';
            } else if (typeof msgData === 'object' && msgData !== null) {
              const anyMsgData = msgData as any;
              if (anyMsgData.content) {
                lastMessageContent = anyMsgData.content;
              } else if (anyMsgData.messages && Array.isArray(anyMsgData.messages) && anyMsgData.messages.length > 0) {
                const lastMsg = anyMsgData.messages[anyMsgData.messages.length - 1];
                lastMessageContent = lastMsg?.content || 'Mensagem sem conteúdo.';
              } else {
                lastMessageContent = 'Formato de mensagem desconhecido.';
              }
            } else if (typeof msgData === 'string') {
              try {
                const parsed = JSON.parse(msgData);
                lastMessageContent = parsed.content || msgData;
              } catch (e) {
                lastMessageContent = msgData;
              }
            } else {
              lastMessageContent = String(msgData);
            }
          }
          messageTime = formatMessageTime(new Date(lastMessage.message_time));
        }

        return {
          id: client.session_id,
          name: client.nome || 'Cliente sem nome',
          lastMessage: lastMessageContent,
          time: messageTime,
          unread: 0,
          avatar: '👤',
          phone: client.telefone || 'Não informado',
          email: client.email || 'Sem email',
          address: 'Não informado',
          clientName: client.client_name || 'Não informado',
          clientSize: client.client_size || 'Não informado',
          clientType: client.client_type || 'Não informado',
          sessionId: client.session_id,
        };
      });
      
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