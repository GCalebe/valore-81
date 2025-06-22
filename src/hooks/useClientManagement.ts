
import { useContactsData } from './useContactsData';
import { useContactsState } from './useContactsState';
import { useContactsActions } from './useContactsActions';
import { useContactsMessages } from './useContactsMessages';

export const useClientManagement = () => {
  const {
    contacts,
    setContacts,
    loadingContacts,
    refreshing,
    fetchClients,
    handleKanbanStageChange,
    handleRefresh,
  } = useContactsData();

  const {
    selectedContact,
    setSelectedContact,
    isAddContactOpen,
    setIsAddContactOpen,
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
    handleContactClick,
    openEditModal,
    resetNewContact,
  } = useContactsState();

  const { handleAddContact, handleEditContact, handleDeleteContact } = useContactsActions();
  const { handlePauseDurationConfirm } = useContactsMessages();

  const handleAddContactWrapper = async (): Promise<string | undefined> => {
    return new Promise((resolve) => {
      handleAddContact(
        newContact,
        (contactId?: string) => {
          fetchClients();
          setIsAddContactOpen(false);
          resolve(contactId);
        },
        resetNewContact
      );
    });
  };

  const handleEditContactWrapper = async () => {
    await handleEditContact(
      selectedContact!,
      newContact,
      () => {
        fetchClients();
        setIsEditModalOpen(false);
      }
    );
  };

  const handleDeleteContactWrapper = async () => {
    await handleDeleteContact(
      selectedContact!,
      () => {
        fetchClients();
        setSelectedContact(null);
        setIsDetailSheetOpen(false);
        setIsDeleteDialogOpen(false);
      }
    );
  };

  const handleMessageClick = () => {
    setMessageText('');
    setIsMessageDialogOpen(true);
  };

  const handleMessageSubmit = () => {
    if (!messageText.trim() || !selectedContact) return;
    
    setIsMessageDialogOpen(false);
    setIsPauseDurationDialogOpen(true);
  };

  const handlePauseDurationConfirmWrapper = async (duration: number | null) => {
    await handlePauseDurationConfirm(
      selectedContact,
      messageText,
      duration,
      () => setIsPauseDurationDialogOpen(false)
    );
  };

  return {
    contacts,
    loadingContacts,
    refreshing,
    selectedContact,
    setSelectedContact,
    isAddContactOpen,
    setIsAddContactOpen,
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
    handleRefresh,
    handleContactClick,
    handleAddContact: handleAddContactWrapper,
    handleEditContact: handleEditContactWrapper,
    handleDeleteContact: handleDeleteContactWrapper,
    openEditModal,
    handleMessageClick,
    handleMessageSubmit,
    handlePauseDurationConfirm: handlePauseDurationConfirmWrapper,
    handleKanbanStageChange
  };
};
