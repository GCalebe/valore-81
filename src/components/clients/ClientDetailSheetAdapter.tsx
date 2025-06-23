import React from 'react';
import { Contact } from '@/types/client';
import { CustomFieldWithValue } from '@/types/customFields';
import ClientDetailSheetStandardized from './ClientDetailSheetStandardized';
import SendMessageDialog from './SendMessageDialog';
import PauseDurationDialog from '@/components/PauseDurationDialog';

interface ClientDetailSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContact: Contact | null;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onSendMessageClick: () => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleDeleteContact: () => void;
  isMessageDialogOpen: boolean;
  setIsMessageDialogOpen: (open: boolean) => void;
  messageText: string;
  setMessageText: (text: string) => void;
  handleMessageSubmit: () => void;
  isPauseDurationDialogOpen: boolean;
  setIsPauseDurationDialogOpen: (open: boolean) => void;
  handlePauseDurationConfirm: (duration: number | null) => void;
  customFields?: CustomFieldWithValue[];
  loadingCustomFields?: boolean;
  displayConfig?: {
    showTags?: boolean;
    showConsultationStage?: boolean;
    showCommercialInfo?: boolean;
    showCustomFields?: boolean;
  };
}

/**
 * Adaptador para o ClientDetailSheetStandardized que aceita as props do ClientDetailSheet original
 * Este componente permite usar o ClientDetailSheetStandardized sem alterar a interface do ClientDetailSheet
 */
const ClientDetailSheetAdapter: React.FC<ClientDetailSheetProps> = ({
  isOpen,
  onOpenChange,
  selectedContact,
  onEditClick,
  onDeleteClick,
  onSendMessageClick,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteContact,
  isMessageDialogOpen,
  setIsMessageDialogOpen,
  messageText,
  setMessageText,
  handleMessageSubmit,
  isPauseDurationDialogOpen,
  setIsPauseDurationDialogOpen,
  handlePauseDurationConfirm,
  // Ignoramos as props que não são usadas pelo ClientDetailSheetStandardized
}) => {
  // Função para fechar o sheet
  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  // Função para enviar mensagem
  const handleSendMessage = (contactId: string) => {
    if (onSendMessageClick) {
      onSendMessageClick();
    }
  };

  // Função para editar cliente
  const handleEditClient = (contact: Contact) => {
    if (onEditClick) {
      onEditClick();
    }
  };

  // Função para excluir cliente
  const handleDeleteClient = (contact: Contact) => {
    if (onDeleteClick) {
      onDeleteClick();
    }
  };
  
  // Verificando no console os dados recebidos
  console.log('ClientDetailSheetAdapter - Props:', {
    isOpen,
    selectedContact,
    onEditClick,
    onDeleteClick,
    onSendMessageClick,
    isMessageDialogOpen,
    setIsMessageDialogOpen,
    isPauseDurationDialogOpen,
    setIsPauseDurationDialogOpen,
    messageText: messageText ? 'definido' : 'indefinido',
    setMessageText: setMessageText ? 'definido' : 'indefinido',
    handleMessageSubmit: handleMessageSubmit ? 'definido' : 'indefinido',
    handlePauseDurationConfirm: handlePauseDurationConfirm ? 'definido' : 'indefinido'
  });

  // Inicializar valores padrão para evitar erros de undefined
  const safeMessageText = typeof messageText === 'string' ? messageText : '';
  const safeIsPauseDurationDialogOpen = typeof isPauseDurationDialogOpen === 'boolean' ? isPauseDurationDialogOpen : false;
  const safeSetIsPauseDurationDialogOpen = typeof setIsPauseDurationDialogOpen === 'function' ? setIsPauseDurationDialogOpen : (() => {});
  const safeHandlePauseDurationConfirm = typeof handlePauseDurationConfirm === 'function' ? handlePauseDurationConfirm : ((duration: number | null) => {});
  const safeSetMessageText = typeof setMessageText === 'function' ? setMessageText : (() => {});
  const safeHandleMessageSubmit = typeof handleMessageSubmit === 'function' ? handleMessageSubmit : (() => {});
  const safeSetIsMessageDialogOpen = typeof setIsMessageDialogOpen === 'function' ? setIsMessageDialogOpen : (() => {});
  const safeIsMessageDialogOpen = typeof isMessageDialogOpen === 'boolean' ? isMessageDialogOpen : false;

  return (
    <>
      <ClientDetailSheetStandardized
        isOpen={isOpen}
        onClose={handleClose}
        contact={selectedContact}
        onSendMessage={handleSendMessage}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
      />
      
      {selectedContact && (
        <SendMessageDialog
          isOpen={safeIsMessageDialogOpen}
          selectedContact={selectedContact}
          messageText={safeMessageText}
          setMessageText={safeSetMessageText}
          handleMessageSubmit={safeHandleMessageSubmit}
          onOpenChange={safeSetIsMessageDialogOpen}
          isPauseDurationDialogOpen={safeIsPauseDurationDialogOpen}
          setIsPauseDurationDialogOpen={safeSetIsPauseDurationDialogOpen}
          handlePauseDurationConfirm={safeHandlePauseDurationConfirm}
        />
      )}
      
      <PauseDurationDialog
        isOpen={safeIsPauseDurationDialogOpen}
        onClose={() => safeSetIsPauseDurationDialogOpen(false)}
        onConfirm={safeHandlePauseDurationConfirm}
        phoneNumber={selectedContact?.phone || ''}
      />
    </>
  );
};

export default ClientDetailSheetAdapter;