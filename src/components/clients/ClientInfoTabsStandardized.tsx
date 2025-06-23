import React from 'react';
import { Contact } from '@/types/client';
import { DynamicCategory } from './DynamicCategoryManager';
import ClientInfoStandardized from './ClientInfoStandardized';

interface ClientInfoTabsStandardizedProps {
  clientData: Contact;
  dynamicFields?: DynamicCategory[];
  onFieldUpdate?: (fieldId: string, value: any) => void;
}

/**
 * Exemplo de implementação do componente padronizado na tela de chat
 * Este componente substitui o ClientInfoTabs original
 */
const ClientInfoTabsStandardized: React.FC<ClientInfoTabsStandardizedProps> = ({
  clientData,
  dynamicFields = [],
  onFieldUpdate
}) => {
  return (
    <div className="w-full">
      <ClientInfoStandardized
        clientData={clientData}
        dynamicFields={dynamicFields}
        onFieldUpdate={onFieldUpdate}
        context="chat"
      />
    </div>
  );
};

export default ClientInfoTabsStandardized;

/**
 * Instruções para implementação:
 * 
 * 1. Renomeie este arquivo para ClientInfoTabs.tsx (substituindo o atual)
 * 2. Ou importe este componente no lugar do ClientInfoTabs atual
 * 
 * Exemplo de uso no componente pai:
 * 
 * import ClientInfoTabsStandardized from './ClientInfoTabsStandardized';
 * 
 * // Substitua
 * <ClientInfoTabs 
 *   clientData={selectedContact}
 *   dynamicFields={dynamicFields}
 *   onFieldUpdate={handleFieldUpdate}
 * />
 * 
 * // Por
 * <ClientInfoTabsStandardized 
 *   clientData={selectedContact}
 *   dynamicFields={dynamicFields}
 *   onFieldUpdate={handleFieldUpdate}
 * />
 */