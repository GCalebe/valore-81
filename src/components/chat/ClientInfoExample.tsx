import React from 'react';
import { Contact } from '@/types/client';
import { DynamicCategory } from '@/components/clients/DynamicCategoryManager';
import ClientInfo from '@/components/clients/ClientInfo';

interface ClientInfoExampleProps {
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
 * Exemplo de implementação do componente ClientInfo na tela de chat
 * Este componente pode ser usado como alternativa ao ClientInfoTabs
 */
const ClientInfoExample: React.FC<ClientInfoExampleProps> = ({
  clientData,
  dynamicFields,
  onFieldUpdate
}) => {
  return (
    <div className="mt-4">
      <ClientInfo
        clientData={clientData}
        dynamicFields={dynamicFields}
        onFieldUpdate={onFieldUpdate}
        context="chat"
      />
    </div>
  );
};

export default ClientInfoExample;

/**
 * Instruções para implementação:
 * 
 * Exemplo de uso no componente pai:
 * 
 * import ClientInfoExample from './ClientInfoExample';
 * 
 * // Substitua
 * <ClientInfoTabs 
 *   clientData={clientData}
 *   dynamicFields={dynamicFields}
 *   onFieldUpdate={handleFieldUpdate}
 * />
 * 
 * // Por
 * <ClientInfoExample 
 *   clientData={clientData}
 *   dynamicFields={dynamicFields}
 *   onFieldUpdate={handleFieldUpdate}
 * />
 */