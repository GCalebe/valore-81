
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PauseDurationDialog from '@/components/PauseDurationDialog';

interface ChatBotActionsProps {
  selectedPhoneNumber: string;
  selectedChat: string | null;
  isLoading: Record<string, boolean>;
  onStartBot: (phoneNumber: string, e: React.MouseEvent) => void;
  onPauseBot: (phoneNumber: string, e: React.MouseEvent) => void;
}

const ChatBotActions = ({ 
  selectedPhoneNumber, 
  selectedChat, 
  isLoading,
  onStartBot,
  onPauseBot
}: ChatBotActionsProps) => {
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const { toast } = useToast();

  const openPauseDialog = (phoneNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPauseDialogOpen(true);
  };

  const closePauseDialog = () => {
    setPauseDialogOpen(false);
  };

  const handlePauseBot = async (duration: number | null) => {
    try {
      const response = await fetch('https://webhook.comercial247.com.br/webhook/pausa_bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: selectedPhoneNumber,
          duration,
          unit: 'seconds'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao pausar o bot');
      }
      
      toast({
        title: "Bot pausado",
        description: duration ? `O bot foi pausado para ${selectedPhoneNumber} por ${duration} segundos` : `O bot não foi pausado para ${selectedPhoneNumber}`,
      });
      
      closePauseDialog();
    } catch (error) {
      console.error('Erro ao pausar bot:', error);
      toast({
        title: "Erro ao pausar bot",
        description: "Ocorreu um erro ao tentar pausar o bot.",
        variant: "destructive"
      });
    }
  };

  if (!selectedChat) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2 p-3 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={(e) => openPauseDialog(selectedPhoneNumber, e)}
          disabled={isLoading[`pause-${selectedPhoneNumber}`]}
          className="flex-1"
        >
          {isLoading[`pause-${selectedPhoneNumber}`] ? 'Pausando...' : 'Pausar Bot'}
        </Button>
        
        <Button
          variant="default"
          onClick={(e) => onStartBot(selectedPhoneNumber, e)}
          disabled={isLoading[`start-${selectedPhoneNumber}`]}
          className="flex-1"
        >
          {isLoading[`start-${selectedPhoneNumber}`] ? 'Iniciando...' : 'Iniciar Bot'}
        </Button>
      </div>

      <PauseDurationDialog 
        isOpen={pauseDialogOpen}
        onClose={closePauseDialog}
        onConfirm={handlePauseBot}
        phoneNumber={selectedPhoneNumber}
      />
    </>
  );
};

export default ChatBotActions;
