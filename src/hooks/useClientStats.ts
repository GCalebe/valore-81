
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

  const zeroStats = {
    totalClients: 0,
    totalMarketingClients: 0,
    newClientsThisMonth: 0,
    monthlyGrowth: [],
    clientTypes: [],
    recentClients: [],
    isStale: true,
  };

  const refetchStats = useCallback(async () => {
    let partialStats = { ...zeroStats };
    let anyError = false;
    try {
      setLoading(true);
      console.log('Fetching real client statistics from dados_cliente table...');
      
      // Fetch total clients
      let totalClients = 0;
      try {
        const { count: total, error } = await supabase
          .from('dados_cliente')
          .select('*', { count: 'exact' });
        if (error) throw error;
        totalClients = total || 0;
        partialStats.totalClients = totalClients;
      } catch (error) {
        anyError = true;
        console.error('Error fetching total clients:', error);
        toast({
          title: "Erro de conexão",
          description: "Não foi possível carregar os clientes. Verifique sua conexão ou tente novamente mais tarde.",
          variant: "destructive"
        });
      }

      // Fetch total marketing clients
      let totalMarketingClients = 0;
      try {
        const { count: marketingCount, error } = await supabase
          .from('dados_cliente')
          .select('*', { count: 'exact' })
          .not('client_name', 'is', null)
          .neq('client_name', '');
        if (error) throw error;
        totalMarketingClients = marketingCount || 0;
        partialStats.totalMarketingClients = totalMarketingClients;
      } catch (error) {
        anyError = true;
        console.error('Error fetching marketing clients:', error);
        // Not showing toast here to avoid spam; already shown for previous error if present
      }

      // Fetch new clients this month
      let newClientsThisMonth = 0;
      try {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const { count, error } = await supabase
          .from('dados_cliente')
          .select('*', { count: 'exact' })
          .gte('created_at', firstDayOfMonth.toISOString())
          .lte('created_at', today.toISOString());
        if (error) throw error;
        newClientsThisMonth = count || 0;
        partialStats.newClientsThisMonth = newClientsThisMonth;
      } catch (error) {
        anyError = true;
        console.error('Error fetching new clients this month:', error);
      }

      // Monthly growth (loop)
      try {
        const currentYear = new Date().getFullYear();
        const monthlyGrowthData = [];
        for (let month = 0; month < 12; month++) {
          const startOfMonth = new Date(currentYear, month, 1);
          const endOfMonth = new Date(currentYear, month + 1, 0);

          const { count, error } = await supabase
            .from('dados_cliente')
            .select('*', { count: 'exact' })
            .gte('created_at', startOfMonth.toISOString())
            .lte('created_at', endOfMonth.toISOString());

          if (error) {
            anyError = true;
            throw error;
          }

          const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          monthlyGrowthData.push({
            month: monthNames[month],
            clients: count || 0
          });
        }
        partialStats.monthlyGrowth = monthlyGrowthData;
      } catch (error) {
        anyError = true;
        console.error('Error fetching monthly growth data:', error);
      }

      // Client types
      try {
        const { data: clientTypesData, error } = await supabase
          .from('dados_cliente')
          .select('client_type')
          .not('client_type', 'is', null)
          .neq('client_type', '');
        if (error) throw error;

        const typeCounts: Record<string, number> = {};
        clientTypesData?.forEach(client => {
          if (client.client_type) {
            typeCounts[client.client_type] = (typeCounts[client.client_type] || 0) + 1;
          }
        });

        const colors = [
          '#8B5CF6', '#EC4899', '#10B981', '#3B82F6',
          '#F59E0B', '#EF4444', '#6366F1', '#14B8A6',
          '#F97316', '#8B5CF6', '#06B6D4', '#D946EF'
        ];

        const clientTypes = Object.entries(typeCounts).map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length]
        }));

        partialStats.clientTypes = clientTypes;
      } catch (error) {
        anyError = true;
        console.error('Error fetching client types:', error);
      }

      // Recent clients
      try {
        const { data: recentClientsData, error } = await supabase
          .from('dados_cliente')
          .select('id, nome, telefone, client_name, created_at, kanban_stage')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        const recentClients = recentClientsData?.map(client => ({
          id: client.id,
          name: client.nome || 'Cliente sem nome',
          phone: client.telefone || 'Não informado',
          marketingClients: client.client_name ? 1 : 0,
          lastVisit: client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'Data não disponível',
          status: client.kanban_stage || 'Entraram'
        })) || [];

        partialStats.recentClients = recentClients;
      } catch (error) {
        anyError = true;
        console.error('Error fetching recent clients:', error);
      }

      partialStats.isStale = anyError;
      setStats({ ...partialStats });
    } catch (error) {
      // Em caso de erro inesperado na função toda
      console.error('Error fetching stats:', error);
      toast({
        title: "Erro ao atualizar estatísticas",
        description: "Problema de conexão ou erro inesperado ao atualizar as estatísticas.",
        variant: "destructive"
      });
      setStats({ ...zeroStats });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { stats, loading, refetchStats };
}
