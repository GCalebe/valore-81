
export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address?: string;
  clientName: string | null;
  clientSize: string | null;
  clientType: string | null;
  cpfCnpj: string | null;
  asaasCustomerId: string | null;
  payments?: any;
  status: 'Active' | 'Inactive';
  notes?: string;
  lastContact: string;
  kanbanStage: 'Entraram' | 'Conversaram' | 'Agendaram' | 'Compareceram' | 'Negociaram' | 'Postergaram' | 'Converteram';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}
