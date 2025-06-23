import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDynamicFields } from '@/hooks/useDynamicFields';
import ClientInfoStandardized from './ClientInfoStandardized';

interface NewClientFormStandardizedProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newContact: Contact) => Promise<void>;
}

/**
 * Exemplo de implementação do componente padronizado no formulário de criação de cliente
 * Este componente substitui o NewClientDialog original
 */
const NewClientFormStandardized: React.FC<NewClientFormStandardizedProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [contact, setContact] = useState<Contact>(() => ({
    id: '',
    name: '',
    email: '',
    phone: '',
    clientType: '',
    clientSize: '',
    status: 'lead',
    lastContact: new Date().toISOString(),
    kanbanStage: 'lead',
    sales: 0,
    budget: 0,
    customValues: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  
  const [activeTab, setActiveTab] = useState('principal');
  const [isSaving, setIsSaving] = useState(false);
  const { dynamicFields, loadDynamicFields } = useDynamicFields();

  React.useEffect(() => {
    if (isOpen) {
      loadDynamicFields();
    }
  }, [isOpen, loadDynamicFields]);

  const handleFieldUpdate = (fieldId: string, newValue: any) => {
    // Verifica se é um campo personalizado ou um campo padrão
    if (fieldId.startsWith('custom_')) {
      setContact({
        ...contact,
        customValues: {
          ...contact.customValues,
          [fieldId]: newValue
        }
      });
    } else {
      setContact({
        ...contact,
        [fieldId]: newValue
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(contact);
      onClose();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="principal">Principal</TabsTrigger>
              <TabsTrigger value="custom">Personalizado</TabsTrigger>
              <TabsTrigger value="docs">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="principal" className="space-y-4">
              <ClientInfoStandardized
                clientData={contact}
                dynamicFields={dynamicFields}
                onFieldUpdate={handleFieldUpdate}
                context="edit" // Usamos o contexto edit para permitir edição
                showTabs={['basic', 'commercial']}
              />
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <ClientInfoStandardized
                clientData={contact}
                dynamicFields={dynamicFields}
                onFieldUpdate={handleFieldUpdate}
                context="edit"
                showTabs={['custom']}
              />
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <ClientInfoStandardized
                clientData={contact}
                dynamicFields={dynamicFields}
                onFieldUpdate={handleFieldUpdate}
                context="edit"
                showTabs={['docs']}
              />
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Criar Cliente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientFormStandardized;

/**
 * Instruções para implementação:
 * 
 * 1. Renomeie este arquivo para NewClientDialog.tsx (substituindo o atual)
 * 2. Ou importe este componente no lugar do NewClientDialog atual
 * 
 * Exemplo de uso no componente pai:
 * 
 * import NewClientFormStandardized from './NewClientFormStandardized';
 * 
 * // Substitua
 * <NewClientDialog 
 *   isOpen={isNewDialogOpen}
 *   onClose={handleCloseNewDialog}
 *   onSave={handleCreateClient}
 * />
 * 
 * // Por
 * <NewClientFormStandardized 
 *   isOpen={isNewDialogOpen}
 *   onClose={handleCloseNewDialog}
 *   onSave={handleCreateClient}
 * />
 */