
-- Etapa 1: Corrigir a coluna 'created_at' na tabela 'dados_cliente'
-- Primeiro, preenchemos os valores nulos existentes com a data e hora atuais para evitar erros em dados passados.
UPDATE public.dados_cliente
SET created_at = now()
WHERE created_at IS NULL;

-- Depois, garantimos que novos clientes sempre tenham uma data de criação, definindo um valor padrão.
ALTER TABLE public.dados_cliente 
ALTER COLUMN created_at SET DEFAULT now();

-- E tornamos a coluna obrigatória (não nula) para evitar problemas futuros.
ALTER TABLE public.dados_cliente 
ALTER COLUMN created_at SET NOT NULL;


-- Etapa 2: Otimizar a busca de mensagens de chat
-- Criamos uma "view" (uma espécie de tabela virtual otimizada) para obter a última mensagem de cada conversa de forma muito mais rápida.
-- Isso vai nos permitir buscar todas as últimas mensagens de uma só vez, em vez de uma por uma.
CREATE OR REPLACE VIEW public.latest_chat_messages AS
SELECT DISTINCT ON (session_id)
    id,
    session_id,
    message,
    COALESCE(hora, data, '1970-01-01T00:00:00Z'::timestamp with time zone) AS message_time
FROM
    public.n8n_chat_histories
ORDER BY
    session_id, id DESC;
