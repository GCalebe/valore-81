
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Contact } from '@/types/client';
import { DynamicCategory } from '@/components/clients/DynamicCategoryManager';
import DynamicFieldsDisplay from './DynamicFieldsDisplay';

interface ClientInfoTabsProps {
  clientData: Contact | null;
  dynamicFields: {
    basic: DynamicCategory[];
    commercial: DynamicCategory[];
    personalized: DynamicCategory[];
    documents: DynamicCategory[];
  };
  onFieldUpdate?: (fieldId: string, newValue: any) => void;
}

const ClientInfoTabs = ({ clientData, dynamicFields, onFieldUpdate }: ClientInfoTabsProps) => {
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [isCustomFieldsOpen, setIsCustomFieldsOpen] = useState(true);

  return (
    <Tabs defaultValue="principal" className="mt-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="principal">Principal</TabsTrigger>
        <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        <TabsTrigger value="custom">Campos Personalizados</TabsTrigger>
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
              <p>{clientData?.phone || 'Não informado'}</p>
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

            {/* Campos Dinâmicos Básicos */}
            {dynamicFields.basic.length > 0 && (
              <div className="mt-6">
                <DynamicFieldsDisplay 
                  fields={dynamicFields.basic} 
                  title="Informações Básicas Personalizadas" 
                  onFieldUpdate={onFieldUpdate}
                  readOnly={false}
                />
              </div>
            )}
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

            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Orçamento</h3>
              <p>{clientData?.budget ? `R$ ${clientData.budget}` : 'Não informado'}</p>
            </Card>

            {/* Campos Dinâmicos Comerciais */}
            {dynamicFields.commercial.length > 0 && (
              <div className="mt-6">
                <DynamicFieldsDisplay 
                  fields={dynamicFields.commercial} 
                  title="Informações Comerciais Personalizadas" 
                  onFieldUpdate={onFieldUpdate}
                  readOnly={false}
                />
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </TabsContent>

      <TabsContent value="custom" className="mt-4 space-y-4">
        <Collapsible open={isCustomFieldsOpen} onOpenChange={setIsCustomFieldsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Campos Personalizados
              {isCustomFieldsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 mt-4">
            {/* Campos Personalizados */}
            {dynamicFields.personalized.length > 0 && (
              <DynamicFieldsDisplay 
                fields={dynamicFields.personalized} 
                title="Campos Personalizados" 
                onFieldUpdate={onFieldUpdate}
                readOnly={false}
              />
            )}

            {/* Documentos */}
            {dynamicFields.documents.length > 0 && (
              <div className="mt-6">
                <DynamicFieldsDisplay 
                  fields={dynamicFields.documents} 
                  title="Documentos e Arquivos" 
                  onFieldUpdate={onFieldUpdate}
                  readOnly={false}
                />
              </div>
            )}

            {dynamicFields.personalized.length === 0 && dynamicFields.documents.length === 0 && (
              <Card className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum campo personalizado ou documento configurado para este cliente.
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Os campos serão exibidos aqui quando criados no formulário de adição de clientes.
                </p>
              </Card>
            )}
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

            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ID de Navegação</h3>
              <p className="text-xs break-all">{clientData?.sessionId || 'ID não informado'}</p>
            </Card>

            {clientData?.payments && (
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Informações de Pagamento</h3>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(clientData.payments, null, 2)}
                </pre>
              </Card>
            )}
          </CollapsibleContent>
        </Collapsible>
      </TabsContent>
    </Tabs>
  );
};

export default ClientInfoTabs;
