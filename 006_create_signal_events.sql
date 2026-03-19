-- Create signal_events table for tracking every signal update over time
CREATE TABLE IF NOT EXISTS public.signal_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID NOT NULL REFERENCES public.signals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'signal_created',
    'entry_triggered',
    'target_1_hit',
    'target_2_hit',
    'stop_loss_hit',
    'invalidated',
    'expired',
    'manual_closed'
  )),
  notes TEXT,
  price_at_event NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_signal_events_signal_id ON public.signal_events(signal_id);
CREATE INDEX IF NOT EXISTS idx_signal_events_user_id ON public.signal_events(user_id);
CREATE INDEX IF NOT EXISTS idx_signal_events_created_at ON public.signal_events(created_at DESC);

-- Enable RLS
ALTER TABLE public.signal_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only access their own signal events
CREATE POLICY "signal_events_select_own" ON public.signal_events 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "signal_events_insert_own" ON public.signal_events 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "signal_events_update_own" ON public.signal_events 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "signal_events_delete_own" ON public.signal_events 
  FOR DELETE USING (auth.uid() = user_id);
