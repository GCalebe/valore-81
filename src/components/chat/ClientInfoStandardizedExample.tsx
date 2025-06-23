import React from 'react';
import { Contact } from '@/types/client';
import { DynamicCategory } from '@/components/clients/DynamicCategoryManager';
import ClientInfoStandardized from '@/components/clients/ClientInfoStandardized';

interface ClientInfoStandardizedExampleProps {
  clientData: Contact | null;
  dynamicFields: {
    basic: DynamicCategory[];
    commercial: DynamicCategory[];
    personalized: DynamicCategory[];
    documents: DynamicCategory[];
  };
  onFieldUpdate?: (fieldId: string, newValue: any) => void;
}

/**
 * Exemplo de implementação do componente padronizado na tela de chat
 * Este componente substitui o ClientInfoTabs original
 */
const ClientInfoStandardizedExample: React.FC<ClientInfoStandardizedExampleProps> = ({
  clientData,
  dynamicFields,
  onFieldUpdate
}) => {
  return (
    <div className="mt-4">
      <ClientInfoStandardized
        clientData={clientData}
        dynamicFields={dynamicFields}
        onFieldUpdate={onFieldUpdate}
        context="chat"
      />
    </div>
  );
};

export default ClientInfoStandardizedExample;

/**
 * Instruções para implementação:
 * 
 * 1. Renomeie este arquivo para ClientInfoTabs.tsx (substituindo o atual)
 * 2. Ou importe este componente no lugar do ClientInfoTabs atual
 * 
 * Exemplo de uso no componente pai:
 * 
 * import ClientInfoStandardizedExample from './ClientInfoStandardizedExample';
 * 
 * // Substitua
 * <ClientInfoTabs 
 *   clientData={clientData}
 *   dynamicFields={dynamicFields}
 *   onFieldUpdate={handleFieldUpdate}
 * />
 * 
 * // Por
 * <ClientInfoStandardizedExample 
 *   clientData={clientData}
 *   dynamicFields={dynamicFields}
 *   onFieldUpdate={handleFieldUpdate}
 * />
 */