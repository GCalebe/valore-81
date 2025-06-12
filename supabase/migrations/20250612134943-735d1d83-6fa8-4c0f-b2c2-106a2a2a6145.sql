
-- Adicionar colunas necessárias para agência de marketing digital na tabela dados_cliente
ALTER TABLE dados_cliente 
ADD COLUMN IF NOT EXISTS kanban_stage text DEFAULT 'Entraram',
ADD COLUMN IF NOT EXISTS client_name text,
ADD COLUMN IF NOT EXISTS client_size text,
ADD COLUMN IF NOT EXISTS client_type text;

-- Migrar dados existentes de pet para marketing digital
UPDATE dados_cliente 
SET 
  client_name = nome_pet,
  client_size = porte_pet,
  client_type = raca_pet
WHERE client_name IS NULL;

-- Adicionar constraint para kanban_stage
ALTER TABLE dados_cliente 
ADD CONSTRAINT check_kanban_stage 
CHECK (kanban_stage IN ('Entraram', 'Conversaram', 'Agendaram', 'Compareceram', 'Negociaram', 'Postergaram', 'Converteram'));
