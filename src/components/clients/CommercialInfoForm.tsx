import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Contact } from "@/types/client";
import ClientFormValidation from "./ClientFormValidation";
import DynamicCategoryManager, {
  DynamicCategory,
} from "./DynamicCategoryManager";

interface CommercialInfoFormProps {
  newContact: Partial<Contact>;
  validationErrors: { [key: string]: string };
  commercialCategories: DynamicCategory[];
  onInputChange: (field: keyof Contact, value: any) => void;
  onCategoriesChange: (categories: DynamicCategory[]) => void;
}

const CommercialInfoForm = ({
  newContact,
  validationErrors,
  commercialCategories,
  onInputChange,
  onCategoriesChange,
}: CommercialInfoFormProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Coluna 1 - Dados Comerciais */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
          Informações Comerciais
        </h3>

        <div>
          <Label
            htmlFor="clientName"
            className="text-gray-700 dark:text-gray-300"
          >
            Nome da Empresa
          </Label>
          <Input
            id="clientName"
            value={newContact.clientName || ""}
            onChange={(e) => onInputChange("clientName", e.target.value)}
            placeholder="Nome da empresa"
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>

        <ClientFormValidation errors={validationErrors} fieldName="cpfCnpj">
          <Label htmlFor="cpfCnpj" className="text-gray-700 dark:text-gray-300">
            CPF/CNPJ
          </Label>
          <Input
            id="cpfCnpj"
            value={newContact.cpfCnpj || ""}
            onChange={(e) => onInputChange("cpfCnpj", e.target.value)}
            placeholder="000.000.000-00 ou 00.000.000/0001-00"
            className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
              validationErrors.cpfCnpj
                ? "border-red-500 focus:border-red-500"
                : ""
            }`}
          />
        </ClientFormValidation>

        <div>
          <Label
            htmlFor="clientType"
            className="text-gray-700 dark:text-gray-300"
          >
            Tipo de Cliente
          </Label>
          <Select
            value={newContact.clientType || ""}
            onValueChange={(value) => onInputChange("clientType", value)}
          >
            <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectItem
                value="pessoa-fisica"
                className="text-gray-900 dark:text-white"
              >
                Pessoa Física
              </SelectItem>
              <SelectItem
                value="pessoa-juridica"
                className="text-gray-900 dark:text-white"
              >
                Pessoa Jurídica
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ClientFormValidation errors={validationErrors} fieldName="budget">
          <Label htmlFor="budget" className="text-gray-700 dark:text-gray-300">
            Orçamento Estimado
          </Label>
          <Input
            id="budget"
            type="number"
            value={newContact.budget || ""}
            onChange={(e) =>
              onInputChange("budget", parseFloat(e.target.value) || 0)
            }
            placeholder="R$ 0,00"
            className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
              validationErrors.budget
                ? "border-red-500 focus:border-red-500"
                : ""
            }`}
          />
        </ClientFormValidation>

        <div>
          <Label
            htmlFor="clientObjective"
            className="text-gray-700 dark:text-gray-300"
          >
            Objetivo do Cliente
          </Label>
          <Textarea
            id="clientObjective"
            value={newContact.clientObjective || ""}
            onChange={(e) => onInputChange("clientObjective", e.target.value)}
            placeholder="Descreva o objetivo do cliente..."
            rows={3}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Coluna 2 - Categorias Dinâmicas */}
      <div className="space-y-4">
        <DynamicCategoryManager
          tabName="Comercial"
          categories={commercialCategories}
          onCategoriesChange={onCategoriesChange}
        />
      </div>
    </div>
  );
};

export default CommercialInfoForm;
