import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Contact } from "@/types/client";
import ClientFormValidation from "./ClientFormValidation";
import DynamicCategoryManager, {
  DynamicCategory,
} from "./DynamicCategoryManager";

interface BasicInfoFormProps {
  newContact: Partial<Contact>;
  validationErrors: { [key: string]: string };
  basicCategories: DynamicCategory[];
  onInputChange: (field: keyof Contact, value: any) => void;
  onCategoriesChange: (categories: DynamicCategory[]) => void;
}

const BasicInfoForm = ({
  newContact,
  validationErrors,
  basicCategories,
  onInputChange,
  onCategoriesChange,
}: BasicInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Coluna 1 - Dados Pessoais */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
          Dados Pessoais
        </h3>

        <ClientFormValidation errors={validationErrors} fieldName="name">
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
            Nome Completo *
          </Label>
          <Input
            id="name"
            value={newContact.name || ""}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="Digite o nome completo"
            className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
              validationErrors.name ? "border-red-500 focus:border-red-500" : ""
            }`}
          />
        </ClientFormValidation>

        <ClientFormValidation errors={validationErrors} fieldName="email">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={newContact.email || ""}
            onChange={(e) => onInputChange("email", e.target.value)}
            placeholder="email@exemplo.com"
            className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
              validationErrors.email
                ? "border-red-500 focus:border-red-500"
                : ""
            }`}
          />
        </ClientFormValidation>

        <ClientFormValidation errors={validationErrors} fieldName="phone">
          <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
            Telefone *
          </Label>
          <Input
            id="phone"
            value={newContact.phone || ""}
            onChange={(e) => onInputChange("phone", e.target.value)}
            placeholder="(11) 99999-9999"
            className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
              validationErrors.phone
                ? "border-red-500 focus:border-red-500"
                : ""
            }`}
          />
        </ClientFormValidation>

        <div>
          <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
            Endereço
          </Label>
          <Textarea
            id="address"
            value={newContact.address || ""}
            onChange={(e) => onInputChange("address", e.target.value)}
            placeholder="Rua, número, bairro, cidade"
            rows={3}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>

        <div>
          <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">
            Observações Iniciais
          </Label>
          <Textarea
            id="notes"
            value={newContact.notes || ""}
            onChange={(e) => onInputChange("notes", e.target.value)}
            placeholder="Adicione observações importantes sobre o cliente..."
            rows={3}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Coluna 2 - Categorias Dinâmicas */}
      <div className="space-y-4">
        <DynamicCategoryManager
          tabName="Básica"
          categories={basicCategories}
          onCategoriesChange={onCategoriesChange}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
