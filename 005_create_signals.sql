-- Create signals table for tracking all generated signals per user
CREATE TABLE IF NOT EXISTS public.signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES public.strategies(id) ON DELETE SET NULL,
  asset TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL')),
  setup_type TEXT,
  signal_grade TEXT CHECK (signal_grade IN ('A', 'B', 'C')),
  entry_price NUMERIC NOT NULL,
  stop_loss NUMERIC NOT NULL,
  target_1 NUMERIC NOT NULL,
  target_2 NUMERIC,
  reward_risk_ratio NUMERIC,
  structure_bias TEXT,
  why_qualifies JSONB DEFAULT '[]'::jsonb,
  market_condition TEXT CHECK (market_condition IN ('trending', 'ranging', 'compression', 'volatile')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'hit_target_1', 'hit_target_2', 'stopped_out', 'invalidated', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_signals_user_id ON public.signals(user_id);
CREATE INDEX IF NOT EXISTS idx_signals_status ON public.signals(status);
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON public.signals(created_at DESC);

-- Enable RLS
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only access their own signals
CREATE POLICY "signals_select_own" ON public.signals 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "signals_insert_own" ON public.signals 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "signals_update_own" ON public.signals 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "signals_delete_own" ON public.signals 
  FOR DELETE USING (auth.uid() = user_id);
