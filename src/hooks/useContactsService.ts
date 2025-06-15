
import { Contact } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';

/**
 * Serviço para gerenciamento de contatos. 
 * Este serviço pode ser mockado em testes, permitindo melhor testabilidade.
 */
export function useContactsService() {
  // Busca todos os contatos da base.
  async function fetchAllContacts(): Promise<Contact[]> {
    const { data, error } = await supabase.from('contacts').select('*');
    if (error) throw error;
    if (!data) return [];

    return data.map((client: any) => ({
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
      payments: client.payments,
      status: client.status === 'Inactive' ? 'Inactive' : 'Active',
      notes: client.notes,
      lastContact: client.last_contact
        ? new Date(client.last_contact).toLocaleDateString('pt-BR')
        : (client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'Desconhecido'),
      kanbanStage: client.kanban_stage || 'Entraram', // Ensure fallback to default stage
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
    })) as Contact[];
  }

  async function updateContactKanbanStage(contactId: string, newStage: string) {
    const { error } = await supabase
      .from('contacts')
      .update({ kanban_stage: newStage })
      .eq('id', contactId);
    if (error) throw error;
  }

  // Aqui outros métodos de manipulação podem ser expandidos, separando responsabilidades
  // como addContact, updateContact etc, facilitando manutenção e testes.

  return {
    fetchAllContacts,
    updateContactKanbanStage,
    // ... outros métodos no futuro
  };
}
