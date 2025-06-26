import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact } from "@/types/contact";
import { CustomField } from "@/types/customField";
import { ClientDocument } from "@/types/clientDocument";
import { ClientNote } from "@/types/clientNote";
import ClientInfoBasic from "./tabs/ClientInfoBasic";
import ClientCustomFields from "./tabs/ClientCustomFields";
import ClientDocuments from "./tabs/ClientDocuments";
import ClientNotes from "./tabs/ClientNotes";
import ClientUTMData from "./tabs/ClientUTMData";

export interface ClientInfoTabsProps {
  /**
   * Dados do contato do cliente
   */
  contact: Contact;

  /**
   * Lista de campos personalizados do cliente
   */
  customFields: CustomField[];

  /**
   * Lista de documentos do cliente
   */
  documents: ClientDocument[];

  /**
   * Lista de anotações do cliente
   */
  notes: ClientNote[];

  /**
   * Função para atualizar um campo personalizado
   */
  onUpdateCustomField?: (fieldId: string, value: any) => Promise<void>;

  /**
   * Função para adicionar um novo documento
   */
  onAddDocument?: (document: File, description: string) => Promise<void>;

  /**
   * Função para remover um documento
   */
  onRemoveDocument?: (documentId: string) => Promise<void>;

  /**
   * Função para visualizar um documento
   */
  onViewDocument?: (documentId: string) => Promise<void>;

  /**
   * Função para baixar um documento
   */
  onDownloadDocument?: (documentId: string) => Promise<void>;

  /**
   * Função para adicionar uma nova anotação
   */
  onAddNote?: (content: string) => Promise<void>;

  /**
   * Função para editar uma anotação existente
   */
  onEditNote?: (noteId: string, content: string) => Promise<void>;

  /**
   * Função para remover uma anotação
   */
  onRemoveNote?: (noteId: string) => Promise<void>;

  /**
   * Define se os campos devem ser somente leitura
   * @default false
   */
  readOnly?: boolean;

  /**
   * Define se o componente deve ser exibido em modo compacto
   * @default false
   */
  compact?: boolean;
}

/**
 * Componente padronizado para exibir informações do cliente em abas
 */
export const ClientInfoTabs: React.FC<ClientInfoTabsProps> = ({
  contact,
  customFields,
  documents,
  notes,
  onUpdateCustomField,
  onAddDocument,
  onRemoveDocument,
  onViewDocument,
  onDownloadDocument,
  onAddNote,
  onEditNote,
  onRemoveNote,
  readOnly = false,
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="info">Informações</TabsTrigger>
        <TabsTrigger value="custom">Campos Personalizados</TabsTrigger>
        <TabsTrigger value="documents">Documentos</TabsTrigger>
        <TabsTrigger value="notes">Anotações</TabsTrigger>
        <TabsTrigger value="utm">Dados UTM</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <ClientInfoBasic contact={contact} compact={compact} />
      </TabsContent>

      <TabsContent value="custom">
        <ClientCustomFields
          customFields={customFields}
          onUpdateCustomField={onUpdateCustomField}
          readOnly={readOnly}
          compact={compact}
        />
      </TabsContent>

      <TabsContent value="documents">
        <ClientDocuments
          documents={documents}
          onAddDocument={onAddDocument}
          onRemoveDocument={onRemoveDocument}
          onViewDocument={onViewDocument}
          onDownloadDocument={onDownloadDocument}
          compact={compact}
        />
      </TabsContent>

      <TabsContent value="notes">
        <ClientNotes
          notes={notes}
          onAddNote={onAddNote}
          onEditNote={onEditNote}
          onRemoveNote={onRemoveNote}
          compact={compact}
        />
      </TabsContent>

      <TabsContent value="utm">
        <ClientUTMData contact={contact} compact={compact} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientInfoTabs;
