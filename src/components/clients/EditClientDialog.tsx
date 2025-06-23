
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact } from '@/types/client';
import { useCustomFields } from '@/hooks/useCustomFields';
import ConsultationStageSelector from './ConsultationStageSelector';
import TagsManager from './TagsManager';
import { CustomFieldWithValue } from '@/types/customFields';
import PrincipalTab from './ClientFormTabs/PrincipalTab';
import UTMTab from './ClientFormTabs/UTMTab';
import MediaTab from './ClientFormTabs/MediaTab';
import ProductsTab from './ClientFormTabs/ProductsTab';

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
        setCustomFieldsWithValues(customFields);
        
        const values = customFields.reduce((acc, field) => {
          acc[field.id] = field.value;
          return acc;
        }, {} as { [fieldId: string]: any });
        setCustomValues(values);
      } else {
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
      await handleEditContact();
      
      if (onSaveCustomFields) {
        const customValuesArray = Object.entries(customValues).map(([fieldId, value]) => ({
          fieldId,
          value
        }));
        await onSaveCustomFields(selectedContact.id, customValuesArray);
      } else if (displayConfig.showCustomFields) {
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
            <PrincipalTab 
              editContactData={editContactData}
              setEditContactData={setEditContactData}
            />
          </TabsContent>

          <TabsContent value="utm" className="space-y-4">
            <UTMTab contactId={selectedContact?.id} />
          </TabsContent>

          <TabsContent value="midia" className="space-y-4">
            <MediaTab />
          </TabsContent>

          <TabsContent value="produtos" className="space-y-4">
            <ProductsTab />
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
