
import { useContactsData } from './useContactsData';
import { useContactsState } from './useContactsState';
import { useContactsActions } from './useContactsActions';
import { useContactsMessages } from './useContactsMessages';
import { useCustomFields } from './useCustomFields';
import { useState, useEffect } from 'react';
import { Contact } from '@/types/client';
import { CustomFieldWithValue } from '@/types/customFields';

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
  const { getCustomFieldsWithValues, saveClientCustomValues } = useCustomFields();

  // Novos estados para gerenciar campos personalizados
  const [customFieldsWithValues, setCustomFieldsWithValues] = useState<CustomFieldWithValue[]>([]);
  const [loadingCustomFields, setLoadingCustomFields] = useState(false);
  
  // Estado para configurações de visualização
  const [displayConfig, setDisplayConfig] = useState({
    showTags: true,
    showConsultationStage: true,
    showCommercialInfo: true,
    showCustomFields: true,
    showResponsibleUser: true,
    columnPreferences: [
      { field: 'name', visible: true, order: 1 },
      { field: 'phone', visible: true, order: 2 },
      { field: 'email', visible: true, order: 3 },
      { field: 'tags', visible: true, order: 4 },
      { field: 'consultationStage', visible: true, order: 5 },
      { field: 'clientName', visible: false, order: 6 },
      { field: 'responsibleUser', visible: false, order: 7 },
      { field: 'clientSector', visible: false, order: 8 },
      { field: 'budget', visible: false, order: 9 },
    ]
  });

  // Carregar campos personalizados quando um contato é selecionado
  useEffect(() => {
    if (selectedContact) {
      loadCustomFieldsForContact(selectedContact.id);
    }
  }, [selectedContact]);

  // Função para carregar campos personalizados de um contato
  const loadCustomFieldsForContact = async (contactId: string) => {
    try {
      setLoadingCustomFields(true);
      const fieldsWithValues = await getCustomFieldsWithValues(contactId);
      setCustomFieldsWithValues(fieldsWithValues);
    } catch (error) {
      console.error('Erro ao carregar campos personalizados:', error);
    } finally {
      setLoadingCustomFields(false);
    }
  };

  // Função para salvar campos personalizados
  const saveCustomFields = async (contactId: string, values: { fieldId: string; value: any }[]) => {
    try {
      await saveClientCustomValues(contactId, values);
      // Recarregar os campos após salvar
      await loadCustomFieldsForContact(contactId);
      return true;
    } catch (error) {
      console.error('Erro ao salvar campos personalizados:', error);
      return false;
    }
  };

  // Função para atualizar as configurações de visualização
  const updateDisplayConfig = (newConfig: Partial<typeof displayConfig>) => {
    setDisplayConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Função para obter contatos com informações unificadas
  const getUnifiedContacts = () => {
    return contacts.map(contact => {
      // Aqui podemos adicionar lógica para enriquecer os contatos com dados adicionais
      // como contagem de mensagens, status de pagamento, etc.
      return contact;
    });
  };

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
    // Estados de contatos
    contacts,
    unifiedContacts: getUnifiedContacts(),
    loadingContacts,
    refreshing,
    selectedContact,
    setSelectedContact,
    
    // Estados de modais e diálogos
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
    
    // Estados de formulários
    messageText,
    setMessageText,
    newContact,
    setNewContact,
    
    // Campos personalizados
    customFieldsWithValues,
    loadingCustomFields,
    loadCustomFieldsForContact,
    saveCustomFields,
    
    // Configurações de visualização
    displayConfig,
    updateDisplayConfig,
    
    // Ações
    handleRefresh,
    handleContactClick,
    handleAddContact: handleAddContactWrapper,
    handleEditContact: handleEditContactWrapper,
    handleDeleteContact: handleDeleteContactWrapper,
    openEditModal,
    handleMessageClick,
    handleMessageSubmit,
    handlePauseDurationConfirm: handlePauseDurationConfirmWrapper,
    handleKanbanStageChange,
    fetchClients,
  };
};
