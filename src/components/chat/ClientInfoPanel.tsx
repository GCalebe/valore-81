import React, { useState, useEffect } from 'react';
import { ShipWheel, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/types/chat';
import { Contact } from '@/types/client';
import { useThemeSettings } from '@/context/ThemeSettingsContext';
import { supabase } from '@/integrations/supabase/client';
import TagsField from './TagsField';
import NotesField from './NotesField';

interface ClientInfoPanelProps {
  selectedChat: string | null;
  selectedConversation: Conversation | undefined;
}

const ClientInfoPanel = ({ selectedChat, selectedConversation }: ClientInfoPanelProps) => {
  const { settings } = useThemeSettings();
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [clientData, setClientData] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);

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
            payments: data.payments,
            status: 'Active',
            notes: '',
            lastContact: data.created_at ? new Date(data.created_at).toLocaleDateString('pt-BR') : 'Desconhecido',
            kanbanStage: (data.kanban_stage as "Entraram" | "Conversaram" | "Agendaram" | "Compareceram" | "Negociaram" | "Postergaram" | "Converteram") || 'Entraram',
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

  if (!selectedChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <ShipWheel 
          size={64} 
          className="mb-4 opacity-50"
          style={{ color: settings.primaryColor }}
        />
        <h3 className="text-xl font-medium mb-2">Informações do Responsável</h3>
        <p className="text-sm text-center px-4">Selecione uma conversa para ver as informações do Responsável</p>
      </div>
    );
  }

  if (loading) {
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
          
          <Tabs defaultValue="principal" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="principal">Principal</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="more">Mais Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="principal" className="mt-4 space-y-4">
              <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Informações Básicas
                    {isInfoOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email de Contato</h3>
                    <p>{clientData?.email || 'Não informado'}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Telefone</h3>
                    <p>{clientData?.phone || selectedConversation?.phone}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Nome do Cliente</h3>
                    <p>{clientData?.clientName || 'Não informado'}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tipo de Cliente</h3>
                    <p>{clientData?.clientType || 'Não informado'}</p>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tamanho do Cliente</h3>
                    <p>{clientData?.clientSize || 'Não informado'}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ID de Navegação</h3>
                    <p className="text-xs break-all">{clientData?.sessionId || selectedConversation?.sessionId || 'ID não informado'}</p>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4 space-y-4">
              <Collapsible open={isStatsOpen} onOpenChange={setIsStatsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Estatísticas
                    {isStatsOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</h3>
                    <Badge variant={clientData?.status === 'Active' ? 'default' : 'secondary'}>
                      {clientData?.status || 'Inativo'}
                    </Badge>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Último Contato</h3>
                    <p>{clientData?.lastContact || 'Não disponível'}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Etapa do Funil</h3>
                    <Badge variant="outline">{clientData?.kanbanStage || 'Não definida'}</Badge>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Vendas</h3>
                    <p>{clientData?.sales || 0}</p>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="more" className="mt-4 space-y-4">
              <Collapsible open={isMoreInfoOpen} onOpenChange={setIsMoreInfoOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Mais Informações
                    {isMoreInfoOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">CPF/CNPJ</h3>
                    <p>{clientData?.cpfCnpj || 'Não informado'}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ID Cliente Asaas</h3>
                    <p>{clientData?.asaasCustomerId || 'Não informado'}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Setor do Cliente</h3>
                    <p>{clientData?.clientSector || 'Não informado'}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Orçamento</h3>
                    <p>{clientData?.budget ? `R$ ${clientData.budget}` : 'Não informado'}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Método de Pagamento</h3>
                    <p>{clientData?.paymentMethod || 'Não informado'}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Objetivo do Cliente</h3>
                    <p>{clientData?.clientObjective || 'Não informado'}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Usuário Responsável</h3>
                    <p>{clientData?.responsibleUser || 'Não atribuído'}</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Etapa da Consulta</h3>
                    <Badge variant="outline">{clientData?.consultationStage || 'Nova consulta'}</Badge>
                  </Card>

                  {clientData?.payments && (
                    <Card className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Informações de Pagamento</h3>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                        {JSON.stringify(clientData.payments, null, 2)}
                      </pre>
                    </Card>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>
          </Tabs>
          
          {/* Notes Field */}
          <div className="mt-4">
            <NotesField selectedChat={selectedChat} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ClientInfoPanel;
