import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import { Contact } from '@/types/client';
import { useCustomFields } from '@/hooks/useCustomFields';
import CustomFieldRenderer from './CustomFieldRenderer';
import CustomFieldManager from './CustomFieldManager';
import ConsultationStageSelector from './ConsultationStageSelector';
import TagsManager from './TagsManager';
import ClientUTMData from './ClientUTMData';
import { CustomFieldWithValue } from '@/types/customFields';
import { formatCurrency } from '@/utils/formatters';

interface EditClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContact: Contact | null;
  editContactData: Partial<Contact>;
  setEditContactData: (contact: Partial<Contact>) => void;
  handleEditContact: () => void;
  customFields?: CustomFieldWithValue[];
  loadingCustomFields?: boolean;
  onSaveCustomFields?: (contactId: string, customValues: { fieldId: string, value: any }[]) => Promise<void>;
  displayConfig?: {
    showTags: boolean;
    showConsultationStage: boolean;
    showCommercialInfo: boolean;
    showCustomFields: boolean;
  };
}

const EditClientDialog = ({
  isOpen,
  onOpenChange,
  selectedContact,
  editContactData,
  setEditContactData,
  handleEditContact,
  customFields,
  loadingCustomFields,
  onSaveCustomFields,
  displayConfig = {
    showTags: true,
    showConsultationStage: true,
    showCommercialInfo: true,
    showCustomFields: true
  }
}: EditClientDialogProps) => {
  const { getCustomFieldsWithValues, saveClientCustomValues } = useCustomFields();
  const [customFieldsWithValues, setCustomFieldsWithValues] = useState<CustomFieldWithValue[]>(customFields || []);
  const [customValues, setCustomValues] = useState<{ [fieldId: string]: any }>({});
  const [loading, setLoading] = useState(loadingCustomFields || false);
  const [validationErrors, setValidationErrors] = useState<{ [fieldId: string]: string }>({});

  useEffect(() => {
    if (selectedContact && isOpen) {
      if (customFields) {
        // Se os campos personalizados foram fornecidos como props, use-os
        setCustomFieldsWithValues(customFields);
        
        const values = customFields.reduce((acc, field) => {
          acc[field.id] = field.value;
          return acc;
        }, {} as { [fieldId: string]: any });
        setCustomValues(values);
      } else {
        // Caso contrário, carregue-os usando o hook
        loadCustomFields();
      }
    }
  }, [selectedContact, isOpen, customFields]);

  const loadCustomFields = async () => {
    if (!selectedContact) return;
    
    try {
      setLoading(true);
      const fieldsWithValues = await getCustomFieldsWithValues(selectedContact.id);
      setCustomFieldsWithValues(fieldsWithValues);
      
      const values = fieldsWithValues.reduce((acc, field) => {
        acc[field.id] = field.value;
        return acc;
      }, {} as { [fieldId: string]: any });
      setCustomValues(values);
    } catch (error) {
      console.error('Error loading custom fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedContact) return;

    try {
      // Save standard contact data
      await handleEditContact();
      
      // Salvar campos personalizados se a função for fornecida
      if (onSaveCustomFields) {
        const customValuesArray = Object.entries(customValues).map(([fieldId, value]) => ({
          fieldId,
          value
        }));
        await onSaveCustomFields(selectedContact.id, customValuesArray);
      } else if (displayConfig.showCustomFields) {
        // Fallback para o hook interno se nenhuma função for fornecida
        const customValuesArray = Object.entries(customValues).map(([fieldId, value]) => ({
          fieldId,
          value
        }));
        await saveClientCustomValues(selectedContact.id, customValuesArray);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  if (!selectedContact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Lead #{selectedContact.id} - {selectedContact.name}
          </DialogTitle>
        </DialogHeader>

        {/* Tags Section */}
        {displayConfig.showTags && (
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              ADICIONAR TAGS
            </Label>
            <TagsManager
              tags={editContactData.tags || []}
              onChange={(tags) => setEditContactData({ ...editContactData, tags })}
            />
          </div>
        )}

        {/* Consultation Stage Section */}
        {displayConfig.showConsultationStage && (
          <div className="mb-6">
            <ConsultationStageSelector
              value={editContactData.consultationStage || 'Nova consulta'}
              onChange={(stage) => setEditContactData({ 
                ...editContactData, 
                consultationStage: stage as Contact['consultationStage']
              })}
            />
          </div>
        )}

        <Tabs defaultValue="principal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="principal">Principal</TabsTrigger>
            <TabsTrigger value="utm">UTM</TabsTrigger>
            <TabsTrigger value="midia">Mídia</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
          </TabsList>

          <TabsContent value="principal" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Coluna 1 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="responsible-user">Usuário responsável</Label>
                  <Input
                    id="responsible-user"
                    value={editContactData.responsibleUser || ''}
                    onChange={(e) => setEditContactData({...editContactData, responsibleUser: e.target.value})}
                    placeholder="Gabriel Calebe"
                  />
                </div>

                <div>
                  <Label htmlFor="sales">Venda</Label>
                  <Input
                    id="sales"
                    type="number"
                    value={editContactData.sales || ''}
                    onChange={(e) => setEditContactData({...editContactData, sales: parseFloat(e.target.value)})}
                    placeholder="R$ 0"
                  />
                </div>

                <div>
                  <Label htmlFor="client-type">Tipo de cliente</Label>
                  <Select
                    value={editContactData.clientType || ''}
                    onValueChange={(value) => setEditContactData({...editContactData, clientType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pessoa-fisica">Pessoa Física</SelectItem>
                      <SelectItem value="pessoa-juridica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="client-sector">Setor do cliente</Label>
                  <Select
                    value={editContactData.clientSector || ''}
                    onValueChange={(value) => setEditContactData({...editContactData, clientSector: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="comercio">Comércio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Orçamento</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={editContactData.budget || ''}
                    onChange={(e) => setEditContactData({...editContactData, budget: parseFloat(e.target.value)})}
                    placeholder="R$ 0,00"
                  />
                  {editContactData.budget && (
                    <div className="text-sm text-gray-500 mt-1">
                      {formatCurrency(editContactData.budget)}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="payment-method">Método de pagamento</Label>
                  <Select
                    value={editContactData.paymentMethod || ''}
                    onValueChange={(value) => setEditContactData({...editContactData, paymentMethod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cartao">Cartão</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Coluna 2 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="client-objective">Objetivo do cliente</Label>
                  <Input
                    id="client-objective"
                    value={editContactData.clientObjective || ''}
                    onChange={(e) => setEditContactData({...editContactData, clientObjective: e.target.value})}
                    placeholder="..."
                  />
                </div>

                <div>
                  <Label htmlFor="loss-reason">Motivo de perda</Label>
                  <Select
                    value={editContactData.lossReason || ''}
                    onValueChange={(value) => setEditContactData({...editContactData, lossReason: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preco">Preço</SelectItem>
                      <SelectItem value="timing">Timing</SelectItem>
                      <SelectItem value="concorrencia">Concorrência</SelectItem>
                      <SelectItem value="orcamento">Orçamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contract-number">Número de contrato</Label>
                  <Input
                    id="contract-number"
                    value={editContactData.contractNumber || ''}
                    onChange={(e) => setEditContactData({...editContactData, contractNumber: e.target.value})}
                    placeholder="..."
                  />
                </div>

                <div>
                  <Label htmlFor="contract-date">Data de contrato</Label>
                  <Input
                    id="contract-date"
                    type="date"
                    value={editContactData.contractDate || ''}
                    onChange={(e) => setEditContactData({...editContactData, contractDate: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="payment">Pagamento</Label>
                  <Select
                    value={editContactData.payment || ''}
                    onValueChange={(value) => setEditContactData({...editContactData, payment: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="atrasado">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="file-upload">Arquivo</Label>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Fazer upload
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="utm" className="space-y-4">
            {selectedContact?.id ? (
              <ClientUTMData contactId={selectedContact.id} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <h3 className="text-lg font-medium mb-2">Dados UTM</h3>
                <p>Os dados UTM estarão disponíveis após salvar o cliente.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="midia" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <h3 className="text-lg font-medium mb-2">Mídia</h3>
              <p>Upload de imagens, vídeos ou documentos.</p>
              <Button className="mt-4">
                <Upload className="h-4 w-4 mr-2" />
                Upload de Mídia
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="produtos" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <h3 className="text-lg font-medium mb-2">Produtos</h3>
              <p>Informações sobre produtos e serviços oferecidos.</p>
            </div>
          </TabsContent>



        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
