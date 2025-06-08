
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
import { Settings } from "lucide-react";
import { Contact } from '@/types/client';
import { useCustomFields } from '@/hooks/useCustomFields';
import CustomFieldRenderer from './CustomFieldRenderer';
import CustomFieldManager from './CustomFieldManager';
import { CustomFieldWithValue } from '@/types/customFields';

interface EditClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContact: Contact | null;
  editContactData: Partial<Contact>;
  setEditContactData: (contact: Partial<Contact>) => void;
  handleEditContact: () => void;
}

const EditClientDialog = ({
  isOpen,
  onOpenChange,
  selectedContact,
  editContactData,
  setEditContactData,
  handleEditContact,
}: EditClientDialogProps) => {
  const { getCustomFieldsWithValues, saveClientCustomValues } = useCustomFields();
  const [customFieldsWithValues, setCustomFieldsWithValues] = useState<CustomFieldWithValue[]>([]);
  const [customValues, setCustomValues] = useState<{ [fieldId: string]: any }>({});
  const [showFieldManager, setShowFieldManager] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedContact && isOpen) {
      loadCustomFields();
    }
  }, [selectedContact, isOpen]);

  const loadCustomFields = async () => {
    if (!selectedContact) return;
    
    try {
      setLoading(true);
      const fieldsWithValues = await getCustomFieldsWithValues(parseInt(selectedContact.id));
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
      
      // Save custom field values
      await saveClientCustomValues(parseInt(selectedContact.id), customValues);
      
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
  };

  if (!selectedContact) return null;

  if (showFieldManager) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurar Campos Personalizados</DialogTitle>
            <DialogDescription>
              Gerencie os campos personalizados para clientes.
            </DialogDescription>
          </DialogHeader>
          <CustomFieldManager onClose={() => setShowFieldManager(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Editar Cliente
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFieldManager(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configurar Campos
            </Button>
          </DialogTitle>
          <DialogDescription>
            Atualize as informações de {selectedContact.name}.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="custom">Campos Personalizados</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="edit-name"
                  value={editContactData.name || ''}
                  onChange={(e) => setEditContactData({...editContactData, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Telefone
                </Label>
                <Input
                  id="edit-phone"
                  value={editContactData.phone || ''}
                  onChange={(e) => setEditContactData({...editContactData, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editContactData.email || ''}
                  onChange={(e) => setEditContactData({...editContactData, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cpfCnpj" className="text-right">
                  CPF/CNPJ
                </Label>
                <Input
                  id="edit-cpfCnpj"
                  value={editContactData.cpfCnpj || ''}
                  onChange={(e) => setEditContactData({...editContactData, cpfCnpj: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-asaasId" className="text-right">
                  ID Asaas
                </Label>
                <Input
                  id="edit-asaasId"
                  value={editContactData.asaasCustomerId || ''}
                  onChange={(e) => setEditContactData({...editContactData, asaasCustomerId: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Endereço
                </Label>
                <Input
                  id="edit-address"
                  value={editContactData.address || ''}
                  onChange={(e) => setEditContactData({...editContactData, address: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-clientName" className="text-right">
                  Nome do Cliente
                </Label>
                <Input
                  id="edit-clientName"
                  value={editContactData.clientName || ''}
                  onChange={(e) => setEditContactData({...editContactData, clientName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-clientType" className="text-right">
                  Tipo do Cliente
                </Label>
                <Input
                  id="edit-clientType"
                  value={editContactData.clientType || ''}
                  onChange={(e) => setEditContactData({...editContactData, clientType: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-clientSize" className="text-right">
                  Tamanho do Cliente
                </Label>
                <Select
                  value={editContactData.clientSize || ''}
                  onValueChange={(value) => setEditContactData({...editContactData, clientSize: value})}
                >
                  <SelectTrigger id="edit-clientSize" className="col-span-3">
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pequeno">Pequeno</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="grande">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-notes" className="text-right mt-2">
                Observações
              </Label>
              <Textarea
                id="edit-notes"
                value={editContactData.notes || ''}
                onChange={(e) => setEditContactData({...editContactData, notes: e.target.value})}
                className="col-span-3"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Carregando campos personalizados...</div>
            ) : customFieldsWithValues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customFieldsWithValues.map((field) => (
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
                <Button
                  variant="outline"
                  onClick={() => setShowFieldManager(true)}
                  className="mt-2"
                >
                  Criar Primeiro Campo
                </Button>
              </div>
            )}
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
