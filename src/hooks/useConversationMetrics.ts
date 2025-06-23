
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ConversationMetrics {
  totalConversations: number;
  responseRate: number;
  totalRespondidas: number;
  avgResponseTime: number;
  conversionRate: number;
  avgClosingTime: number;
  conversationData: any[];
  funnelData: any[];
  conversionByTimeData: any[];
  leadsData: any[];
  secondaryResponseRate: number;
  totalSecondaryResponses: number;
  negotiatedValue: number;
  averageNegotiatedValue: number;
  previousPeriodValue: number;
  leadsBySource: any[];
  leadsOverTime: any[];
  leadsByArrivalFunnel: any[];
  isStale: boolean;
}

export function useConversationMetrics(dateFilter: string = 'week', customDate?: Date) {
  const [metrics, setMetrics] = useState<ConversationMetrics>({
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
    secondaryResponseRate: 0,
    totalSecondaryResponses: 0,
    negotiatedValue: 0,
    averageNegotiatedValue: 0,
    previousPeriodValue: 0,
    leadsBySource: [],
    leadsOverTime: [],
    leadsByArrivalFunnel: [],
    isStale: false,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching conversation metrics with optimized function...');

      const [metricsResult, leadsResult, utmResult] = await Promise.all([
        supabase.rpc('get_dashboard_metrics', { 
          date_filter: dateFilter,
          custom_date: customDate?.toISOString()
        }),
        supabase
          .from('dados_cliente')
          .select('id, nome, created_at, kanban_stage')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('utm_tracking')
          .select('*')
          .order('created_at', { ascending: false })
      ]);
      
      const { data: metricsData, error: metricsError } = metricsResult;
      const { data: recentLeads, error: leadsError } = leadsResult;
      const { data: utmData, error: utmError } = utmResult;
      
      if (metricsError) {
        throw metricsError;
      }
      
      const typedMetricsData = metricsData as any;
      const { totalConversations, totalRespondidas, totalClients, funnelData: rawFunnelData, conversationData } = typedMetricsData;
      
      const responseRate = totalConversations > 0 ? Math.round((totalRespondidas / totalConversations) * 100) : 0;
      const conversionRate = totalClients > 0 ? Math.round((totalRespondidas / totalClients) * 100) : 0;
      
      // Calcular taxa de resposta secundária (mock por enquanto)
      const totalSecondaryResponses = Math.floor(totalRespondidas * 0.65);
      const secondaryResponseRate = totalRespondidas > 0 ? Math.round((totalSecondaryResponses / totalRespondidas) * 100) : 0;

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
      let negotiatedValue = 0;
      let averageNegotiatedValue = 0;
      let previousPeriodValue = 0;
      
      if (leadsError) {
        console.error('Error fetching leads data:', leadsError);
        // On error, we don't want to wipe out existing data
      } else if (recentLeads) {
        leadsData = recentLeads.map(lead => ({
          id: lead.id,
          name: lead.nome || 'Cliente sem nome',
          lastContact: lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : 'Data não disponível',
          status: lead.kanban_stage || 'Entraram',
          value: 0 // Remove budget/sales references as they don't exist
        }));
        
        // Mock negotiated value since budget/sales don't exist
        negotiatedValue = Math.floor(Math.random() * 50000);
        averageNegotiatedValue = negotiatedValue / Math.max(recentLeads.length, 1);
        previousPeriodValue = negotiatedValue * 0.85;
      }
      
      // Processar dados de UTM para leads por fonte
      let leadsBySource = [];
      let leadsOverTime = [];
      let leadsByArrivalFunnel = [];
      
      if (utmError) {
        console.error('Error fetching UTM data:', utmError);
      } else if (utmData) {
        // Processar leads por fonte
        const sourceMap = new Map();
        utmData.forEach(item => {
          const source = item.utm_source || 'Direto';
          if (!sourceMap.has(source)) {
            sourceMap.set(source, 0);
          }
          sourceMap.set(source, sourceMap.get(source) + 1);
        });
        
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
        leadsBySource = Array.from(sourceMap.entries()).map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length]
        }));
        
        // Processar leads ao longo do tempo
        const monthMap = new Map();
        const now = new Date();
        const currentYear = now.getFullYear();
        
        // Inicializar mapa com últimos 6 meses
        for (let i = 5; i >= 0; i--) {
          const month = new Date(currentYear, now.getMonth() - i, 1);
          const monthKey = month.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
          monthMap.set(monthKey, { month: monthKey, clients: 0, leads: 0 });
        }
        
        // Preencher dados de leads usando timestamp correto
        utmData.forEach(item => {
          // Use first_utm_created_at instead of created_at
          const dateStr = item.first_utm_created_at || item.utm_created_at;
          if (dateStr) {
            const date = new Date(dateStr);
            const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            
            if (monthMap.has(monthKey)) {
              const data = monthMap.get(monthKey);
              data.leads += 1;
              if (item.utm_conversion) {
                data.clients += 1;
              }
            }
          }
        });
        
        leadsOverTime = Array.from(monthMap.values());
        
        // Processar funil por data de chegada
        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        
        const lastDay = utmData.filter(item => {
          const dateStr = item.first_utm_created_at || item.utm_created_at;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return (today.getTime() - date.getTime()) <= oneDay;
        }).length;
        
        const lastWeek = utmData.filter(item => {
          const dateStr = item.first_utm_created_at || item.utm_created_at;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return (today.getTime() - date.getTime()) <= 7 * oneDay;
        }).length;
        
        const lastMonth = utmData.filter(item => {
          const dateStr = item.first_utm_created_at || item.utm_created_at;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return (today.getTime() - date.getTime()) <= 30 * oneDay;
        }).length;
        
        const older = utmData.length - lastMonth;
        
        const maxArrival = Math.max(lastDay, lastWeek, lastMonth, older);
        
        leadsByArrivalFunnel = [
          { name: 'Últimas 24h', value: lastDay, percentage: Math.round((lastDay / maxArrival) * 100), color: '#10B981' },
          { name: 'Últimos 7 dias', value: lastWeek, percentage: Math.round((lastWeek / maxArrival) * 100), color: '#3B82F6' },
          { name: 'Últimos 30 dias', value: lastMonth, percentage: Math.round((lastMonth / maxArrival) * 100), color: '#8B5CF6' },
          { name: 'Mais antigos', value: older, percentage: Math.round((older / maxArrival) * 100), color: '#F59E0B' }
        ];
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
        // Novas métricas
        secondaryResponseRate,
        totalSecondaryResponses,
        negotiatedValue,
        averageNegotiatedValue,
        previousPeriodValue,
        leadsBySource: leadsBySource.length > 0 ? leadsBySource : prev.leadsBySource,
        leadsOverTime: leadsOverTime.length > 0 ? leadsOverTime : prev.leadsOverTime,
        leadsByArrivalFunnel: leadsByArrivalFunnel.length > 0 ? leadsByArrivalFunnel : prev.leadsByArrivalFunnel,
        isStale: !!(leadsError || utmError),
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
  }, [toast, dateFilter, customDate]);

  return { metrics, loading, refetchMetrics };
}
