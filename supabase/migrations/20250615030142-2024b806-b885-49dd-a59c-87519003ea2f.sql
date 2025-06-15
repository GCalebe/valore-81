
-- Create utm_tracking table for marketing campaign tracking
CREATE TABLE public.utm_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES contacts(id) ON DELETE CASCADE,

  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  utm_referrer TEXT,
  referrer TEXT,
  gclid TEXT,
  fbclid TEXT,
  gclientid TEXT,
  utm_session_id TEXT,

  utm_created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  utm_first_touch TIMESTAMP WITH TIME ZONE,
  utm_last_touch TIMESTAMP WITH TIME ZONE,

  first_utm_source TEXT,
  first_utm_medium TEXT,
  first_utm_campaign TEXT,
  first_utm_term TEXT,
  first_utm_content TEXT,
  first_utm_created_at TIMESTAMP WITH TIME ZONE,

  last_utm_source TEXT,
  last_utm_medium TEXT,
  last_utm_campaign TEXT,
  last_utm_term TEXT,
  last_utm_content TEXT,
  last_utm_created_at TIMESTAMP WITH TIME ZONE,

  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  landing_page TEXT,

  utm_conversion BOOLEAN DEFAULT false,
  utm_conversion_at TIMESTAMP WITH TIME ZONE,
  utm_conversion_value NUMERIC,
  utm_conversion_stage TEXT,
  utm_conversion_time INTERVAL,

  inserted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.utm_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since this is metrics data)
CREATE POLICY "Allow public read access to utm_tracking" 
  ON public.utm_tracking 
  FOR SELECT 
  USING (true);

-- Create policy for authenticated users to insert/update
CREATE POLICY "Allow authenticated users to manage utm_tracking" 
  ON public.utm_tracking 
  FOR ALL 
  USING (true);

-- Create index for better performance
CREATE INDEX idx_utm_tracking_lead_id ON public.utm_tracking(lead_id);
CREATE INDEX idx_utm_tracking_campaign ON public.utm_tracking(utm_campaign);
CREATE INDEX idx_utm_tracking_source ON public.utm_tracking(utm_source);
CREATE INDEX idx_utm_tracking_created_at ON public.utm_tracking(utm_created_at);

-- Add trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_utm_tracking()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_updated_at_utm_tracking
  BEFORE UPDATE ON public.utm_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_utm_tracking();
