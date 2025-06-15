
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Upload, AlertCircle } from 'lucide-react';
import { Contact } from '@/types/client';
import { useCustomFields } from '@/hooks/useCustomFields';
import CustomFieldRenderer from './CustomFieldRenderer';
import DynamicCategoryManager, { DynamicCategory } from './DynamicCategoryManager';
import TagsManager from './TagsManager';
import ConsultationStageSelector from './ConsultationStageSelector';
import ClientFormValidation, { validateClientForm } from './ClientFormValidation';
import { toast } from '@/hooks/use-toast';

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
  const [personalizedCategories, setPersonalizedCategories] = useState<DynamicCategory[]>([]);
  const [documentsCategories, setDocumentsCategories] = useState<DynamicCategory[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadCustomFields();
    }
  }, [isOpen]);

  const loadCustomFields = async () => {
    try {
      setLoading(true);
      await fetchCustomFields();
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
      setPersonalizedCategories([]);
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-9 bg-green-500 hover:bg-green-600 text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed inset-4 max-w-none max-h-none w-auto h-auto flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-green-500" />
            Adicionar Novo Cliente Náutico
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para adicionar um novo cliente náutico ao seu CRM.
          </DialogDescription>
        </DialogHeader>

        {/* Indicador de erros globais */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Corrija os seguintes erros:</span>
            </div>
            <ul className="list-disc list-inside text-sm text-red-600 mt-2">
              {Object.values(validationErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags Section */}
        <div className="flex-shrink-0">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            ADICIONAR TAGS
          </Label>
          <TagsManager
            tags={newContact.tags || []}
            onChange={(tags) => handleInputChange('tags', tags)}
          />
        </div>

        {/* Consultation Stage Section */}
        <div className="flex-shrink-0 mb-4">
          <ConsultationStageSelector
            value={newContact.consultationStage || 'Nova consulta'}
            onChange={(stage) => handleInputChange('consultationStage', stage)}
          />
        </div>

        {/* Main content with fixed height and scroll */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
              <TabsTrigger value="basico" className="flex items-center gap-2">
                Informações Básicas
                {(validationErrors.name || validationErrors.phone || validationErrors.email) && (
                  <AlertCircle className="h-3 w-3 text-red-500" />
                )}
              </TabsTrigger>
              <TabsTrigger value="comercial" className="flex items-center gap-2">
                Dados Comerciais
                {(validationErrors.budget || validationErrors.cpfCnpj) && (
                  <AlertCircle className="h-3 w-3 text-red-500" />
                )}
              </TabsTrigger>
              <TabsTrigger value="personalizados">Campos Personalizados</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden mt-4">
              <TabsContent value="basico" className="h-full overflow-y-auto space-y-4 m-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Coluna 1 - Dados Pessoais */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Dados Pessoais</h3>
                    
                    <ClientFormValidation errors={validationErrors} fieldName="name">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={newContact.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Digite o nome completo"
                        className={validationErrors.name ? 'border-red-500 focus:border-red-500' : ''}
                      />
                    </ClientFormValidation>

                    <ClientFormValidation errors={validationErrors} fieldName="email">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newContact.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@exemplo.com"
                        className={validationErrors.email ? 'border-red-500 focus:border-red-500' : ''}
                      />
                    </ClientFormValidation>

                    <ClientFormValidation errors={validationErrors} fieldName="phone">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        value={newContact.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        className={validationErrors.phone ? 'border-red-500 focus:border-red-500' : ''}
                      />
                    </ClientFormValidation>

                    <div>
                      <Label htmlFor="address">Endereço</Label>
                      <Textarea
                        id="address"
                        value={newContact.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Rua, número, bairro, cidade"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Observações Iniciais</Label>
                      <Textarea
                        id="notes"
                        value={newContact.notes || ''}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Adicione observações importantes sobre o cliente..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Coluna 2 - Categorias Dinâmicas */}
                  <div className="space-y-4 h-full">
                    <DynamicCategoryManager
                      tabName="Básica"
                      categories={basicCategories}
                      onCategoriesChange={setBasicCategories}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comercial" className="h-full overflow-y-auto space-y-4 m-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Coluna 1 - Dados Comerciais */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Informações Comerciais</h3>
                    
                    <div>
                      <Label htmlFor="clientName">Nome da Empresa</Label>
                      <Input
                        id="clientName"
                        value={newContact.clientName || ''}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        placeholder="Nome da empresa"
                      />
                    </div>

                    <ClientFormValidation errors={validationErrors} fieldName="cpfCnpj">
                      <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                      <Input
                        id="cpfCnpj"
                        value={newContact.cpfCnpj || ''}
                        onChange={(e) => handleInputChange('cpfCnpj', e.target.value)}
                        placeholder="000.000.000-00 ou 00.000.000/0001-00"
                        className={validationErrors.cpfCnpj ? 'border-red-500 focus:border-red-500' : ''}
                      />
                    </ClientFormValidation>

                    <div>
                      <Label htmlFor="clientType">Tipo de Cliente</Label>
                      <Select
                        value={newContact.clientType || ''}
                        onValueChange={(value) => handleInputChange('clientType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pessoa-fisica">Pessoa Física</SelectItem>
                          <SelectItem value="pessoa-juridica">Pessoa Jurídica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <ClientFormValidation errors={validationErrors} fieldName="budget">
                      <Label htmlFor="budget">Orçamento Estimado</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={newContact.budget || ''}
                        onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                        placeholder="R$ 0,00"
                        className={validationErrors.budget ? 'border-red-500 focus:border-red-500' : ''}
                      />
                    </ClientFormValidation>

                    <div>
                      <Label htmlFor="clientObjective">Objetivo do Cliente</Label>
                      <Textarea
                        id="clientObjective"
                        value={newContact.clientObjective || ''}
                        onChange={(e) => handleInputChange('clientObjective', e.target.value)}
                        placeholder="Descreva o objetivo do cliente..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Coluna 2 - Categorias Dinâmicas */}
                  <div className="space-y-4 h-full">
                    <DynamicCategoryManager
                      tabName="Comercial"
                      categories={commercialCategories}
                      onCategoriesChange={setCommercialCategories}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="personalizados" className="h-full overflow-y-auto space-y-4 m-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Coluna 1 - Campos Personalizados Existentes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Campos Personalizados</h3>
                    {loading ? (
                      <div className="text-center py-8">Carregando campos personalizados...</div>
                    ) : customFields.length > 0 ? (
                      <div className="space-y-4">
                        {customFields.map((field) => (
                          <CustomFieldRenderer
                            key={field.id}
                            field={field}
                            value={customValues[field.id]}
                            onChange={(value) => handleCustomFieldChange(field.id, value)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhum campo personalizado configurado.</p>
                        <p className="text-sm mt-2">Use as categorias dinâmicas ao lado para criar novos campos.</p>
                      </div>
                    )}
                  </div>

                  {/* Coluna 2 - Categorias Dinâmicas */}
                  <div className="space-y-4 h-full">
                    <DynamicCategoryManager
                      tabName="Personalizada"
                      categories={personalizedCategories}
                      onCategoriesChange={setPersonalizedCategories}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documentos" className="h-full overflow-y-auto space-y-4 m-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Coluna 1 - Upload de Documentos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Upload de Documentos</h3>
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-4">Adicione documentos importantes do cliente</p>
                      <Button variant="outline" className="mb-4">
                        <Upload className="h-4 w-4 mr-2" />
                        Selecionar Arquivos
                      </Button>
                      <p className="text-sm text-gray-400">
                        Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 5MB por arquivo)
                      </p>
                    </div>
                  </div>

                  {/* Coluna 2 - Categorias Dinâmicas */}
                  <div className="space-y-4 h-full">
                    <DynamicCategoryManager
                      tabName="Documentos"
                      categories={documentsCategories}
                      onCategoriesChange={setDocumentsCategories}
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between items-center pt-4 border-t flex-shrink-0">
          <div className="text-sm text-gray-500">
            * Campos obrigatórios
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600"
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
