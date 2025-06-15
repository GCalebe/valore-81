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
      
      // Reset form
      setCustomValues({});
      setValidationErrors({});
      setActiveTab('basico');
      
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
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
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
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

          <TabsContent value="basico" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              {/* Coluna 2 - Dados da Empresa */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Dados da Empresa</h3>
                
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

                <div>
                  <Label htmlFor="clientSize">Porte da Empresa</Label>
                  <Select
                    value={newContact.clientSize || ''}
                    onValueChange={(value) => handleInputChange('clientSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o porte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">Microempresa</SelectItem>
                      <SelectItem value="pequeno">Pequeno Porte</SelectItem>
                      <SelectItem value="medio">Médio Porte</SelectItem>
                      <SelectItem value="grande">Grande Porte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="responsibleUser">Usuário Responsável</Label>
                  <Input
                    id="responsibleUser"
                    value={newContact.responsibleUser || ''}
                    onChange={(e) => handleInputChange('responsibleUser', e.target.value)}
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="notes">Observações Iniciais</Label>
              <Textarea
                id="notes"
                value={newContact.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Adicione observações importantes sobre o cliente..."
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="comercial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna 1 - Dados Comerciais */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Informações Comerciais</h3>
                
                <div>
                  <Label htmlFor="clientSector">Setor de Atuação</Label>
                  <Select
                    value={newContact.clientSector || ''}
                    onValueChange={(value) => handleInputChange('clientSector', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nautico">Náutico</SelectItem>
                      <SelectItem value="turismo">Turismo</SelectItem>
                      <SelectItem value="pesca">Pesca</SelectItem>
                      <SelectItem value="transporte">Transporte Marítimo</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
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

              {/* Coluna 2 - Preferências de Pagamento */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Preferências de Pagamento</h3>
                
                <div>
                  <Label htmlFor="paymentMethod">Método de Pagamento Preferido</Label>
                  <Select
                    value={newContact.paymentMethod || ''}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="boleto">Boleto Bancário</SelectItem>
                      <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="asaasId">ID Asaas</Label>
                  <Input
                    id="asaasId"
                    value={newContact.asaasCustomerId || ''}
                    onChange={(e) => handleInputChange('asaasCustomerId', e.target.value)}
                    placeholder="ID do cliente no Asaas"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="personalizados" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Campos Personalizados</h3>
              {loading ? (
                <div className="text-center py-8">Carregando campos personalizados...</div>
              ) : customFields.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <p className="text-sm mt-2">Configure campos personalizados na aba "Mais Informações" da edição de clientes.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <h3 className="text-lg font-medium mb-4">Upload de Documentos</h3>
              <p className="mb-4">Adicione documentos importantes do cliente</p>
              <Button variant="outline" className="mb-4">
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Arquivos
              </Button>
              <p className="text-sm text-gray-400">
                Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 5MB por arquivo)
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center pt-6 border-t">
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
