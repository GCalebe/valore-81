import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types/client';
import { MessageCircle, Edit } from 'lucide-react';
import ClientInfoStandardized from './ClientInfoStandardized';
import { DynamicCategory } from './DynamicCategoryManager';
import { useDynamicFields } from '@/hooks/useDynamicFields';

interface ClientDetailSheetStandardizedProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onSendMessage?: (contactId: string) => void;
  onEditClient?: (contact: Contact) => void;
}

/**
 * Exemplo de implementação do componente padronizado na tela de detalhes do cliente
 * Este componente substitui o ClientDetailSheet original
 */
const ClientDetailSheetStandardized: React.FC<ClientDetailSheetStandardizedProps> = ({
  isOpen,
  onClose,
  contact,
  onSendMessage,
  onEditClient
}) => {
  const { dynamicFields, loadDynamicFields } = useDynamicFields();

  useEffect(() => {
    if (isOpen && contact) {
      loadDynamicFields();
    }
  }, [isOpen, contact, loadDynamicFields]);

  const handleSendMessage = () => {
    if (contact?.id && onSendMessage) {
      onSendMessage(contact.id);
      onClose();
    }
  };

  const handleEditClient = () => {
    if (contact && onEditClient) {
      onEditClient(contact);
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold">
            {contact?.name || 'Detalhes do Cliente'}
          </SheetTitle>
        </SheetHeader>

        {contact && (
          <div className="space-y-6">
            <ClientInfoStandardized
              clientData={contact}
              dynamicFields={dynamicFields}
              context="details"
            />

            <div className="flex space-x-2 mt-6">
              <Button
                variant="default"
                className="flex-1"
                onClick={handleSendMessage}
                disabled={!onSendMessage}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </Button>
              
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleEditClient}
                disabled={!onEditClient}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Cliente
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ClientDetailSheetStandardized;

/**
 * Instruções para implementação:
 * 
 * 1. Renomeie este arquivo para ClientDetailSheet.tsx (substituindo o atual)
 * 2. Ou importe este componente no lugar do ClientDetailSheet atual
 * 
 * Exemplo de uso no componente pai:
 * 
 * import ClientDetailSheetStandardized from './ClientDetailSheetStandardized';
 * 
 * // Substitua
 * <ClientDetailSheet 
 *   isOpen={isDetailSheetOpen}
 *   onClose={handleCloseDetailSheet}
 *   contact={selectedContact}
 *   onSendMessage={handleSendMessage}
 *   onEditClient={handleEditClient}
 * />
 * 
 * // Por
 * <ClientDetailSheetStandardized 
 *   isOpen={isDetailSheetOpen}
 *   onClose={handleCloseDetailSheet}
 *   contact={selectedContact}
 *   onSendMessage={handleSendMessage}
 *   onEditClient={handleEditClient}
 * />
 */