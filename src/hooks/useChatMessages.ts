
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, N8nChatHistory } from '@/types/chat';
import { parseMessage } from '@/utils/chatUtils';
import { fetchChatHistory, subscribeToChat } from '@/lib/chatService';
import { logger } from '@/utils/logger';

export function useChatMessages(selectedChat: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoading(true);
      logger.debug(`Fetching messages for conversation: ${conversationId}`);

      const historyData = await fetchChatHistory(conversationId);

      const allMessages = historyData.flatMap(parseMessage);

      setMessages(allMessages);
      logger.debug("Fetched and processed messages:", allMessages.length);
    } catch (error) {
      logger.error('Error fetching messages:', error);
      toast({
        title: "Erro ao carregar mensagens",
        description: "Ocorreu um erro ao carregar as mensagens.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Set up subscription for real-time message updates for the current chat
  useEffect(() => {
    if (!selectedChat) return;

    logger.debug(`Setting up realtime listener for chat: ${selectedChat}`);

    const subscription = subscribeToChat(selectedChat, (chatHistory: N8nChatHistory) => {
      const newMessages = parseMessage(chatHistory);
      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
      }
    });

    return () => {
      logger.debug(`Cleaning up realtime subscription for chat: ${selectedChat}`);
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
    logger.debug("Adding new message to local state:", message);
    setMessages(currentMessages => [...currentMessages, message]);
  };

  return { messages, loading, handleNewMessage, fetchMessages };
}
