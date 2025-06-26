import React from "react";
import { Contact } from "@/types/client";
import { DynamicCategory } from "@/components/clients/DynamicCategoryManager";
import ClientInfo from "@/components/clients/ClientInfo";

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

/**
 * Componente ClientInfoTabs
 * Este componente exibe as informações do cliente na tela de chat,
 * utilizando o componente ClientInfo.
 */
const ClientInfoTabs: React.FC<ClientInfoTabsProps> = ({
  clientData,
  dynamicFields,
  onFieldUpdate,
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

export default ClientInfoTabs;

/**
 * Exemplo de uso no componente pai:
 *
 * import ClientInfoTabs from './ClientInfoTabs';
 *
 * // Substitua
 * <ClientInfoTabs
 *   clientData={clientData}
 *   dynamicFields={dynamicFields}
 *   onFieldUpdate={handleFieldUpdate}
 * />
 *
 * // Por
 * <ClientInfoTabs
 *   clientData={clientData}
 *   dynamicFields={dynamicFields}
 *   onFieldUpdate={handleFieldUpdate}
 * />
 */
