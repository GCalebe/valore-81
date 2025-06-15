
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

  const refetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching conversation metrics with optimized function...');

      const [metricsResult, leadsResult] = await Promise.all([
        supabase.rpc('get_dashboard_metrics'),
        supabase
          .from('dados_cliente')
          .select('id, nome, created_at, kanban_stage')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);
      
      const { data: metricsData, error: metricsError } = metricsResult;
      const { data: recentLeads, error: leadsError } = leadsResult;
      
      if (metricsError) {
        throw metricsError;
      }
      
      const typedMetricsData = metricsData as any;
      const { totalConversations, totalRespondidas, totalClients, funnelData: rawFunnelData, conversationData } = typedMetricsData;
      
      const responseRate = totalConversations > 0 ? Math.round((totalRespondidas / totalConversations) * 100) : 0;
      const conversionRate = totalClients > 0 ? Math.round((totalRespondidas / totalClients) * 100) : 0;

      const maxValue = Math.max(...(rawFunnelData || []).map((s: { value: number }) => s.value), 1);
      const funnelData = (rawFunnelData || []).map((stage: any) => ({
        ...stage,
        percentage: Math.round((stage.value / maxValue) * 100)
      }));

      // Keep this mocked data for now
      const conversionByTimeData = [
        { day: 'Segunda', morning: Math.floor(totalRespondidas * 0.12), afternoon: Math.floor(totalRespondidas * 0.18), evening: Math.floor(totalRespondidas * 0.08) },
        { day: 'Terça', morning: Math.floor(totalRespondidas * 0.15), afternoon: Math.floor(totalRespondidas * 0.22), evening: Math.floor(totalRespondidas * 0.10) },
        { day: 'Quarta', morning: Math.floor(totalRespondidas * 0.18), afternoon: Math.floor(totalRespondidas * 0.25), evening: Math.floor(totalRespondidas * 0.12) },
        { day: 'Quinta', morning: Math.floor(totalRespondidas * 0.20), afternoon: Math.floor(totalRespondidas * 0.28), evening: Math.floor(totalRespondidas * 0.15) },
        { day: 'Sexta', morning: Math.floor(totalRespondidas * 0.16), afternoon: Math.floor(totalRespondidas * 0.30), evening: Math.floor(totalRespondidas * 0.18) },
        { day: 'Sábado', morning: Math.floor(totalRespondidas * 0.08), afternoon: Math.floor(totalRespondidas * 0.15), evening: Math.floor(totalRespondidas * 0.20) },
        { day: 'Domingo', morning: Math.floor(totalRespondidas * 0.05), afternoon: Math.floor(totalRespondidas * 0.10), evening: Math.floor(totalRespondidas * 0.12) }
      ];

      let leadsData = [];
      if (leadsError) {
        console.error('Error fetching leads data:', leadsError);
        // On error, we don't want to wipe out existing data
      } else {
        leadsData = recentLeads?.map(lead => ({
          id: lead.id,
          name: lead.nome || 'Cliente sem nome',
          lastContact: lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : 'Data não disponível',
          status: lead.kanban_stage || 'Entraram'
        })) || [];
      }

      setMetrics(prev => ({
        ...prev,
        totalConversations,
        responseRate,
        totalRespondidas,
        avgResponseTime: 2.5, // mock
        conversionRate,
        avgClosingTime: Math.round(conversionRate / 2), // mock
        conversationData,
        funnelData,
        conversionByTimeData,
        leadsData: leadsData.length > 0 ? leadsData : prev.leadsData,
        isStale: !!leadsError,
      }));

      console.log('Conversation metrics updated successfully with optimized data');

    } catch (error) {
      console.error('Error fetching conversation metrics:', error);
      toast({
        title: "Erro ao atualizar métricas",
        description: "Problema ao buscar as métricas de conversas. Os dados podem estar desatualizados.",
        variant: "destructive"
      });
      setMetrics(prev => ({ ...prev, isStale: true }));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { metrics, loading, refetchMetrics };
}
