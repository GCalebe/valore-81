
-- Table: public.kanban_stages
CREATE TABLE IF NOT EXISTS public.kanban_stages (
  id uuid PRIMARY KEY NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  ordering integer NOT NULL DEFAULT 0,
  settings jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for quick lookups and sorting
CREATE INDEX IF NOT EXISTS idx_kanban_stages_user_order
  ON public.kanban_stages(user_id, ordering);

-- Enable Row Level Security
ALTER TABLE public.kanban_stages ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own stages
CREATE POLICY "Users can read their own kanban stages"
  ON public.kanban_stages
  FOR SELECT
  USING (user_id = auth.uid());

-- Only allow users to insert their own stages
CREATE POLICY "Users can insert their own kanban stages"
  ON public.kanban_stages
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Only allow users to update their own stages
CREATE POLICY "Users can update their own kanban stages"
  ON public.kanban_stages
  FOR UPDATE
  USING (user_id = auth.uid());

-- Only allow users to delete their own stages
CREATE POLICY "Users can delete their own kanban stages"
  ON public.kanban_stages
  FOR DELETE
  USING (user_id = auth.uid());

-- Trigger to update the updated_at column on every update
CREATE OR REPLACE FUNCTION public.update_updated_at_kanban_stages()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_updated_at_kanban_stages ON public.kanban_stages;

CREATE TRIGGER trg_update_updated_at_kanban_stages
BEFORE UPDATE ON public.kanban_stages
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_kanban_stages();
