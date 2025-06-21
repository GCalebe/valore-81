-- Create table for managing client tasks
CREATE TABLE IF NOT EXISTS public.tarefas (
  id uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL, -- References the sessionId from dados_cliente
  user_id uuid NOT NULL, -- User who created the task
  titulo text NOT NULL,
  descricao text,
  status text NOT NULL CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')) DEFAULT 'pendente',
  prioridade text NOT NULL CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')) DEFAULT 'media',
  data_vencimento timestamp with time zone,
  data_conclusao timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_tarefas_client_id
  ON public.tarefas(client_id);

CREATE INDEX IF NOT EXISTS idx_tarefas_user_id
  ON public.tarefas(user_id);

CREATE INDEX IF NOT EXISTS idx_tarefas_status
  ON public.tarefas(status);

CREATE INDEX IF NOT EXISTS idx_tarefas_data_vencimento
  ON public.tarefas(data_vencimento);

-- Enable Row Level Security
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own tasks or tasks for clients they have access to
CREATE POLICY "Users can read their own tasks"
  ON public.tarefas
  FOR SELECT
  USING (user_id = auth.uid());

-- Only allow users to insert their own tasks
CREATE POLICY "Users can insert their own tasks"
  ON public.tarefas
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Only allow users to update their own tasks
CREATE POLICY "Users can update their own tasks"
  ON public.tarefas
  FOR UPDATE
  USING (user_id = auth.uid());

-- Only allow users to delete their own tasks
CREATE POLICY "Users can delete their own tasks"
  ON public.tarefas
  FOR DELETE
  USING (user_id = auth.uid());

-- Trigger to update the updated_at column on every update
CREATE OR REPLACE FUNCTION public.update_updated_at_tarefas()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_updated_at_tarefas ON public.tarefas;

CREATE TRIGGER trg_update_updated_at_tarefas
BEFORE UPDATE ON public.tarefas
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_tarefas();