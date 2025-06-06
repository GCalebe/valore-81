
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, N8nChatHistory } from '@/types/chat';
import { parseMessage } from '@/utils/chatUtils';

export function useChatMessages(selectedChat: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoading(true);
      console.log(`Fetching messages for conversation: ${conversationId}`);
      
      const { data: historyData, error: historyError } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', conversationId)
        .order('id', { ascending: true });
      
      if (historyError) {
        console.error('Error fetching chat history:', historyError);
        throw historyError;
      }
      
      console.log(`Fetched ${historyData?.length || 0} history records for conversation ${conversationId}`);
      
      let allMessages: ChatMessage[] = [];
      
      if (historyData && historyData.length > 0) {
        historyData.forEach((chatHistory: N8nChatHistory, index: number) => {
          console.log(`Processing message ${index + 1} with hora: ${chatHistory.hora}`);
          const parsedMessages = parseMessage(chatHistory);
          if (parsedMessages.length > 0) {
            allMessages = [...allMessages, ...parsedMessages];
          }
        });
        
        console.log(`Successfully processed ${allMessages.length} messages for conversation ${conversationId}`);
        setMessages(allMessages);
      } else {
        console.log(`No messages found for conversation ${conversationId}`);
        setMessages([]);
        
        // Show a friendly message that this is a new conversation
        toast({
          title: "Conversa sem mensagens",
          description: "Esta conversa ainda não possui mensagens.",
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
      toast({
        title: "Erro ao carregar mensagens",
        description: "Ocorreu um erro ao carregar as mensagens. Verifique sua conexão.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Set up subscription for real-time message updates for the current chat
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      setLoading(false);
      return;
    }
    
    console.log(`Setting up realtime listener for specific chat messages: ${selectedChat}`);
    
    const subscription = supabase
      .channel(`chat_messages_${selectedChat}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'n8n_chat_histories',
          filter: `session_id=eq.${selectedChat}`
        }, 
        (payload) => {
          console.log('New message received in current chat via realtime:', payload);
          
          // Process the new message
          const chatHistory = payload.new as N8nChatHistory;
          console.log('New message hora field:', chatHistory.hora);
          const newMessages = parseMessage(chatHistory);
          
          if (newMessages.length > 0) {
            console.log("Adding new messages from realtime:", newMessages);
            setMessages(prevMessages => [...prevMessages, ...newMessages]);
          }
        }
      )
      .subscribe();
    
    console.log(`Realtime subscription created for chat: ${selectedChat}`);
      
    return () => {
      console.log(`Cleaning up realtime subscription for chat: ${selectedChat}`);
      subscription.unsubscribe();
    };
  }, [selectedChat]);

  // Fetch messages when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [selectedChat, fetchMessages]);

  const handleNewMessage = (message: ChatMessage) => {
    console.log("Adding new message to local state:", message);
    setMessages(currentMessages => [...currentMessages, message]);
  };

  return { messages, loading, handleNewMessage, fetchMessages };
}
