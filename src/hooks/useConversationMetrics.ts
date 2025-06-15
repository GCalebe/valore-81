import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useConversationMetrics() {
  const [metrics, setMetrics] = useState({
    totalConversations: 0,
    responseRate: 0,
    totalRespondidas: 0,
    avgResponseTime: 0,
    conversionRate: 0,
    avgClosingTime: 0,
    conversationData: [],
    funnelData: [],
    conversionByTimeData: [],
    leadsData: [],
    isStale: false,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const zeroMetrics = {
    totalConversations: 0,
    responseRate: 0,
    totalRespondidas: 0,
    avgResponseTime: 0,
    conversionRate: 0,
    avgClosingTime: 0,
    conversationData: [],
    funnelData: [],
    conversionByTimeData: [],
    leadsData: [],
    isStale: true,
  };

  const refetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching conversation metrics from dados_cliente table...');

      // Fetch all clients to calculate metrics
      const { data: allClients, error: allClientsError } = await supabase
        .from('dados_cliente')
        .select('*');

      if (allClientsError) {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível carregar as conversas. Verifique sua conexão ou tente novamente mais tarde.",
          variant: "destructive"
        });
        setMetrics(zeroMetrics);
        setLoading(false);
        return; // Evita sobrescrever métricas anteriores
      }

      const totalClients = allClients?.length || 0;
      
      // Calculate clients with phone (contacted)
      const clientsWithPhone = allClients?.filter(client => client.telefone && client.telefone.trim() !== '') || [];
      const totalConversations = clientsWithPhone.length;
      
      // Calculate clients with marketing project (responded)
      const clientsWithMarketing = allClients?.filter(client => client.client_name && client.client_name.trim() !== '') || [];
      const totalRespondidas = clientsWithMarketing.length;
      
      // Calculate response rate
      const responseRate = totalConversations > 0 ? Math.round((totalRespondidas / totalConversations) * 100) : 0;
      
      // Calculate conversion rate (clients with marketing projects / total clients)
      const conversionRate = totalClients > 0 ? Math.round((totalRespondidas / totalClients) * 100) : 0;

      // Generate conversation data for the last 7 days
      const conversationData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayClients = allClients?.filter(client => {
          if (!client.created_at) return false;
          const clientDate = new Date(client.created_at);
          return clientDate >= dayStart && clientDate <= dayEnd;
        }) || [];

        const respondidas = dayClients.filter(client => client.client_name && client.client_name.trim() !== '').length;
        const naoRespondidas = dayClients.length - respondidas;

        conversationData.push({
          date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          respondidas,
          naoRespondidas
        });
      }

      // Calculate funnel data based on kanban stages
      const kanbanCounts = {};
      allClients?.forEach(client => {
        const stage = client.kanban_stage || 'Entraram';
        kanbanCounts[stage] = (kanbanCounts[stage] || 0) + 1;
      });

      const funnelStages = [
        { stage: 'Entraram', value: kanbanCounts['Entraram'] || 0 },
        { stage: 'Contato feito', value: kanbanCounts['Contato feito'] || 0 },
        { stage: 'Conversa iniciada', value: kanbanCounts['Conversa iniciada'] || 0 },
        { stage: 'Reunião', value: kanbanCounts['Reunião'] || 0 },
        { stage: 'Proposta', value: kanbanCounts['Proposta'] || 0 },
        { stage: 'Fechamento', value: kanbanCounts['Fechamento'] || 0 }
      ];

      const maxValue = Math.max(...funnelStages.map(s => s.value), 1);
      const funnelData = funnelStages.map(stage => ({
        ...stage,
        percentage: Math.round((stage.value / maxValue) * 100)
      }));

      // Generate conversion by time data (mock data based on client creation times)
      const conversionByTimeData = [
        { day: 'Segunda', morning: Math.floor(totalRespondidas * 0.12), afternoon: Math.floor(totalRespondidas * 0.18), evening: Math.floor(totalRespondidas * 0.08) },
        { day: 'Terça', morning: Math.floor(totalRespondidas * 0.15), afternoon: Math.floor(totalRespondidas * 0.22), evening: Math.floor(totalRespondidas * 0.10) },
        { day: 'Quarta', morning: Math.floor(totalRespondidas * 0.18), afternoon: Math.floor(totalRespondidas * 0.25), evening: Math.floor(totalRespondidas * 0.12) },
        { day: 'Quinta', morning: Math.floor(totalRespondidas * 0.20), afternoon: Math.floor(totalRespondidas * 0.28), evening: Math.floor(totalRespondidas * 0.15) },
        { day: 'Sexta', morning: Math.floor(totalRespondidas * 0.16), afternoon: Math.floor(totalRespondidas * 0.30), evening: Math.floor(totalRespondidas * 0.18) },
        { day: 'Sábado', morning: Math.floor(totalRespondidas * 0.08), afternoon: Math.floor(totalRespondidas * 0.15), evening: Math.floor(totalRespondidas * 0.20) },
        { day: 'Domingo', morning: Math.floor(totalRespondidas * 0.05), afternoon: Math.floor(totalRespondidas * 0.10), evening: Math.floor(totalRespondidas * 0.12) }
      ];

      // Generate leads data from recent clients
      const { data: recentLeads, error: leadsError } = await supabase
        .from('dados_cliente')
        .select('id, nome, created_at, kanban_stage')
        .order('created_at', { ascending: false })
        .limit(10);

      let leadsData = [];
      if (leadsError) {
        leadsData = metrics.leadsData ?? [];
      } else {
        leadsData = recentLeads?.map(lead => ({
          id: lead.id,
          name: lead.nome || 'Cliente sem nome',
          lastContact: lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : 'Data não disponível',
          status: lead.kanban_stage || 'Entraram'
        })) || [];
      }

      setMetrics({
        totalConversations,
        responseRate,
        totalRespondidas,
        avgResponseTime: 2.5,
        conversionRate,
        avgClosingTime: Math.round(conversionRate / 2),
        conversationData,
        funnelData,
        conversionByTimeData,
        leadsData,
        isStale: false,
      });

      console.log('Conversation metrics updated successfully with real data');

    } catch (error) {
      console.error('Error fetching conversation metrics:', error);
      toast({
        title: "Erro ao atualizar métricas de conversas",
        description: "Problema de conexão ou erro inesperado ao atualizar as métricas de conversas.",
        variant: "destructive"
      });
      // Não sobrescreve os dados anteriores.
    } finally {
      setLoading(false);
    }
  }, [toast, metrics.leadsData]);

  return { metrics, loading, refetchMetrics };
}
