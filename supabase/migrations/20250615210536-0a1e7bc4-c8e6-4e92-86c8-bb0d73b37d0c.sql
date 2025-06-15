
-- Create audit log table for tracking changes to custom field values
CREATE TABLE public.custom_field_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  field_id UUID NOT NULL REFERENCES public.custom_fields(id) ON DELETE CASCADE,
  old_value JSONB,
  new_value JSONB,
  changed_by TEXT, -- Could be user ID or system identifier
  change_type TEXT NOT NULL CHECK (change_type IN ('create', 'update', 'delete')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance on audit queries
CREATE INDEX idx_custom_field_audit_log_client_id ON public.custom_field_audit_log(client_id);
CREATE INDEX idx_custom_field_audit_log_field_id ON public.custom_field_audit_log(field_id);
CREATE INDEX idx_custom_field_audit_log_created_at ON public.custom_field_audit_log(created_at);

-- Add validation rules table for custom fields
CREATE TABLE public.custom_field_validation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  field_id UUID NOT NULL REFERENCES public.custom_fields(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('required', 'min_length', 'max_length', 'pattern', 'min_value', 'max_value')),
  rule_value TEXT,
  error_message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for validation rules
CREATE INDEX idx_custom_field_validation_rules_field_id ON public.custom_field_validation_rules(field_id);

-- Add trigger to update updated_at column for validation rules
CREATE TRIGGER update_custom_field_validation_rules_updated_at 
  BEFORE UPDATE ON public.custom_field_validation_rules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some example validation rules
INSERT INTO public.custom_field_validation_rules (field_id, rule_type, rule_value, error_message)
SELECT 
  cf.id,
  'required',
  'true',
  'Este campo é obrigatório'
FROM public.custom_fields cf
WHERE cf.is_required = true;
