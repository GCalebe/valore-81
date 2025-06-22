import { supabase } from '@/integrations/supabase/client';
import { Contact } from '@/types/client';

export const useContactsService = () => {
  const fetchAllContacts = async (): Promise<Contact[]> => {
    try {
      // First, try to fetch from the comprehensive view
      const { data: contactsData, error: contactsError } = await supabase
        .from('v_clients_complete')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (contactsError) {
        console.warn('Failed to fetch from v_clients_complete, trying contacts table:', contactsError);
        
        // Fallback to contacts table with manual joins
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('contacts')
          .select(`
            *,
            kanban_stages!contacts_kanban_stage_fk(title)
          `)
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (fallbackError) {
          throw new Error(`Failed to fetch contacts: ${fallbackError.message}`);
        }

        // Transform fallback data to match expected format
        return (fallbackData || []).map(contact => ({
          ...contact,
          kanbanStage: contact.kanban_stages?.title || 'Entraram',
          customFieldsJsonb: null,
          messageCount: 0
        }));
      }

      // Transform the data to match the Contact interface
      return (contactsData || []).map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        address: contact.address,
        clientName: contact.client_name,
        clientSize: contact.client_size,
        clientType: contact.client_type,
        cpfCnpj: contact.cpf_cnpj,
        asaasCustomerId: contact.asaas_customer_id,
        status: contact.status,
        notes: contact.notes,
        lastContact: contact.last_contact,
        lastMessage: contact.last_message,
        lastMessageTime: contact.last_message_time,
        unreadCount: contact.unread_count,
        sessionId: contact.session_id,
        tags: contact.tags || [],
        responsibleUser: contact.responsible_user,
        sales: contact.sales,
        clientSector: contact.client_sector,
        budget: contact.budget,
        paymentMethod: contact.payment_method,
        clientObjective: contact.client_objective,
        lossReason: contact.loss_reason,
        contractNumber: contact.contract_number,
        contractDate: contact.contract_date,
        payment: contact.payment,
        uploadedFiles: contact.uploaded_files || [],
        consultationStage: contact.consultation_stage,
        createdAt: contact.created_at,
        deletedAt: contact.deleted_at,
        updatedAt: contact.updated_at,
        kanbanStageId: contact.kanban_stage_id,
        kanbanStage: contact.kanban_stage || 'Entraram',
        customFieldsJsonb: contact.custom_fields_jsonb,
        messageCount: contact.message_count || 0
      }));
    } catch (error) {
      console.error('Error in fetchAllContacts:', error);
      throw error;
    }
  };

  const updateContactKanbanStage = async (contactId: string, stageTitle: string) => {
    try {
      // First, get the stage ID from the title
      const { data: stageData, error: stageError } = await supabase
        .from('kanban_stages')
        .select('id')
        .eq('title', stageTitle)
        .single();

      if (stageError) {
        throw new Error(`Failed to find kanban stage: ${stageError.message}`);
      }

      // Update the contact with the stage ID
      const { error: updateError } = await supabase
        .from('contacts')
        .update({ kanban_stage_id: stageData.id })
        .eq('id', contactId);

      if (updateError) {
        throw new Error(`Failed to update contact: ${updateError.message}`);
      }
    } catch (error) {
      console.error('Error in updateContactKanbanStage:', error);
      throw error;
    }
  };

  return {
    fetchAllContacts,
    updateContactKanbanStage,
  };
};