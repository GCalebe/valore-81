
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Conversation } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { useThemeSettings } from '@/context/ThemeSettingsContext';

interface MessageInputProps {
  selectedChat: string | null;
  selectedConversation?: Conversation;
}

const MessageInput = ({ selectedChat, selectedConversation }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { settings } = useThemeSettings();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !selectedConversation?.phone) return;
    
    try {
      setIsSending(true);
      
      const response = await fetch('https://webhook.n8nlabz.com.br/webhook/envia_mensagem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          phoneNumber: selectedConversation.phone,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao enviar mensagem');
      }
      
      setNewMessage('');
      
      toast({
        title: 'Mensagem navegou com sucesso',
        description: 'Sua mensagem foi enviada pelas águas digitais.',
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro na navegação',
        description: 'Não foi possível enviar sua mensagem. Tente navegar novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Digite sua mensagem para navegar..."
          className="flex-1"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="text-white"
          style={{ backgroundColor: settings.primaryColor }}
          disabled={isSending}
        >
          <Send size={18} />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
