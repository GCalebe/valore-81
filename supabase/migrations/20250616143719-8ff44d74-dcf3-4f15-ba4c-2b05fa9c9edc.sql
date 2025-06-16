
-- First, let's check what triggers are causing issues and fix them
-- We need to handle the updated_at trigger issue before proceeding

-- 1. Check if contacts table has updated_at column, if not add it
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contacts' AND column_name = 'updated_at') THEN
        ALTER TABLE contacts ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- 2. Check if conversations table has updated_at column, if not add it
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'conversations' AND column_name = 'updated_at') THEN
        ALTER TABLE conversations ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- 3. Now proceed with the data migration
-- MIGRAÇÃO DE DADOS: dados_cliente → contacts
INSERT INTO contacts (
  id,
  name,
  email,
  phone,
  client_name,
  client_size,
  client_type,
  cpf_cnpj,
  asaas_customer_id,
  status,
  kanban_stage,
  session_id,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  COALESCE(nome, 'Cliente sem nome'),
  email,
  telefone,
  client_name,
  client_size,
  client_type,
  cpf_cnpj,
  asaas_customer_id,
  'Active',
  COALESCE(kanban_stage, 'Entraram'),
  sessionid,
  COALESCE(created_at, now()),
  now()
FROM dados_cliente dc
WHERE NOT EXISTS (
  SELECT 1 FROM contacts c 
  WHERE (c.phone = dc.telefone AND dc.telefone IS NOT NULL AND dc.telefone <> '')
     OR (c.email = dc.email AND dc.email IS NOT NULL AND dc.email <> '')
     OR (c.session_id = dc.sessionid AND dc.sessionid IS NOT NULL AND dc.sessionid <> '')
);

-- 4. ATUALIZAR REGISTROS EXISTENTES EM CONTACTS COM DADOS MAIS COMPLETOS
UPDATE contacts 
SET 
  client_name = COALESCE(contacts.client_name, dc.client_name),
  client_size = COALESCE(contacts.client_size, dc.client_size),
  client_type = COALESCE(contacts.client_type, dc.client_type),
  cpf_cnpj = COALESCE(contacts.cpf_cnpj, dc.cpf_cnpj),
  asaas_customer_id = COALESCE(contacts.asaas_customer_id, dc.asaas_customer_id),
  kanban_stage = COALESCE(contacts.kanban_stage, dc.kanban_stage, 'Entraram'),
  session_id = COALESCE(contacts.session_id, dc.sessionid),
  updated_at = now()
FROM dados_cliente dc
WHERE (contacts.phone = dc.telefone AND dc.telefone IS NOT NULL AND dc.telefone <> '')
   OR (contacts.email = dc.email AND dc.email IS NOT NULL AND dc.email <> '')
   OR (contacts.session_id = dc.sessionid AND dc.sessionid IS NOT NULL AND dc.sessionid <> '');

-- 5. CONSOLIDAÇÃO DE CONVERSAS
INSERT INTO conversations (
  id,
  name,
  phone,
  session_id,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  COALESCE(dc.nome, 'Cliente sem nome'),
  ch.phone,
  ch.conversation_id,
  COALESCE(ch.created_at, now()),
  now()
FROM chats ch
LEFT JOIN dados_cliente dc ON dc.sessionid = ch.conversation_id
WHERE ch.conversation_id IS NOT NULL 
  AND ch.conversation_id <> ''
  AND NOT EXISTS (
    SELECT 1 FROM conversations cv 
    WHERE cv.session_id = ch.conversation_id
  );

-- 6. MIGRAR MENSAGENS DE CHAT_MESSAGES PARA N8N_CHAT_HISTORIES
INSERT INTO n8n_chat_histories (
  session_id,
  message,
  hora
)
SELECT 
  conversation_id,
  jsonb_build_object(
    'user_message', user_message,
    'bot_message', bot_message,
    'type', message_type,
    'data', data,
    'migrated_from', 'chat_messages'
  ),
  COALESCE(created_at::timestamp with time zone, now())
FROM chat_messages
WHERE conversation_id IS NOT NULL
  AND conversation_id <> ''
  AND NOT EXISTS (
    SELECT 1 FROM n8n_chat_histories nh 
    WHERE nh.session_id = chat_messages.conversation_id 
      AND nh.message->>'migrated_from' = 'chat_messages'
  );

-- 7. BACKUP E LIMPEZA (renomear tabelas originais)
ALTER TABLE dados_cliente RENAME TO dados_cliente_backup;
ALTER TABLE chat_messages RENAME TO chat_messages_backup;
ALTER TABLE chats RENAME TO chats_backup;

-- 8. CRIAR VIEW TEMPORÁRIA PARA COMPATIBILIDADE
CREATE OR REPLACE VIEW dados_cliente AS 
SELECT 
  ROW_NUMBER() OVER (ORDER BY created_at)::bigint as id,
  name as nome,
  email,
  phone as telefone,
  session_id as sessionid,
  client_name,
  client_size,
  client_type,
  cpf_cnpj,
  asaas_customer_id,
  NULL::jsonb as payments,
  created_at,
  kanban_stage,
  NULL::text as nome_pet,
  NULL::text as porte_pet,
  NULL::text as raca_pet
FROM contacts
WHERE deleted_at IS NULL;

-- 9. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_session_id ON contacts(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_n8n_chat_histories_session_id ON n8n_chat_histories(session_id) WHERE session_id IS NOT NULL;

-- 10. ATUALIZAR FUNÇÃO DE MÉTRICAS PARA USAR CONTACTS
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
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

    -- Contagens agregadas da tabela contacts (em vez de dados_cliente)
    SELECT
        COUNT(*),
        COUNT(*) FILTER (WHERE client_name IS NOT NULL AND client_name <> ''),
        COUNT(*) FILTER (WHERE created_at >= first_day_of_month),
        COUNT(*) FILTER (WHERE phone IS NOT NULL AND phone <> ''),
        COUNT(*) FILTER (WHERE client_name IS NOT NULL AND client_name <> '')
    INTO
        total_clients_count,
        total_marketing_clients_count,
        new_clients_this_month_count,
        total_conversations_count,
        total_respondidas_count
    FROM
        public.contacts
    WHERE deleted_at IS NULL;

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
            FROM public.contacts
            WHERE EXTRACT(YEAR FROM created_at) = current_year
              AND deleted_at IS NULL
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
        FROM public.contacts
        WHERE client_type IS NOT NULL AND client_type <> ''
          AND deleted_at IS NULL
        GROUP BY client_type
        ORDER BY value DESC
    ) as type_counts;

    -- Dados do funil de conversão usando estágios kanban reais
    WITH stages AS (
        SELECT stage, ordering FROM (
            VALUES
                ('Entraram', 1), ('Conversaram', 2), ('Agendaram', 3),
                ('Compareceram', 4), ('Negociaram', 5), ('Converteram', 6)
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
            FROM public.contacts
            WHERE deleted_at IS NULL
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
            FROM public.contacts
            WHERE created_at >= current_date - interval '7 days'
              AND deleted_at IS NULL
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
$function$;
