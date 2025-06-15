
-- Função otimizada para buscar as principais métricas do dashboard de uma só vez.
-- Isso evita múltiplas viagens ao banco de dados e melhora drasticamente a performance.
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS jsonb AS $$
DECLARE
    result jsonb;
    total_clients_count int;
    total_marketing_clients_count int;
    new_clients_this_month_count int;
    total_conversations_count int;
    total_respondidas_count int;
    monthly_growth_data jsonb;
    client_types_data jsonb;
    funnel_data jsonb;
    conversation_data_7_days jsonb;
    current_year int;
    first_day_of_month date;
BEGIN
    current_year := EXTRACT(YEAR FROM current_date);
    first_day_of_month := date_trunc('month', current_date);

    -- Contagens agregadas da tabela dados_cliente
    SELECT
        COUNT(*),
        COUNT(*) FILTER (WHERE client_name IS NOT NULL AND client_name <> ''),
        COUNT(*) FILTER (WHERE created_at >= first_day_of_month),
        COUNT(*) FILTER (WHERE telefone IS NOT NULL AND telefone <> ''),
        COUNT(*) FILTER (WHERE client_name IS NOT NULL AND client_name <> '')
    INTO
        total_clients_count,
        total_marketing_clients_count,
        new_clients_this_month_count,
        total_conversations_count,
        total_respondidas_count
    FROM
        public.dados_cliente;

    -- Crescimento mensal para o ano corrente
    SELECT jsonb_agg(monthly_counts)
    INTO monthly_growth_data
    FROM (
        SELECT
            (CASE EXTRACT(MONTH FROM month_series.month)
                WHEN 1 THEN 'Jan' WHEN 2 THEN 'Fev' WHEN 3 THEN 'Mar'
                WHEN 4 THEN 'Abr' WHEN 5 THEN 'Mai' WHEN 6 THEN 'Jun'
                WHEN 7 THEN 'Jul' WHEN 8 THEN 'Ago' WHEN 9 THEN 'Set'
                WHEN 10 THEN 'Out' WHEN 11 THEN 'Nov' WHEN 12 THEN 'Dez'
            END) as month,
            COALESCE(client_counts.count, 0) as clients
        FROM generate_series(
            make_date(current_year, 1, 1),
            make_date(current_year, 12, 1),
            '1 month'
        ) as month_series(month)
        LEFT JOIN (
            SELECT
                date_trunc('month', created_at) as month,
                COUNT(*) as count
            FROM public.dados_cliente
            WHERE EXTRACT(YEAR FROM created_at) = current_year
            GROUP BY 1
        ) as client_counts ON month_series.month = client_counts.month
        ORDER BY month_series.month
    ) as monthly_counts;
    
    -- Tipos de cliente
    SELECT jsonb_agg(type_counts)
    INTO client_types_data
    FROM (
        SELECT
            client_type as name,
            COUNT(*) as value
        FROM public.dados_cliente
        WHERE client_type IS NOT NULL AND client_type <> ''
        GROUP BY client_type
        ORDER BY value DESC
    ) as type_counts;

    -- Dados do funil de conversão
    WITH stages AS (
        SELECT stage, ordering FROM (
            VALUES
                ('Entraram', 1), ('Contato feito', 2), ('Conversa iniciada', 3),
                ('Reunião', 4), ('Proposta', 5), ('Fechamento', 6)
        ) AS v(stage, ordering)
    )
    SELECT jsonb_agg(funnel_counts ORDER BY ordering)
    INTO funnel_data
    FROM (
        SELECT
            s.stage,
            s.ordering,
            COALESCE(c.value, 0) as value
        FROM stages s
        LEFT JOIN (
            SELECT
                COALESCE(kanban_stage, 'Entraram') as stage,
                COUNT(id) as value
            FROM public.dados_cliente
            GROUP BY stage
        ) c ON s.stage = c.stage
    ) as funnel_counts;

    -- Dados de conversas dos últimos 7 dias
    SELECT jsonb_agg(daily_counts)
    INTO conversation_data_7_days
    FROM (
        SELECT
            to_char(day_series.day, 'DD/MM') as date,
            COALESCE(daily_stats.respondidas, 0) as respondidas,
            (COALESCE(daily_stats.total, 0) - COALESCE(daily_stats.respondidas, 0)) as naoRespondidas
        FROM generate_series(
            current_date - interval '6 days',
            current_date,
            '1 day'
        ) as day_series(day)
        LEFT JOIN (
            SELECT
                date_trunc('day', created_at) as day,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE client_name IS NOT NULL AND client_name <> '') as respondidas
            FROM public.dados_cliente
            WHERE created_at >= current_date - interval '7 days'
            GROUP BY 1
        ) as daily_stats ON day_series.day = daily_stats.day
        ORDER BY day_series.day
    ) as daily_counts;

    -- Monta o objeto JSON final com todos os dados
    result := jsonb_build_object(
        'totalClients', total_clients_count,
        'totalMarketingClients', total_marketing_clients_count,
        'newClientsThisMonth', new_clients_this_month_count,
        'totalConversations', total_conversations_count,
        'totalRespondidas', total_respondidas_count,
        'monthlyGrowth', COALESCE(monthly_growth_data, '[]'::jsonb),
        'clientTypes', COALESCE(client_types_data, '[]'::jsonb),
        'funnelData', COALESCE(funnel_data, '[]'::jsonb),
        'conversationData', COALESCE(conversation_data_7_days, '[]'::jsonb)
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Função otimizada para buscar as métricas de UTM de uma só vez.
CREATE OR REPLACE FUNCTION get_utm_metrics()
RETURNS jsonb AS $$
DECLARE
    result jsonb;
    top_sources_data jsonb;
    top_campaigns_data jsonb;
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

    -- Monta o objeto JSON final
    result := jsonb_build_object(
        'totalLeads', metrics_counts.total_leads,
        'totalCampaigns', metrics_counts.total_campaigns,
        'totalConversions', metrics_counts.total_conversions,
        'topSources', COALESCE(top_sources_data, '[]'::jsonb),
        'topCampaigns', COALESCE(top_campaigns_data, '[]'::jsonb)
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;
