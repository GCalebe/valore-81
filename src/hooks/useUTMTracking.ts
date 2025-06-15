
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

export function useUTMTracking() {
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
      
      const [metricsResult, recentTrackingResult] = await Promise.all([
        supabase.rpc('get_utm_metrics'),
        supabase
          .from('utm_tracking')
          .select('*')
          .order('utm_created_at', { ascending: false })
          .limit(10)
      ]);
      
      const { data: metricsData, error: metricsError } = metricsResult;
      const { data: recentTracking, error: recentTrackingError } = recentTrackingResult;
      
      if (metricsError || recentTrackingError) {
        const err = metricsError || recentTrackingError;
        console.error('Error fetching UTM metrics:', err);
        setMetrics(zeroMetrics);
        return;
      }
      
      const typedMetricsData = metricsData as any;
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
  }, []);

  useEffect(() => {
    refetchUTMData();
  }, [refetchUTMData]);

  return {
    metrics,
    loading,
    refetchUTMData
  };
}
