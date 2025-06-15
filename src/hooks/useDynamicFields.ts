
import { useState, useEffect, useCallback } from 'react';
import { DynamicCategory } from '@/components/clients/DynamicCategoryManager';
import { supabase } from '@/integrations/supabase/client';

export function useDynamicFields(clientId: string | null) {
  const [dynamicFields, setDynamicFields] = useState<{
    basic: DynamicCategory[];
    commercial: DynamicCategory[];
    personalized: DynamicCategory[];
    documents: DynamicCategory[];
  }>({
    basic: [],
    commercial: [],
    personalized: [],
    documents: []
  });
  const [loading, setLoading] = useState(false);

  const fetchDynamicFields = useCallback(async (clientId: string) => {
    try {
      setLoading(true);
      
      // Por enquanto, vamos usar dados mock até implementar a persistência completa
      // Em uma implementação real, buscaríamos os dados salvos do cliente específico
      const mockFields = {
        basic: [
          {
            id: 'basic-1',
            name: 'Experiência Náutica',
            type: 'single_select' as const,
            options: ['Iniciante', 'Intermediário', 'Avançado', 'Profissional'],
            value: 'Intermediário'
          },
          {
            id: 'basic-2',
            name: 'Região de Interesse',
            type: 'text' as const,
            value: 'Litoral Norte - SP'
          }
        ],
        commercial: [
          {
            id: 'commercial-1',
            name: 'Tipo de Embarcação',
            type: 'single_select' as const,
            options: ['Lancha', 'Veleiro', 'Iate', 'Jet Ski', 'Barco de Pesca'],
            value: 'Lancha'
          },
          {
            id: 'commercial-2',
            name: 'Faixa de Preço',
            type: 'single_select' as const,
            options: ['Até R$ 100k', 'R$ 100k - R$ 500k', 'R$ 500k - R$ 1M', 'Acima de R$ 1M'],
            value: 'R$ 100k - R$ 500k'
          }
        ],
        personalized: [
          {
            id: 'personal-1',
            name: 'Atividades Preferidas',
            type: 'multi_select' as const,
            options: ['Pesca', 'Passeio', 'Esporte', 'Mergulho', 'Navegação'],
            value: ['Passeio', 'Pesca']
          }
        ],
        documents: [
          {
            id: 'doc-1',
            name: 'Documentos Enviados',
            type: 'multi_select' as const,
            options: ['RG', 'CPF', 'Comprovante de Renda', 'Habilitação Náutica'],
            value: ['RG', 'CPF']
          }
        ]
      };

      setDynamicFields(mockFields);
    } catch (error) {
      console.error('Error fetching dynamic fields:', error);
      // Reset to empty state on error
      setDynamicFields({
        basic: [],
        commercial: [],
        personalized: [],
        documents: []
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (clientId) {
      fetchDynamicFields(clientId);
    } else {
      setDynamicFields({
        basic: [],
        commercial: [],
        personalized: [],
        documents: []
      });
    }
  }, [clientId, fetchDynamicFields]);

  const updateField = useCallback((fieldId: string, newValue: any) => {
    setDynamicFields(prev => {
      const updated = { ...prev };
      
      // Find and update the field in the appropriate category
      Object.keys(updated).forEach(category => {
        const categoryFields = updated[category as keyof typeof updated];
        const fieldIndex = categoryFields.findIndex(field => field.id === fieldId);
        if (fieldIndex !== -1) {
          categoryFields[fieldIndex] = {
            ...categoryFields[fieldIndex],
            value: newValue
          };
        }
      });
      
      return updated;
    });
    
    // TODO: Implementar salvamento no banco de dados aqui
    console.log(`Updating field ${fieldId} with value:`, newValue);
  }, []);

  return { 
    dynamicFields, 
    loading, 
    refetch: () => clientId && fetchDynamicFields(clientId),
    updateField
  };
}
