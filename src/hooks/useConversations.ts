
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
      console.log('🔍 Iniciando busca por conversas...');
      
      // Primeiro, buscar todos os sessionIds únicos da tabela n8n_chat_histories
      const { data: historyData, error: historyError } = await supabase
        .from('n8n_chat_histories')
        .select('session_id')
        .order('id', { ascending: false });
      
      if (historyError) {
        console.error('❌ Erro ao buscar histórico de chat:', historyError);
        throw historyError;
      }
      
      console.log('📊 Dados do histórico encontrados:', historyData?.length || 0, 'registros');
      
      if (!historyData || historyData.length === 0) {
        console.log('⚠️ Nenhum histórico de chat encontrado');
        setConversations([]);
        return;
      }
      
      // Extrair sessionIds únicos
      const uniqueSessionIds = Array.from(new Set(
        historyData.map(item => item.session_id).filter(Boolean)
      ));
      
      console.log('🔑 SessionIds únicos encontrados:', uniqueSessionIds.length, uniqueSessionIds);
      
      if (uniqueSessionIds.length === 0) {
        console.log('⚠️ Nenhum sessionId válido encontrado');
        setConversations([]);
        return;
      }
      
      // Buscar clientes correspondentes aos sessionIds
      const { data: clientsData, error: clientsError } = await supabase
        .from('dados_cliente')
        .select('*')
        .in('sessionid', uniqueSessionIds);
      
      if (clientsError) {
        console.error('❌ Erro ao buscar clientes:', clientsError);
        throw clientsError;
      }
      
      console.log('👥 Clientes encontrados:', clientsData?.length || 0);
      console.log('📋 Dados dos clientes:', clientsData);
      
      if (!clientsData || clientsData.length === 0) {
        console.log('⚠️ Nenhum cliente encontrado para os sessionIds');
        setConversations([]);
        return;
      }
      
      // Criar conversas a partir dos clientes
      const conversationsData: Conversation[] = clientsData.map((client: Client) => {
        console.log('🏗️ Criando conversa para cliente:', client.nome, 'SessionId:', client.sessionid);
        return {
          id: client.sessionid,
          name: client.nome || 'Cliente sem nome',
          lastMessage: 'Carregando última mensagem...',
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
      
      console.log('✅ Conversas criadas:', conversationsData.length);
      
      // Buscar última mensagem para cada conversa
      for (const conversation of conversationsData) {
        try {
          console.log('📨 Buscando última mensagem para:', conversation.name, 'SessionId:', conversation.sessionId);
          
          const { data: lastMessageData, error: messageError } = await supabase
            .from('n8n_chat_histories')
            .select('*')
            .eq('session_id', conversation.sessionId)
            .order('id', { ascending: false })
            .limit(1);
          
          if (!messageError && lastMessageData && lastMessageData.length > 0) {
            const chatHistory = lastMessageData[0] as N8nChatHistory;
            console.log('💬 Última mensagem encontrada:', chatHistory);
            
            let lastMessageContent = 'Sem mensagem';
            if (chatHistory.message) {
              if (typeof chatHistory.message === 'object' && chatHistory.message.content) {
                lastMessageContent = chatHistory.message.content;
              } else if (typeof chatHistory.message === 'string') {
                try {
                  const parsed = JSON.parse(chatHistory.message);
                  if (parsed.content) {
                    lastMessageContent = parsed.content;
                  }
                } catch (e) {
                  lastMessageContent = chatHistory.message;
                }
              }
            }
            
            conversation.lastMessage = lastMessageContent;
            
            const messageDate = chatHistory.hora 
              ? new Date(chatHistory.hora) 
              : chatHistory.data 
                ? new Date(chatHistory.data) 
                : new Date();
            
            conversation.time = formatMessageTime(messageDate);
            console.log('⏰ Horário formatado:', conversation.time);
          } else {
            console.log('⚠️ Nenhuma mensagem encontrada para:', conversation.name);
          }
        } catch (error) {
          console.error('❌ Erro ao buscar última mensagem:', error);
        }
      }
      
      console.log('🎉 Conversas finais:', conversationsData);
      setConversations(conversationsData);
      
    } catch (error) {
      console.error('❌ Erro geral ao buscar conversas:', error);
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
