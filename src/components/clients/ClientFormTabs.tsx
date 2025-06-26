import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Contact } from "@/types/client";
import { DynamicCategory } from "./DynamicCategoryManager";
import BasicInfoForm from "./BasicInfoForm";
import CommercialInfoForm from "./CommercialInfoForm";
import DocumentsForm from "./DocumentsForm";

interface ClientFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  newContact: Partial<Contact>;
  validationErrors: { [key: string]: string };
  basicCategories: DynamicCategory[];
  commercialCategories: DynamicCategory[];
  documentsCategories: DynamicCategory[];
  onInputChange: (field: keyof Contact, value: any) => void;
  onBasicCategoriesChange: (categories: DynamicCategory[]) => void;
  onCommercialCategoriesChange: (categories: DynamicCategory[]) => void;
  onDocumentsCategoriesChange: (categories: DynamicCategory[]) => void;
}

const ClientFormTabs = ({
  activeTab,
  setActiveTab,
  newContact,
  validationErrors,
  basicCategories,
  commercialCategories,
  documentsCategories,
  onInputChange,
  onBasicCategoriesChange,
  onCommercialCategoriesChange,
  onDocumentsCategoriesChange,
}: ClientFormTabsProps) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full flex flex-col"
    >
      <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100 dark:bg-gray-700">
        <TabsTrigger
          value="basico"
          className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 text-gray-700 dark:text-gray-300"
        >
          Informações Básicas
          {(validationErrors.name ||
            validationErrors.phone ||
            validationErrors.email) && (
            <AlertCircle className="h-3 w-3 text-red-500" />
          )}
        </TabsTrigger>
        <TabsTrigger
          value="comercial"
          className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 text-gray-700 dark:text-gray-300"
        >
          Dados Comerciais
          {(validationErrors.budget || validationErrors.cpfCnpj) && (
            <AlertCircle className="h-3 w-3 text-red-500" />
          )}
        </TabsTrigger>
        <TabsTrigger
          value="documentos"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 text-gray-700 dark:text-gray-300"
        >
          Documentos
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 overflow-y-auto">
        <TabsContent value="basico" className="space-y-6 mt-0">
          <BasicInfoForm
            newContact={newContact}
            validationErrors={validationErrors}
            basicCategories={basicCategories}
            onInputChange={onInputChange}
            onCategoriesChange={onBasicCategoriesChange}
          />
        </TabsContent>

        <TabsContent value="comercial" className="space-y-6 mt-0">
          <CommercialInfoForm
            newContact={newContact}
            validationErrors={validationErrors}
            commercialCategories={commercialCategories}
            onInputChange={onInputChange}
            onCategoriesChange={onCommercialCategoriesChange}
          />
        </TabsContent>

        <TabsContent value="documentos" className="space-y-6 mt-0">
          <DocumentsForm
            documentsCategories={documentsCategories}
            onCategoriesChange={onDocumentsCategoriesChange}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ClientFormTabs;
