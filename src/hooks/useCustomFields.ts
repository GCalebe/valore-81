
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CustomField, ClientCustomValue, CustomFieldWithValue } from '@/types/customFields';

export const useCustomFields = () => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomFields = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .order('field_name');

      if (error) throw error;
      setCustomFields(data || []);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      toast({
        title: "Erro ao carregar campos personalizados",
        description: "Não foi possível carregar os campos personalizados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCustomField = async (field: Omit<CustomField, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('custom_fields')
        .insert([field])
        .select()
        .single();

      if (error) throw error;

      await fetchCustomFields();
      toast({
        title: "Campo criado",
        description: `Campo "${field.field_name}" foi criado com sucesso.`
      });

      return data;
    } catch (error) {
      console.error('Error creating custom field:', error);
      toast({
        title: "Erro ao criar campo",
        description: "Não foi possível criar o campo personalizado.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCustomField = async (id: string, updates: Partial<CustomField>) => {
    try {
      const { error } = await supabase
        .from('custom_fields')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchCustomFields();
      toast({
        title: "Campo atualizado",
        description: "Campo personalizado foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error updating custom field:', error);
      toast({
        title: "Erro ao atualizar campo",
        description: "Não foi possível atualizar o campo personalizado.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCustomField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCustomFields();
      toast({
        title: "Campo removido",
        description: "Campo personalizado foi removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting custom field:', error);
      toast({
        title: "Erro ao remover campo",
        description: "Não foi possível remover o campo personalizado.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getClientCustomValues = async (clientId: number): Promise<ClientCustomValue[]> => {
    try {
      const { data, error } = await supabase
        .from('client_custom_values')
        .select('*')
        .eq('client_id', clientId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching client custom values:', error);
      return [];
    }
  };

  const saveClientCustomValues = async (clientId: number, values: { [fieldId: string]: any }) => {
    try {
      // Delete existing values for this client
      await supabase
        .from('client_custom_values')
        .delete()
        .eq('client_id', clientId);

      // Insert new values
      const valuesToInsert = Object.entries(values)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([fieldId, value]) => ({
          client_id: clientId,
          field_id: fieldId,
          field_value: value
        }));

      if (valuesToInsert.length > 0) {
        const { error } = await supabase
          .from('client_custom_values')
          .insert(valuesToInsert);

        if (error) throw error;
      }

      toast({
        title: "Campos salvos",
        description: "Campos personalizados foram salvos com sucesso."
      });
    } catch (error) {
      console.error('Error saving client custom values:', error);
      toast({
        title: "Erro ao salvar campos",
        description: "Não foi possível salvar os campos personalizados.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getCustomFieldsWithValues = async (clientId: number): Promise<CustomFieldWithValue[]> => {
    const values = await getClientCustomValues(clientId);
    const valuesMap = values.reduce((acc, val) => {
      acc[val.field_id] = val.field_value;
      return acc;
    }, {} as { [key: string]: any });

    return customFields.map(field => ({
      ...field,
      value: valuesMap[field.id] || null
    }));
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

  return {
    customFields,
    loading,
    createCustomField,
    updateCustomField,
    deleteCustomField,
    getClientCustomValues,
    saveClientCustomValues,
    getCustomFieldsWithValues,
    fetchCustomFields
  };
};
