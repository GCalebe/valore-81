
-- Create table for custom fields definitions
CREATE TABLE public.custom_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'single_select', 'multi_select')),
  field_options JSONB DEFAULT NULL,
  is_required BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL DEFAULT 'basic' CHECK (category IN ('basic', 'commercial', 'personalized', 'documents')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing client custom field values
CREATE TABLE public.client_custom_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL, -- This will reference the sessionId from dados_cliente
  field_id UUID NOT NULL REFERENCES public.custom_fields(id) ON DELETE CASCADE,
  field_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, field_id)
);

-- Add indexes for better performance
CREATE INDEX idx_client_custom_values_client_id ON public.client_custom_values(client_id);
CREATE INDEX idx_client_custom_values_field_id ON public.client_custom_values(field_id);
CREATE INDEX idx_custom_fields_category ON public.custom_fields(category);

-- Add trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_fields_updated_at 
  BEFORE UPDATE ON public.custom_fields 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_custom_values_updated_at 
  BEFORE UPDATE ON public.client_custom_values 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample custom fields for testing
INSERT INTO public.custom_fields (field_name, field_type, field_options, category, is_required) VALUES
('Experiência Náutica', 'single_select', '["Iniciante", "Intermediário", "Avançado", "Profissional"]', 'basic', false),
('Região de Interesse', 'text', null, 'basic', false),
('Tipo de Embarcação', 'single_select', '["Lancha", "Veleiro", "Iate", "Jet Ski", "Barco de Pesca"]', 'commercial', false),
('Faixa de Preço', 'single_select', '["Até R$ 100k", "R$ 100k - R$ 500k", "R$ 500k - R$ 1M", "Acima de R$ 1M"]', 'commercial', false),
('Atividades Preferidas', 'multi_select', '["Pesca", "Passeio", "Esporte", "Mergulho", "Navegação"]', 'personalized', false),
('Documentos Enviados', 'multi_select', '["RG", "CPF", "Comprovante de Renda", "Habilitação Náutica"]', 'documents', false);
