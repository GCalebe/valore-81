
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
      console.log('Fetching client statistics from dados_cliente table...');
      
      // Fetch total clients
      const { count: totalClients, error: totalClientsError } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact' });

      if (totalClientsError) {
        console.error('Error fetching total clients:', totalClientsError);
        throw totalClientsError;
      }

      console.log(`Total clients count: ${totalClients}`);

      // Fetch total marketing clients (clients with nome_cliente filled)
      const { count: totalMarketingClients, error: marketingClientsError } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact' })
        .not('nome_cliente', 'is', null);

      if (marketingClientsError) {
        console.error('Error fetching marketing clients:', marketingClientsError);
        // Não lançar erro, continuar com 0
      }

      console.log(`Marketing clients count: ${totalMarketingClients}`);

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
        // Não lançar erro, continuar com 0
      }

      console.log(`New clients this month: ${newClientsThisMonth}`);

      // Fetch monthly growth data
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

      // Fetch client types data using tipo_cliente field
      const { data: clientTypesData, error: clientTypesError } = await supabase
        .from('dados_cliente')
        .select('tipo_cliente')
        .not('tipo_cliente', 'is', null);

      if (clientTypesError) {
        console.error('Error fetching client types:', clientTypesError);
        // Não lançar erro, continuar com array vazio
      }

      const typeCounts = {};
      clientTypesData?.forEach(client => {
        if (client.tipo_cliente) {
          typeCounts[client.tipo_cliente] = (typeCounts[client.tipo_cliente] || 0) + 1;
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

      // Fetch recent clients
      const { data: recentClientsData, error: recentClientsError } = await supabase
        .from('dados_cliente')
        .select('id, nome, telefone, nome_cliente, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentClientsError) {
        console.error('Error fetching recent clients:', recentClientsError);
        // Não lançar erro, continuar com array vazio
      }

      const recentClients = recentClientsData?.map(client => ({
        id: client.id,
        name: client.nome || 'Cliente sem nome',
        phone: client.telefone || 'Não informado',
        marketingClients: client.nome_cliente ? 1 : 0,
        lastVisit: new Date(client.created_at).toLocaleDateString('pt-BR')
      })) || [];

      console.log(`Recent clients:`, recentClients);

      // Update stats
      setStats({
        totalClients: totalClients || 0,
        totalMarketingClients: totalMarketingClients || 0,
        newClientsThisMonth: newClientsThisMonth || 0,
        monthlyGrowth: monthlyGrowthData,
        clientTypes,
        recentClients
      });

      console.log('Client statistics updated successfully');

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
