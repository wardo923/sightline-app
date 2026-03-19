-- Refactor alerts table to be a notification delivery log only
-- Signals are the source of truth for trade setups
-- Alerts track when notifications were sent (email, SMS, webhook)

-- First, drop the old alerts table (it was duplicating signals)
DROP TABLE IF EXISTS public.alerts;

-- Create new alerts table as notification delivery log
CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  signal_id uuid REFERENCES public.signals(id) ON DELETE CASCADE,
  
  -- Delivery channel
  channel text NOT NULL CHECK (channel IN ('email', 'sms', 'push', 'webhook')),
  
  -- What was sent
  alert_type text NOT NULL CHECK (alert_type IN (
    'signal_created',
    'entry_triggered', 
    'target_hit',
    'stop_hit',
    'invalidated',
    'status_update'
  )),
  
  -- Delivery status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  
  -- Metadata
  recipient text, -- email address or phone number
  message_preview text,
  error_message text,
  
  -- Timestamps
  sent_at timestamp with time zone,
  read_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "alerts_select_own" ON public.alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "alerts_insert_own" ON public.alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "alerts_update_own" ON public.alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "alerts_delete_own" ON public.alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Admin can view all alerts
CREATE POLICY "admins_select_all_alerts" ON public.alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_signal_id ON public.alerts(signal_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.alerts(status);
