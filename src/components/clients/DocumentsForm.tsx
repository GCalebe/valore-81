
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import DynamicCategoryManager, { DynamicCategory } from './DynamicCategoryManager';

interface DocumentsFormProps {
  documentsCategories: DynamicCategory[];
  onCategoriesChange: (categories: DynamicCategory[]) => void;
}

const DocumentsForm = ({ documentsCategories, onCategoriesChange }: DocumentsFormProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Coluna 1 - Upload de Documentos */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">Upload de Documentos</h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="mb-4">Adicione documentos importantes do cliente</p>
          <Button variant="outline" className="mb-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Upload className="h-4 w-4 mr-2" />
            Selecionar Arquivos
          </Button>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 5MB por arquivo)
          </p>
        </div>
      </div>

      {/* Coluna 2 - Categorias Dinâmicas */}
      <div className="space-y-4">
        <DynamicCategoryManager
          tabName="Documentos"
          categories={documentsCategories}
          onCategoriesChange={onCategoriesChange}
        />
      </div>
    </div>
  );
};

export default DocumentsForm;
