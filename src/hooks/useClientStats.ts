
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockClientStats } from '@/mocks/metricsMock';

export function useClientStats() {
  const [stats, setStats] = useState(mockClientStats);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refetchStats = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Using mock data for client stats...');

      // Use mock data directly
      setStats(mockClientStats);

      console.log('Mock client stats loaded successfully');

    } catch (error) {
      console.error('Error loading client stats:', error);
      toast({
        title: "Erro ao atualizar estatísticas",
        description: "Problema ao buscar as estatísticas de clientes. Usando dados de exemplo.",
        variant: "destructive"
      });
      setStats(mockClientStats);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { stats, loading, refetchStats };
}
