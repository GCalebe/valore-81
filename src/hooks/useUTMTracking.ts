
import { useState, useEffect } from 'react';
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
  recentTracking: UTMData[];
  isStale?: boolean;
}

export function useUTMTracking() {
  const [utmData, setUtmData] = useState<UTMData[]>([]);
  const [metrics, setMetrics] = useState<UTMMetrics>({
    totalCampaigns: 0,
    totalLeads: 0,
    conversionRate: 0,
    topSources: [],
    topCampaigns: [],
    campaignData: [],
    sourceData: [],
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
    recentTracking: [],
    isStale: true,
  };

  const fetchUTMData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('utm_tracking')
        .select('*')
        .order('utm_created_at', { ascending: false });

      if (error) {
        setMetrics(zeroMetrics);
        setUtmData([]);
        setLoading(false);
        return;
      }

      setUtmData(data || []);
      calculateMetrics(data || []);
    } catch (error) {
      setMetrics(zeroMetrics);
      setUtmData([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (data: UTMData[]) => {
    const totalLeads = data.length;
    const conversions = data.filter(item => item.utm_conversion).length;
    const conversionRate = totalLeads > 0 ? (conversions / totalLeads) * 100 : 0;

    // Top sources
    const sourceMap = new Map();
    data.forEach(item => {
      if (item.utm_source) {
        const existing = sourceMap.get(item.utm_source) || { count: 0, conversions: 0 };
        existing.count++;
        if (item.utm_conversion) existing.conversions++;
        sourceMap.set(item.utm_source, existing);
      }
    });

    const topSources = Array.from(sourceMap.entries())
      .map(([source, stats]) => ({ source, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top campaigns
    const campaignMap = new Map();
    data.forEach(item => {
      if (item.utm_campaign) {
        const existing = campaignMap.get(item.utm_campaign) || { count: 0, conversions: 0, value: 0 };
        existing.count++;
        if (item.utm_conversion) {
          existing.conversions++;
          existing.value += item.utm_conversion_value || 0;
        }
        campaignMap.set(item.utm_campaign, existing);
      }
    });

    const topCampaigns = Array.from(campaignMap.entries())
      .map(([campaign, stats]) => ({ campaign, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Campaign data for charts
    const campaignData = topCampaigns.map(item => ({
      name: item.campaign,
      leads: item.count,
      conversions: item.conversions,
      value: item.value
    }));

    // Source data for charts
    const sourceData = topSources.map(item => ({
      name: item.source,
      leads: item.count,
      conversions: item.conversions
    }));

    const uniqueCampaigns = new Set(data.map(item => item.utm_campaign).filter(Boolean)).size;

    setMetrics({
      totalCampaigns: uniqueCampaigns,
      totalLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      topSources,
      topCampaigns,
      campaignData,
      sourceData,
      recentTracking: data.slice(0, 10),
      isStale: false,
    });
  };

  const refetchUTMData = async () => {
    await fetchUTMData();
  };

  useEffect(() => {
    fetchUTMData();
  }, []);

  return {
    utmData,
    metrics,
    loading,
    refetchUTMData
  };
}
