
import React from 'react';
import { Contact } from '@/types/client';
import ClientDetailSheet from '@/components/clients/ClientDetailSheet';
import EditClientDialog from '@/components/clients/EditClientDialog_old';
import SendMessageDialog from '@/components/clients/SendMessageDialog';
import PauseDurationDialog from '@/components/PauseDurationDialog';
// Verificando se o ClientDetailSheet está sendo importado corretamente

interface ClientsModalsProps {
  selectedContact: Contact | null;
  isDetailSheetOpen: boolean;
  setIsDetailSheetOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isMessageDialogOpen: boolean;
  setIsMessageDialogOpen: (open: boolean) => void;
  isPauseDurationDialogOpen: boolean;
  setIsPauseDurationDialogOpen: (open: boolean) => void;
  messageText: string;
  setMessageText: (text: string) => void;
  newContact: Partial<Contact>;
  setNewContact: (c: Partial<Contact>) => void;
  handleEditContact: () => void;
  handleDeleteContact: () => void;
  openEditModal: () => void;
  handleMessageSubmit: () => void;
  handlePauseDurationConfirm: (d: number | null) => void;
}

const ClientsModals = ({
  selectedContact,
  isDetailSheetOpen,
  setIsDetailSheetOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isMessageDialogOpen,
  setIsMessageDialogOpen,
  isPauseDurationDialogOpen,
  setIsPauseDurationDialogOpen,
  messageText,
  setMessageText,
  newContact,
  setNewContact,
  handleEditContact,
  handleDeleteContact,
  openEditModal,
  handleMessageSubmit,
  handlePauseDurationConfirm,
}: ClientsModalsProps) => {
  return (
    <>
      {selectedContact && (
        <>
          <ClientDetailSheet
            isOpen={isDetailSheetOpen}
            onOpenChange={setIsDetailSheetOpen}
            selectedContact={selectedContact}
            onEditClick={openEditModal}
            onDeleteClick={() => setIsDeleteDialogOpen(true)}
            onSendMessageClick={() => setIsMessageDialogOpen(true)}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            handleDeleteContact={handleDeleteContact}
            isMessageDialogOpen={isMessageDialogOpen}
            setIsMessageDialogOpen={setIsMessageDialogOpen}
            messageText={messageText}
            setMessageText={setMessageText}
            handleMessageSubmit={handleMessageSubmit}
            isPauseDurationDialogOpen={isPauseDurationDialogOpen}
            setIsPauseDurationDialogOpen={setIsPauseDurationDialogOpen}
            handlePauseDurationConfirm={handlePauseDurationConfirm}
          />
          <EditClientDialog
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            selectedContact={selectedContact}
            editContactData={newContact}
            setEditContactData={setNewContact}
            handleEditContact={handleEditContact}
          />
          {isMessageDialogOpen && (
            <SendMessageDialog
              isOpen={isMessageDialogOpen}
              selectedContact={selectedContact}
              messageText={messageText}
              setMessageText={setMessageText}
              handleMessageSubmit={handleMessageSubmit}
              onOpenChange={setIsMessageDialogOpen}
              isPauseDurationDialogOpen={isPauseDurationDialogOpen}
              setIsPauseDurationDialogOpen={setIsPauseDurationDialogOpen}
              handlePauseDurationConfirm={handlePauseDurationConfirm}
            />
          )}
        </>
      )}
      <PauseDurationDialog
        isOpen={isPauseDurationDialogOpen}
        onClose={() => setIsPauseDurationDialogOpen(false)}
        onConfirm={handlePauseDurationConfirm}
        phoneNumber={selectedContact?.phone || ''}
      />
    </>
  );
};

export default ClientsModals;
