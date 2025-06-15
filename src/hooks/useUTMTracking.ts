
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UTMData {
  id: string;
  lead_id: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  utm_created_at: string;
  utm_conversion: boolean;
  utm_conversion_value: number;
  utm_conversion_stage: string;
  landing_page: string;
  device_type: string;
}

interface UTMMetrics {
  totalCampaigns: number;
  totalLeads: number;
  conversionRate: number;
  topSources: Array<{ source: string; count: number; conversions: number }>;
  topCampaigns: Array<{ campaign: string; count: number; conversions: number; value: number }>;
  campaignData: Array<{ name: string; leads: number; conversions: number; value: number }>;
  sourceData: Array<{ name: string; leads: number; conversions: number }>;
  deviceData: Array<{ name: string; value: number }>;
  recentTracking: UTMData[];
  isStale?: boolean;
}

export function useUTMTracking(campaignFilter?: string) {
  const [metrics, setMetrics] = useState<UTMMetrics>({
    totalCampaigns: 0,
    totalLeads: 0,
    conversionRate: 0,
    topSources: [],
    topCampaigns: [],
    campaignData: [],
    sourceData: [],
    deviceData: [],
    recentTracking: [],
    isStale: false,
  });
  const [loading, setLoading] = useState(true);

  const zeroMetrics: UTMMetrics = {
    totalCampaigns: 0,
    totalLeads: 0,
    conversionRate: 0,
    topSources: [],
    topCampaigns: [],
    campaignData: [],
    sourceData: [],
    deviceData: [],
    recentTracking: [],
    isStale: true,
  };

  const refetchUTMData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Construir a query para recent tracking com filtro de campanha
      let recentTrackingQuery = supabase
        .from('utm_tracking')
        .select('*')
        .order('utm_created_at', { ascending: false })
        .limit(10);
      
      // Aplicar filtro de campanha se especificado
      if (campaignFilter && campaignFilter !== 'all') {
        recentTrackingQuery = recentTrackingQuery.eq('utm_campaign', campaignFilter);
      }
      
      const [metricsResult, recentTrackingResult] = await Promise.all([
        supabase.rpc('get_utm_metrics'),
        recentTrackingQuery
      ]);
      
      const { data: metricsData, error: metricsError } = metricsResult;
      const { data: recentTracking, error: recentTrackingError } = recentTrackingResult;
      
      if (metricsError || recentTrackingError) {
        const err = metricsError || recentTrackingError;
        console.error('Error fetching UTM metrics:', err);
        setMetrics(zeroMetrics);
        return;
      }
      
      let finalMetrics;
      
      // Se há filtro de campanha, precisamos filtrar os dados das métricas também
      if (campaignFilter && campaignFilter !== 'all') {
        // Buscar dados filtrados manualmente para campanhas específicas
        const { data: filteredData, error: filteredError } = await supabase
          .from('utm_tracking')
          .select('*')
          .eq('utm_campaign', campaignFilter);
        
        if (filteredError) {
          console.error('Error fetching filtered data:', filteredError);
          setMetrics(zeroMetrics);
          return;
        }
        
        const totalLeads = filteredData.length;
        const totalCampaigns = new Set(filteredData.map(item => item.utm_campaign)).size;
        const totalConversions = filteredData.filter(item => item.utm_conversion).length;
        
        // Processar top sources
        const sourceStats = filteredData.reduce((acc: any, item) => {
          if (item.utm_source) {
            if (!acc[item.utm_source]) {
              acc[item.utm_source] = { source: item.utm_source, count: 0, conversions: 0 };
            }
            acc[item.utm_source].count++;
            if (item.utm_conversion) {
              acc[item.utm_source].conversions++;
            }
          }
          return acc;
        }, {});
        
        const topSources = Object.values(sourceStats).slice(0, 5);
        
        // Processar top campaigns
        const campaignStats = filteredData.reduce((acc: any, item) => {
          if (item.utm_campaign) {
            if (!acc[item.utm_campaign]) {
              acc[item.utm_campaign] = { campaign: item.utm_campaign, count: 0, conversions: 0, value: 0 };
            }
            acc[item.utm_campaign].count++;
            if (item.utm_conversion) {
              acc[item.utm_campaign].conversions++;
              acc[item.utm_campaign].value += item.utm_conversion_value || 0;
            }
          }
          return acc;
        }, {});
        
        const topCampaigns = Object.values(campaignStats).slice(0, 5);
        
        // Processar device data
        const deviceStats = filteredData.reduce((acc: any, item) => {
          const deviceType = item.device_type || 'Desconhecido';
          if (!acc[deviceType]) {
            acc[deviceType] = { name: deviceType, value: 0 };
          }
          acc[deviceType].value++;
          return acc;
        }, {});
        
        const deviceData = Object.values(deviceStats);
        
        finalMetrics = {
          totalLeads,
          totalCampaigns,
          totalConversions,
          topSources,
          topCampaigns,
          deviceData
        };
      } else {
        finalMetrics = metricsData;
      }
      
      const typedMetricsData = finalMetrics as any;
      const { totalLeads, totalCampaigns, totalConversions, topSources, topCampaigns, deviceData } = typedMetricsData;
      
      const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;

      const campaignData = (topCampaigns || []).map((item: any) => ({
        name: item.campaign,
        leads: item.count,
        conversions: item.conversions,
        value: item.value || 0
      }));

      const sourceData = (topSources || []).map((item: any) => ({
        name: item.source,
        leads: item.count,
        conversions: item.conversions
      }));
      
      setMetrics({
        totalCampaigns: totalCampaigns,
        totalLeads: totalLeads,
        conversionRate: Math.round(conversionRate * 100) / 100,
        topSources,
        topCampaigns,
        campaignData,
        sourceData,
        deviceData: deviceData || [],
        recentTracking: (recentTracking as UTMData[] | null) || [],
        isStale: false,
      });
      
    } catch (error) {
      console.error('Failed to fetch UTM data with optimized function', error);
      setMetrics(zeroMetrics);
    } finally {
      setLoading(false);
    }
  }, [campaignFilter]);

  useEffect(() => {
    refetchUTMData();
  }, [refetchUTMData]);

  return {
    metrics,
    loading,
    refetchUTMData
  };
}
