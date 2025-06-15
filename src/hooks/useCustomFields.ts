
import { useState } from 'react';
import { CustomField, ClientCustomValue, CustomFieldWithValue } from '@/types/customFields';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useCustomFields() {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomFields = async () => {
    try {
      setLoading(true);
      
      // Para agora, vamos usar campos mock até implementar a tabela no Supabase
      const mockFields: CustomField[] = [
        {
          id: '1',
          field_name: 'Indicação',
          field_type: 'single_select',
          field_options: ['Indicação de cliente', 'Google Ads', 'Facebook', 'Instagram', 'Site', 'Outros'],
          is_required: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          field_name: 'Tipo de Embarcação',
          field_type: 'single_select',
          field_options: ['Lancha', 'Veleiro', 'Iate', 'Jet Ski', 'Barco de Pesca', 'Catamarã'],
          is_required: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          field_name: 'Experiência Náutica',
          field_type: 'single_select',
          field_options: ['Iniciante', 'Intermediário', 'Avançado', 'Profissional'],
          is_required: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '4',
          field_name: 'Observações Especiais',
          field_type: 'text',
          field_options: null,
          is_required: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      
      setCustomFields(mockFields);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      toast({
        title: "Erro ao carregar campos",
        description: "Não foi possível carregar os campos personalizados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomField = async (field: Omit<CustomField, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // TODO: Implementar quando a tabela custom_fields for criada no Supabase
      const newField: CustomField = {
        ...field,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setCustomFields(prev => [...prev, newField]);
      
      toast({
        title: "Campo adicionado",
        description: `Campo "${field.field_name}" foi criado com sucesso.`,
      });
    } catch (error) {
      console.error('Error creating field:', error);
      toast({
        title: "Erro ao criar campo",
        description: "Não foi possível criar o campo personalizado.",
        variant: "destructive"
      });
    }
  };

  const createCustomField = async (field: Omit<CustomField, 'id' | 'created_at' | 'updated_at'>) => {
    return addCustomField(field);
  };

  const updateCustomField = async (id: string, field: Partial<CustomField>) => {
    try {
      setCustomFields(prev => prev.map(f => 
        f.id === id 
          ? { ...f, ...field, updated_at: new Date().toISOString() }
          : f
      ));
      
      toast({
        title: "Campo atualizado",
        description: "Campo personalizado foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Erro ao atualizar campo",
        description: "Não foi possível atualizar o campo personalizado.",
        variant: "destructive"
      });
    }
  };

  const deleteCustomField = async (id: string) => {
    try {
      setCustomFields(prev => prev.filter(f => f.id !== id));
      
      toast({
        title: "Campo removido",
        description: "Campo personalizado foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting field:', error);
      toast({
        title: "Erro ao remover campo",
        description: "Não foi possível remover o campo personalizado.",
        variant: "destructive"
      });
    }
  };

  const fetchClientCustomValues = async (clientId: number) => {
    try {
      // TODO: Implementar quando a tabela client_custom_values for criada
      return [];
    } catch (error) {
      console.error('Error fetching client custom values:', error);
      return [];
    }
  };

  const getCustomFieldsWithValues = async (clientId: number): Promise<CustomFieldWithValue[]> => {
    try {
      const fields = customFields.length > 0 ? customFields : [];
      // TODO: Buscar valores salvos do cliente específico
      return fields.map(field => ({
        ...field,
        value: null // Por enquanto null, depois implementar busca real
      }));
    } catch (error) {
      console.error('Error getting custom fields with values:', error);
      return [];
    }
  };

  const saveClientCustomValues = async (clientId: number, values: { fieldId: string; value: any }[]) => {
    try {
      // TODO: Implementar salvamento no Supabase
      console.log('Saving custom values for client:', clientId, values);
      
      toast({
        title: "Valores salvos",
        description: "Campos personalizados foram salvos com sucesso.",
      });
    } catch (error) {
      console.error('Error saving custom values:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os campos personalizados.",
        variant: "destructive"
      });
    }
  };

  return {
    customFields,
    loading,
    fetchCustomFields,
    addCustomField,
    createCustomField,
    updateCustomField,
    deleteCustomField,
    fetchClientCustomValues,
    getCustomFieldsWithValues,
    saveClientCustomValues
  };
}
