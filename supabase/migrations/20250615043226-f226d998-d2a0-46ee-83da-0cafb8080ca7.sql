
-- Adicionar novos campos à tabela utm_tracking
ALTER TABLE public.utm_tracking 
ADD COLUMN IF NOT EXISTS utm_id text,
ADD COLUMN IF NOT EXISTS geo_location jsonb,
ADD COLUMN IF NOT EXISTS utm_first_touch timestamp with time zone,
ADD COLUMN IF NOT EXISTS utm_last_touch timestamp with time zone;

-- Criar índices para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_utm_tracking_utm_id ON public.utm_tracking(utm_id);
CREATE INDEX IF NOT EXISTS idx_utm_tracking_first_touch ON public.utm_tracking(utm_first_touch);
CREATE INDEX IF NOT EXISTS idx_utm_tracking_last_touch ON public.utm_tracking(utm_last_touch);
CREATE INDEX IF NOT EXISTS idx_utm_tracking_created_at ON public.utm_tracking(utm_created_at);

-- Comentários para documentar os campos
COMMENT ON COLUMN public.utm_tracking.utm_id IS 'ID único do UTM gerado';
COMMENT ON COLUMN public.utm_tracking.gclid IS 'Google Ads Click ID';
COMMENT ON COLUMN public.utm_tracking.fbclid IS 'Facebook Ads Click ID';
COMMENT ON COLUMN public.utm_tracking.referrer IS 'URL de referência que trouxe o usuário';
COMMENT ON COLUMN public.utm_tracking.device_type IS 'Tipo de dispositivo inferido via user agent';
COMMENT ON COLUMN public.utm_tracking.geo_location IS 'Localização geográfica baseada no IP (JSON com país, estado, cidade)';
COMMENT ON COLUMN public.utm_tracking.utm_created_at IS 'Data de geração do link UTM';
COMMENT ON COLUMN public.utm_tracking.utm_first_touch IS 'Primeiro toque do usuário na jornada';
COMMENT ON COLUMN public.utm_tracking.utm_last_touch IS 'Último toque do usuário na jornada';
