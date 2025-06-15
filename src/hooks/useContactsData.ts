
import { useState, useEffect, useCallback } from 'react';
import { Contact } from '@/types/client';
import { toast } from '@/hooks/use-toast';
import { generateFictitiousConversations } from '@/utils/fictitiousMessages';
import { useContactsService } from './useContactsService';

export const useContactsData = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const contactsService = useContactsService();

  const fetchClients = useCallback(async () => {
    try {
      setLoadingContacts(true);
      const contactsFetched = await contactsService.fetchAllContacts();

      // Gera conversas fictícias se necessário.
      let contactsWithConversations = generateFictitiousConversations(contactsFetched);

      // Ensure all contacts have a valid kanban stage
      contactsWithConversations = contactsWithConversations.map(contact => ({
        ...contact,
        kanbanStage: contact.kanbanStage || 'Entraram'
      }));

      setContacts(contactsWithConversations);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Ocorreu um erro ao buscar os clientes do banco de dados.",
        variant: "destructive"
      });
    } finally {
      setLoadingContacts(false);
      setRefreshing(false);
    }
  }, [contactsService]);

  const handleKanbanStageChange = async (contactId: string, newStage: string) => {
    try {
      await contactsService.updateContactKanbanStage(contactId, newStage);

      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, kanbanStage: newStage }
            : contact
        )
      );

      toast({
        title: "Etapa atualizada",
        description: `Cliente movido para ${newStage}.`,
      });
    } catch (error) {
      console.error('Error updating kanban stage:', error);
      toast({
        title: "Erro ao atualizar etapa",
        description: "Não foi possível atualizar a etapa do cliente.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchClients();
    toast({
      title: "Atualizando dados",
      description: "Os dados da tabela estão sendo atualizados.",
    });
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    contacts,
    setContacts,
    loadingContacts,
    refreshing,
    fetchClients,
    handleKanbanStageChange,
    handleRefresh,
  };
};
