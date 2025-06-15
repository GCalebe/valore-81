import { useState, useEffect } from 'react';
import { Contact } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateFictitiousConversations } from '@/utils/fictitiousMessages';

export const useClientManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isPauseDurationDialogOpen, setIsPauseDurationDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    clientName: '',
    clientSize: '',
    clientType: '',
    cpfCnpj: '',
    asaasCustomerId: '',
    status: 'Active',
    notes: '',
    tags: [],
    responsibleUser: '',
    sales: 0,
    clientSector: '',
    budget: 0,
    paymentMethod: '',
    clientObjective: '',
    lossReason: '',
    contractNumber: '',
    contractDate: '',
    payment: '',
    uploadedFiles: [],
    consultationStage: 'Nova consulta',
  });

  const fetchClients = async () => {
    try {
      setLoadingContacts(true);
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedContacts: Contact[] = data.map(client => {
          const validKanbanStages: Contact['kanbanStage'][] = [
            'Entraram', 'Conversaram', 'Agendaram', 'Compareceram', 'Negociaram', 'Postergaram', 'Converteram'
          ];
          const kanbanStage = validKanbanStages.includes(client.kanban_stage as Contact['kanbanStage']) 
            ? client.kanban_stage as Contact['kanbanStage']
            : 'Entraram';

          // FIX: Guarantee status matches Contact type
          let safeStatus: Contact['status'] = client.status === 'Inactive' ? 'Inactive' : 'Active';

          return {
            id: client.id,
            name: client.name || 'Cliente sem nome',
            email: client.email,
            phone: client.phone,
            address: client.address,
            clientName: client.client_name,
            clientSize: client.client_size,
            clientType: client.client_type,
            cpfCnpj: client.cpf_cnpj,
            asaasCustomerId: client.asaas_customer_id,
            status: safeStatus,
            notes: client.notes,
            lastContact: client.last_contact ? new Date(client.last_contact).toLocaleDateString('pt-BR') : (client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'Desconhecido'),
            kanbanStage: kanbanStage,
            sessionId: client.session_id,
            tags: client.tags || [],
            responsibleUser: client.responsible_user,
            sales: client.sales,
            clientSector: client.client_sector,
            budget: client.budget,
            paymentMethod: client.payment_method,
            clientObjective: client.client_objective,
            lossReason: client.loss_reason,
            contractNumber: client.contract_number,
            contractDate: client.contract_date,
            payment: client.payment,
            uploadedFiles: client.uploaded_files || [],
            consultationStage: client.consultation_stage,
            lastMessage: client.last_message,
            lastMessageTime: client.last_message_time,
            unreadCount: client.unread_count,
          };
        });
        
        // Generate fictitious conversations for all contacts
        const contactsWithConversations = generateFictitiousConversations(formattedContacts);
        
        // Buscar última mensagem para cada contato que tem sessionId
        for (const contact of contactsWithConversations) {
          if (contact.sessionId) {
            try {
              const { data: historyData, error: historyError } = await supabase
                .from('n8n_chat_histories')
                .select('*')
                .eq('session_id', contact.sessionId)
                .order('id', { ascending: false })
                .limit(1);
              
              if (!historyError && historyData && historyData.length > 0) {
                const chatHistory = historyData[0];
                
                let lastMessageContent = 'Sem mensagem';
                if (chatHistory.message && typeof chatHistory.message === 'object' && !Array.isArray(chatHistory.message)) {
                  const messageObj = chatHistory.message as { [key: string]: any };
                  if (messageObj.content) {
                    lastMessageContent = messageObj.content;
                  }
                }
                
                contact.lastMessage = lastMessageContent || 'Sem mensagem';
                
                const messageDate = chatHistory.hora 
                  ? new Date(chatHistory.hora) 
                  : chatHistory.data 
                    ? new Date(chatHistory.data) 
                    : new Date();
                
                contact.lastMessageTime = messageDate.toLocaleString('pt-BR');
              }
            } catch (error) {
              console.error(`Error fetching last message for contact ${contact.id}:`, error);
            }
          }
        }
        
        setContacts(contactsWithConversations);
      }
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
  };

  const handleKanbanStageChange = async (contactId: string, newStage: Contact['kanbanStage']) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ kanban_stage: newStage })
        .eq('id', contactId);

      if (error) throw error;

      // Update local state
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

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailSheetOpen(true);
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([
          {
            name: newContact.name,
            email: newContact.email,
            phone: newContact.phone,
            address: newContact.address,
            client_name: newContact.clientName,
            client_size: newContact.clientSize,
            client_type: newContact.clientType,
            cpf_cnpj: newContact.cpfCnpj,
            asaas_customer_id: newContact.asaasCustomerId,
            status: 'Active',
            notes: newContact.notes,
            tags: newContact.tags,
            responsible_user: newContact.responsibleUser,
            sales: newContact.sales,
            client_sector: newContact.clientSector,
            budget: newContact.budget,
            payment_method: newContact.paymentMethod,
            client_objective: newContact.clientObjective,
            loss_reason: newContact.lossReason,
            contract_number: newContact.contractNumber,
            contract_date: newContact.contractDate,
            payment: newContact.payment,
            uploaded_files: newContact.uploadedFiles,
            consultation_stage: newContact.consultationStage,
            kanban_stage: 'Entraram'
          }
        ])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        fetchClients();
        
        setNewContact({
          name: '',
          email: '',
          phone: '',
          address: '',
          clientName: '',
          clientSize: '',
          clientType: '',
          cpfCnpj: '',
          asaasCustomerId: '',
          status: 'Active',
          notes: '',
          tags: [],
          responsibleUser: '',
          sales: 0,
          clientSector: '',
          budget: 0,
          paymentMethod: '',
          clientObjective: '',
          lossReason: '',
          contractNumber: '',
          contractDate: '',
          payment: '',
          uploadedFiles: [],
          consultationStage: 'Nova consulta',
        });
        
        setIsAddContactOpen(false);
        
        toast({
          title: "Cliente adicionado",
          description: `${newContact.name} foi adicionado com sucesso.`,
        });
        
        try {
          await fetch('https://webhook.comercial247.com.br/webhook/cria_usuario', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newContact),
          });
        } catch (webhookError) {
          console.error('Erro ao enviar para webhook:', webhookError);
        }
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Não foi possível salvar o cliente no banco de dados.",
        variant: "destructive",
      });
    }
  };

  const handleEditContact = async () => {
    if (!selectedContact) return;
    
    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          name: newContact.name,
          email: newContact.email,
          phone: newContact.phone,
          address: newContact.address,
          client_name: newContact.clientName,
          client_size: newContact.clientSize,
          client_type: newContact.clientType,
          cpf_cnpj: newContact.cpfCnpj,
          asaas_customer_id: newContact.asaasCustomerId,
          status: newContact.status,
          notes: newContact.notes,
          tags: newContact.tags,
          responsible_user: newContact.responsibleUser,
          sales: newContact.sales,
          client_sector: newContact.clientSector,
          budget: newContact.budget,
          payment_method: newContact.paymentMethod,
          client_objective: newContact.clientObjective,
          loss_reason: newContact.lossReason,
          contract_number: newContact.contractNumber,
          contract_date: newContact.contractDate,
          payment: newContact.payment,
          uploaded_files: newContact.uploadedFiles,
          consultation_stage: newContact.consultationStage,
        })
        .eq('id', selectedContact.id);
      
      if (error) throw error;
      
      fetchClients();
      
      setIsEditModalOpen(false);
      
      toast({
        title: "Cliente atualizado",
        description: `As informações de ${selectedContact.name} foram atualizadas.`,
      });
      
      try {
        await fetch('https://webhook.comercial247.com.br/webhook/edita_usuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedContact.id,
            ...newContact
          }),
        });
      } catch (webhookError) {
        console.error('Erro ao enviar para webhook:', webhookError);
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente no banco de dados.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', selectedContact.id);
      
      if (error) throw error;
      
      fetchClients();
      
      setSelectedContact(null);
      setIsDetailSheetOpen(false);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Cliente removido",
        description: `${selectedContact.name} foi removido da sua lista de clientes.`,
        variant: "destructive",
      });
      
      try {
        await fetch('https://webhook.comercial247.com.br/webhook/exclui_usuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: selectedContact.phone }),
        });
      } catch (webhookError) {
        console.error('Erro ao enviar para webhook:', webhookError);
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast({
        title: "Erro ao remover cliente",
        description: "Não foi possível remover o cliente do banco de dados.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditModal = () => {
    if (!selectedContact) return;
    setNewContact({
      name: selectedContact.name,
      email: selectedContact.email,
      phone: selectedContact.phone,
      address: selectedContact.address,
      clientName: selectedContact.clientName,
      clientSize: selectedContact.clientSize,
      clientType: selectedContact.clientType,
      cpfCnpj: selectedContact.cpfCnpj,
      asaasCustomerId: selectedContact.asaasCustomerId,
      status: selectedContact.status,
      notes: selectedContact.notes,
      tags: selectedContact.tags || [],
      responsibleUser: selectedContact.responsibleUser || '',
      sales: selectedContact.sales || 0,
      clientSector: selectedContact.clientSector || '',
      budget: selectedContact.budget || 0,
      paymentMethod: selectedContact.paymentMethod || '',
      clientObjective: selectedContact.clientObjective || '',
      lossReason: selectedContact.lossReason || '',
      contractNumber: selectedContact.contractNumber || '',
      contractDate: selectedContact.contractDate || '',
      payment: selectedContact.payment || '',
      uploadedFiles: selectedContact.uploadedFiles || [],
      consultationStage: selectedContact.consultationStage || 'Nova consulta',
    });
    setIsEditModalOpen(true);
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

  const handlePauseDurationConfirm = async (duration: number | null) => {
    if (!selectedContact) return;
    
    try {
      const response = await fetch('https://webhook.comercial247.com.br/webhook/envia_mensagem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: selectedContact.phone,
          message: messageText,
          pauseDuration: duration
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao enviar dados para o webhook');
      }
      
      setIsPauseDurationDialogOpen(false);
      
      toast({
        title: "Mensagem enviada",
        description: duration === null 
          ? `Mensagem enviada para ${selectedContact.name} sem pausar o bot.` 
          : `Mensagem enviada para ${selectedContact.name} e bot pausado por ${duration} segundos.`,
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setIsPauseDurationDialogOpen(false);
      
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem para o servidor.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    fetchClients();
  }, []);

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
    handleAddContact,
    handleEditContact,
    handleDeleteContact,
    openEditModal,
    handleMessageClick,
    handleMessageSubmit,
    handlePauseDurationConfirm,
    handleKanbanStageChange
  };
};
