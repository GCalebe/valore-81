
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { Contact } from '@/types/client';
import { useCustomFields } from '@/hooks/useCustomFields';
import { DynamicCategory } from './DynamicCategoryManager';
import TagsManager from './TagsManager';
import ConsultationStageSelector from './ConsultationStageSelector';
import { validateClientForm } from './ClientFormValidation';
import { toast } from '@/hooks/use-toast';
import ClientFormHeader from './ClientFormHeader';
import ValidationErrorAlert from './ValidationErrorAlert';
import ClientFormTabs from './ClientFormTabs';

interface AddClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newContact: Partial<Contact>;
  setNewContact: (contact: Partial<Contact>) => void;
  handleAddContact: () => void;
}

const AddClientDialog = ({
  isOpen,
  onOpenChange,
  newContact,
  setNewContact,
  handleAddContact,
}: AddClientDialogProps) => {
  const { customFields, fetchCustomFields } = useCustomFields();
  const [customValues, setCustomValues] = useState<{ [fieldId: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState('basico');

  // State for dynamic categories per tab
  const [basicCategories, setBasicCategories] = useState<DynamicCategory[]>([]);
  const [commercialCategories, setCommercialCategories] = useState<DynamicCategory[]>([]);
  const [documentsCategories, setDocumentsCategories] = useState<DynamicCategory[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadCustomFields();
      console.log('AddClientDialog opened, loading custom fields');
    }
  }, [isOpen]);

  const loadCustomFields = async () => {
    try {
      setLoading(true);
      await fetchCustomFields();
      console.log('Custom fields loaded successfully');
    } catch (error) {
      console.error('Error loading custom fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const validation = validateClientForm(newContact);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      
      // Ir para a primeira aba que tem erro
      if (validation.errors.name || validation.errors.phone || validation.errors.email) {
        setActiveTab('basico');
      } else if (validation.errors.budget || validation.errors.cpfCnpj) {
        setActiveTab('comercial');
      }
      
      toast({
        title: "Dados inválidos",
        description: "Por favor, corrija os erros destacados no formulário.",
        variant: "destructive"
      });
      
      return;
    }

    try {
      await handleAddContact();
      
      // Reset form and categories
      setCustomValues({});
      setValidationErrors({});
      setActiveTab('basico');
      setBasicCategories([]);
      setCommercialCategories([]);
      setDocumentsCategories([]);
      
      toast({
        title: "Cliente adicionado",
        description: "Cliente foi adicionado com sucesso ao sistema.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o cliente. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleInputChange = (field: keyof Contact, value: any) => {
    setNewContact({ ...newContact, [field]: value });
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  console.log('AddClientDialog render - isOpen:', isOpen, 'activeTab:', activeTab);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-9 bg-green-500 hover:bg-green-600 text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[1400px] h-[95vh] max-h-none overflow-hidden bg-white dark:bg-gray-800 border shadow-lg">
        <ClientFormHeader />

        <div className="flex-1 overflow-y-auto">
          <ValidationErrorAlert errors={validationErrors} />

          {/* Tags Section */}
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              ADICIONAR TAGS
            </Label>
            <TagsManager
              tags={newContact.tags || []}
              onChange={(tags) => handleInputChange('tags', tags)}
            />
          </div>

          {/* Consultation Stage Section */}
          <div className="mb-6">
            <ConsultationStageSelector
              value={newContact.consultationStage || 'Nova consulta'}
              onChange={(stage) => handleInputChange('consultationStage', stage)}
            />
          </div>

          {/* Main content with tabs */}
          <ClientFormTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            newContact={newContact}
            validationErrors={validationErrors}
            basicCategories={basicCategories}
            commercialCategories={commercialCategories}
            documentsCategories={documentsCategories}
            onInputChange={handleInputChange}
            onBasicCategoriesChange={setBasicCategories}
            onCommercialCategoriesChange={setCommercialCategories}
            onDocumentsCategoriesChange={setDocumentsCategories}
          />
        </div>

        <DialogFooter className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600 flex-shrink-0 mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            * Campos obrigatórios
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Adicionar Cliente
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
