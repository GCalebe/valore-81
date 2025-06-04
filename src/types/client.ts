
export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address?: string;
  ChatName: string | null;
  ChatSize: string | null;
  ChatBreed: string | null;
  cpfCnpj: string | null;
  asaasCustomerId: string | null;
  payments?: any;
  status: 'Active' | 'Inactive';
  notes?: string;
  lastContact: string;
  kanbanStage: 'Entraram' | 'Conversaram' | 'Agendaram' | 'Compareceram' | 'Negociaram' | 'Postergaram' | 'Converteram';
}
