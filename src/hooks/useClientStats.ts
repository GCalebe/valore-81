
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useClientStats() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalMarketingClients: 0,
    newClientsThisMonth: 0,
    monthlyGrowth: [],
    clientTypes: [],
    recentClients: [],
    isStale: false,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refetchStats = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching client statistics with optimized function...');
      
      const [metricsResult, recentClientsResult] = await Promise.all([
        supabase.rpc('get_dashboard_metrics'),
        supabase
          .from('dados_cliente')
          .select('id, nome, telefone, client_name, created_at, kanban_stage')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);
      
      const { data: metricsData, error: metricsError } = metricsResult;
      const { data: recentClientsData, error: recentClientsError } = recentClientsResult;
      
      if (metricsError || recentClientsError) {
        if (metricsError) console.error('Error fetching dashboard metrics via RPC:', metricsError);
        if (recentClientsError) console.error('Error fetching recent clients:', recentClientsError);
        throw metricsError || recentClientsError;
      }

      const recentClients = recentClientsData?.map(client => ({
        id: client.id,
        name: client.nome || 'Cliente sem nome',
        phone: client.telefone || 'Não informado',
        marketingClients: client.client_name ? 1 : 0,
        lastVisit: client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'Data não disponível',
        status: client.kanban_stage || 'Entraram'
      })) || [];

      const colors = [
        '#8B5CF6', '#EC4899', '#10B981', '#3B82F6',
        '#F59E0B', '#EF4444', '#6366F1', '#14B8A6',
        '#F97316', '#8B5CF6', '#06B6D4', '#D946EF'
      ];
      
      const clientTypesWithColors = (metricsData.clientTypes || []).map((type: { name: string; value: number }, index: number) => ({
        ...type,
        color: colors[index % colors.length]
      }));

      setStats({
        totalClients: metricsData.totalClients,
        totalMarketingClients: metricsData.totalMarketingClients,
        newClientsThisMonth: metricsData.newClientsThisMonth,
        monthlyGrowth: metricsData.monthlyGrowth,
        clientTypes: clientTypesWithColors,
        recentClients,
        isStale: false,
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Erro ao atualizar estatísticas",
        description: "Ocorreu um erro ao buscar os dados. Os dados podem estar desatualizados.",
        variant: "destructive"
      });
      setStats(prev => ({ ...prev, isStale: true }));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { stats, loading, refetchStats };
}
