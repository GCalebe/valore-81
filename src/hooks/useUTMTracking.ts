
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
  utm_conversion_at: string;
  landing_page: string;
  device_type: string;
  geo_location: any;
  utm_first_touch: string;
  utm_last_touch: string;
  utm_id: string;
  gclid: string;
  fbclid: string;
  referrer: string;
  user_agent: string;
  ip_address: string;
}

interface UTMMetrics {
  totalCampaigns: number;
  totalLeads: number;
  conversionRate: number;
  topSources: Array<{ source: string; count: number; conversions: number }>;
  topCampaigns: Array<{ campaign: string; count: number; conversions: number; value: number; ctr: number; roas: number }>;
  campaignData: Array<{ name: string; leads: number; conversions: number; value: number }>;
  sourceData: Array<{ name: string; leads: number; conversions: number }>;
  deviceData: Array<{ name: string; value: number }>;
  geoData: Array<{ location: string; leads: number; conversions: number }>;
  timeToConversion: {
    average: number;
    median: number;
    min: number;
    max: number;
  };
  recentTracking: UTMData[];
  isStale?: boolean;
}

// Type guard to check if geo_location is an object with expected properties
const isGeoLocationObject = (geo: any): geo is { city?: string; state?: string; country?: string } => {
  return geo && typeof geo === 'object' && !Array.isArray(geo);
};

export function useUTMTracking(campaignFilter?: string, deviceFilter?: string) {
  const [metrics, setMetrics] = useState<UTMMetrics>({
    totalCampaigns: 0,
    totalLeads: 0,
    conversionRate: 0,
    topSources: [],
    topCampaigns: [],
    campaignData: [],
    sourceData: [],
    deviceData: [],
    geoData: [],
    timeToConversion: {
      average: 0,
      median: 0,
      min: 0,
      max: 0,
    },
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
    geoData: [],
    timeToConversion: {
      average: 0,
      median: 0,
      min: 0,
      max: 0,
    },
    recentTracking: [],
    isStale: true,
  };

  const refetchUTMData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Construir query base
      let baseQuery = supabase
        .from('utm_tracking')
        .select('*');
      
      // Aplicar filtros
      if (campaignFilter && campaignFilter !== 'all') {
        baseQuery = baseQuery.eq('utm_campaign', campaignFilter);
      }
      
      if (deviceFilter && deviceFilter !== 'all') {
        baseQuery = baseQuery.eq('device_type', deviceFilter);
      }
      
      // Buscar dados com filtros aplicados
      const { data: filteredData, error } = await baseQuery.order('utm_created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching UTM data:', error);
        setMetrics(zeroMetrics);
        return;
      }
      
      const totalLeads = filteredData.length;
      const totalCampaigns = new Set(filteredData.map(item => item.utm_campaign)).size;
      const totalConversions = filteredData.filter(item => item.utm_conversion).length;
      
      // Calcular tempo de conversão
      const conversionTimes = filteredData
        .filter(item => item.utm_conversion && item.utm_conversion_at && item.utm_first_touch)
        .map(item => {
          const conversionTime = new Date(item.utm_conversion_at).getTime();
          const firstTouchTime = new Date(item.utm_first_touch).getTime();
          return (conversionTime - firstTouchTime) / (1000 * 60 * 60); // em horas
        })
        .filter(time => time > 0);
      
      const timeToConversion = {
        average: conversionTimes.length > 0 ? conversionTimes.reduce((a, b) => a + b, 0) / conversionTimes.length : 0,
        median: conversionTimes.length > 0 ? conversionTimes.sort((a, b) => a - b)[Math.floor(conversionTimes.length / 2)] : 0,
        min: conversionTimes.length > 0 ? Math.min(...conversionTimes) : 0,
        max: conversionTimes.length > 0 ? Math.max(...conversionTimes) : 0,
      };
      
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
      
      const topSources = Object.values(sourceStats).slice(0, 5) as Array<{ source: string; count: number; conversions: number }>;
      
      // Processar top campaigns com CTR e ROAS
      const campaignStats = filteredData.reduce((acc: any, item) => {
        if (item.utm_campaign) {
          if (!acc[item.utm_campaign]) {
            acc[item.utm_campaign] = { 
              campaign: item.utm_campaign, 
              count: 0, 
              conversions: 0, 
              value: 0,
              clicks: 0
            };
          }
          acc[item.utm_campaign].count++;
          acc[item.utm_campaign].clicks++; // Assumindo que cada registro é um clique
          if (item.utm_conversion) {
            acc[item.utm_campaign].conversions++;
            acc[item.utm_campaign].value += item.utm_conversion_value || 0;
          }
        }
        return acc;
      }, {});
      
      const topCampaigns = Object.values(campaignStats).map((campaign: any) => ({
        ...campaign,
        ctr: campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0,
        roas: campaign.conversions > 0 ? (campaign.value / (campaign.conversions * 50)) * 100 : 0, // Assumindo custo médio de R$ 50 por conversão
      })).slice(0, 5);
      
      // Processar device data
      const deviceStats = filteredData.reduce((acc: any, item) => {
        const deviceType = item.device_type || 'Desconhecido';
        if (!acc[deviceType]) {
          acc[deviceType] = { name: deviceType, value: 0 };
        }
        acc[deviceType].value++;
        return acc;
      }, {});
      
      const deviceData = Object.values(deviceStats) as Array<{ name: string; value: number }>;
      
      // Processar dados geográficos com type guard
      const geoStats = filteredData.reduce((acc: any, item) => {
        if (item.geo_location && isGeoLocationObject(item.geo_location) && item.geo_location.city) {
          const location = `${item.geo_location.city}, ${item.geo_location.state || item.geo_location.country}`;
          if (!acc[location]) {
            acc[location] = { location, leads: 0, conversions: 0 };
          }
          acc[location].leads++;
          if (item.utm_conversion) {
            acc[location].conversions++;
          }
        }
        return acc;
      }, {});
      
      const geoData = Object.values(geoStats).slice(0, 10) as Array<{ location: string; leads: number; conversions: number }>;
      
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
        geoData: geoData || [],
        timeToConversion,
        recentTracking: (filteredData as UTMData[] | null) || [],
        isStale: false,
      });
      
    } catch (error) {
      console.error('Failed to fetch UTM data', error);
      setMetrics(zeroMetrics);
    } finally {
      setLoading(false);
    }
  }, [campaignFilter, deviceFilter]);

  useEffect(() => {
    refetchUTMData();
  }, [refetchUTMData]);

  return {
    metrics,
    loading,
    refetchUTMData
  };
}
