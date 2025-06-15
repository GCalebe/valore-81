
-- Função otimizada para buscar as métricas de UTM de uma só vez.
CREATE OR REPLACE FUNCTION get_utm_metrics()
RETURNS jsonb AS $$
DECLARE
    result jsonb;
    top_sources_data jsonb;
    top_campaigns_data jsonb;
    device_data jsonb;
    metrics_counts record;
BEGIN
    -- Contagens agregadas
    SELECT
        COUNT(*) as total_leads,
        COUNT(DISTINCT utm_campaign) as total_campaigns,
        COUNT(*) FILTER (WHERE utm_conversion = true) as total_conversions
    INTO metrics_counts
    FROM public.utm_tracking;

    -- Top 5 Fontes de UTM
    SELECT jsonb_agg(source_stats)
    INTO top_sources_data
    FROM (
        SELECT
            utm_source as source,
            COUNT(*) as count,
            COUNT(*) FILTER (WHERE utm_conversion = true) as conversions
        FROM public.utm_tracking
        WHERE utm_source IS NOT NULL
        GROUP BY utm_source
        ORDER BY count DESC
        LIMIT 5
    ) as source_stats;

    -- Top 5 Campanhas de UTM
    SELECT jsonb_agg(campaign_stats)
    INTO top_campaigns_data
    FROM (
        SELECT
            utm_campaign as campaign,
            COUNT(*) as count,
            COUNT(*) FILTER (WHERE utm_conversion = true) as conversions,
            SUM(COALESCE(utm_conversion_value, 0)) FILTER (WHERE utm_conversion = true) as value
        FROM public.utm_tracking
        WHERE utm_campaign IS NOT NULL
        GROUP BY utm_campaign
        ORDER BY count DESC
        LIMIT 5
    ) as campaign_stats;

    -- Leads por Dispositivo
    SELECT jsonb_agg(device_stats)
    INTO device_data
    FROM (
        SELECT
            COALESCE(device_type, 'Desconhecido') as name,
            COUNT(*) as value
        FROM public.utm_tracking
        GROUP BY name
        ORDER BY value DESC
    ) as device_stats;

    -- Monta o objeto JSON final
    result := jsonb_build_object(
        'totalLeads', metrics_counts.total_leads,
        'totalCampaigns', metrics_counts.total_campaigns,
        'totalConversions', metrics_counts.total_conversions,
        'topSources', COALESCE(top_sources_data, '[]'::jsonb),
        'topCampaigns', COALESCE(top_campaigns_data, '[]'::jsonb),
        'deviceData', COALESCE(device_data, '[]'::jsonb)
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;
