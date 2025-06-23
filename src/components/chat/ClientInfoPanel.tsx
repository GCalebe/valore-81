
import React, { useState, useEffect } from 'react';
import { Anchor } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/types/chat';
import { Contact } from '@/types/client';
import { useThemeSettings } from '@/context/ThemeSettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { useDynamicFields } from '@/hooks/useDynamicFields';
import TagsField from './TagsField';
import NotesField from './NotesField';
import ClientInfoTabs from './ClientInfoTabs_old';

interface ClientInfoPanelProps {
  selectedChat: string | null;
  selectedConversation: Conversation | undefined;
}

const ClientInfoPanel = ({ selectedChat, selectedConversation }: ClientInfoPanelProps) => {
  const { settings } = useThemeSettings();
  const [clientData, setClientData] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Use the enhanced dynamic fields hook with validation
  const { dynamicFields, loading: dynamicFieldsLoading, updateField, validationErrors } = useDynamicFields(
    selectedConversation?.sessionId || null
  );

  // Buscar dados do cliente quando o chat for selecionado
  useEffect(() => {
    const fetchClientData = async () => {
      if (!selectedConversation?.sessionId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('dados_cliente')
          .select('*')
          .eq('sessionid', selectedConversation.sessionId)
          .single();

        if (error) {
          console.error('Error fetching client data:', error);
          return;
        }

        if (data) {
          // Ensure kanban_stage is a valid kanban stage value, default to 'Entraram' if invalid
          const validKanbanStages: Contact['kanbanStage'][] = [
            'Entraram', 'Conversaram', 'Agendaram', 'Compareceram', 'Negociaram', 'Postergaram', 'Converteram'
          ];
          const kanbanStage = validKanbanStages.includes(data.kanban_stage as Contact['kanbanStage']) 
            ? data.kanban_stage as Contact['kanbanStage']
            : 'Entraram';

          const formattedClient: Contact = {
            id: data.id.toString(),
            name: data.nome || 'Cliente sem nome',
            email: data.email,
            phone: data.telefone,
            clientName: data.client_name,
            clientSize: data.client_size,
            clientType: data.client_type,
            cpfCnpj: data.cpf_cnpj,
            asaasCustomerId: data.asaas_customer_id,
            status: 'Active',
            notes: '',
            lastContact: data.created_at ? new Date(data.created_at).toLocaleDateString('pt-BR') : 'Desconhecido',
            kanbanStage: kanbanStage,
            sessionId: data.sessionid,
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
            consultationStage: 'Nova consulta'
          };
          
          setClientData(formattedClient);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [selectedConversation?.sessionId]);

  const handleFieldUpdate = (fieldId: string, newValue: any) => {
    updateField(fieldId, newValue);
    console.log(`Field ${fieldId} updated with value:`, newValue);
    
    // Show validation error if exists
    if (validationErrors[fieldId]) {
      console.warn(`Validation error for field ${fieldId}:`, validationErrors[fieldId]);
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <Anchor 
          size={64} 
          className="mb-4 opacity-50"
          style={{ color: settings.primaryColor }}
        />
        <h3 className="text-xl font-medium mb-2">Informações do Cliente</h3>
        <p className="text-sm text-center px-4">Selecione uma conversa para ver as informações do cliente</p>
      </div>
    );
  }

  if (loading || dynamicFieldsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="h-8 w-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-sm">Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-center p-6 border-b border-gray-200 dark:border-gray-700">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
          style={{ 
            backgroundColor: `${settings.secondaryColor}20`,
            color: settings.primaryColor 
          }}
        >
          ⚓
        </div>
        <h2 className="text-xl font-semibold">{clientData?.name || selectedConversation?.name}</h2>
        <p className="text-gray-500 dark:text-gray-400">{clientData?.phone || selectedConversation?.phone}</p>
        {clientData?.kanbanStage && (
          <Badge variant="outline" className="mt-2">
            {clientData.kanbanStage}
          </Badge>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Tags Field */}
          <TagsField selectedChat={selectedChat} />
          
          {/* Enhanced Tabs System with Dynamic Fields and Validation */}
          <ClientInfoTabs 
            clientData={clientData}
            dynamicFields={dynamicFields}
            onFieldUpdate={handleFieldUpdate}
          />
          
          {/* Notes Field */}
          <div className="mt-6">
            <NotesField selectedChat={selectedChat} />
          </div>
          
          {/* Display validation errors if any */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-medium text-red-800 mb-2">Erros de validação:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {Object.entries(validationErrors).map(([fieldId, error]) => (
                  <li key={fieldId}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ClientInfoPanel;
