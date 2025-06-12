
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
    recentClients: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refetchStats = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching real client statistics from dados_cliente table...');
      
      // Fetch total clients
      const { count: totalClients, error: totalClientsError } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact' });

      if (totalClientsError) {
        console.error('Error fetching total clients:', totalClientsError);
        throw totalClientsError;
      }

      console.log(`Total clients count: ${totalClients}`);

      // Fetch total marketing clients (clients with client_name filled)
      const { count: totalMarketingClients, error: marketingClientsError } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact' })
        .not('client_name', 'is', null)
        .neq('client_name', '');

      if (marketingClientsError) {
        console.error('Error fetching marketing clients:', marketingClientsError);
      }

      console.log(`Marketing clients count: ${totalMarketingClients || 0}`);

      // Fetch new clients this month
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const { count: newClientsThisMonth, error: newClientsError } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact' })
        .gte('created_at', firstDayOfMonth.toISOString())
        .lte('created_at', today.toISOString());

      if (newClientsError) {
        console.error('Error fetching new clients this month:', newClientsError);
      }

      console.log(`New clients this month: ${newClientsThisMonth || 0}`);

      // Fetch monthly growth data for the current year
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
          console.error(`Error fetching data for month ${month}:`, error);
        }
        
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        monthlyGrowthData.push({
          month: monthNames[month],
          clients: count || 0
        });
      }

      // Fetch client types data using client_type field
      const { data: clientTypesData, error: clientTypesError } = await supabase
        .from('dados_cliente')
        .select('client_type')
        .not('client_type', 'is', null)
        .neq('client_type', '');

      if (clientTypesError) {
        console.error('Error fetching client types:', clientTypesError);
      }

      const typeCounts = {};
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

      console.log(`Client types:`, clientTypes);

      // Fetch recent clients with better data handling
      const { data: recentClientsData, error: recentClientsError } = await supabase
        .from('dados_cliente')
        .select('id, nome, telefone, client_name, created_at, kanban_stage')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentClientsError) {
        console.error('Error fetching recent clients:', recentClientsError);
      }

      const recentClients = recentClientsData?.map(client => ({
        id: client.id,
        name: client.nome || 'Cliente sem nome',
        phone: client.telefone || 'Não informado',
        marketingClients: client.client_name ? 1 : 0,
        lastVisit: client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'Data não disponível',
        status: client.kanban_stage || 'Entraram'
      })) || [];

      console.log(`Recent clients:`, recentClients);

      // Update stats with real data
      setStats({
        totalClients: totalClients || 0,
        totalMarketingClients: totalMarketingClients || 0,
        newClientsThisMonth: newClientsThisMonth || 0,
        monthlyGrowth: monthlyGrowthData,
        clientTypes,
        recentClients
      });

      console.log('Client statistics updated successfully with real data');

    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Erro ao atualizar estatísticas",
        description: "Ocorreu um erro ao atualizar as estatísticas.",
        variant: "destructive"
      });
      
      // Em caso de erro, definir valores padrão para evitar quebra da UI
      setStats({
        totalClients: 0,
        totalMarketingClients: 0,
        newClientsThisMonth: 0,
        monthlyGrowth: [],
        clientTypes: [],
        recentClients: []
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { stats, loading, refetchStats };
}
