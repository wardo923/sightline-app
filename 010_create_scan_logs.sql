-- Create scan_logs table for tracking user scan usage
CREATE TABLE IF NOT EXISTS public.scan_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- Index for efficient daily count queries
CREATE INDEX IF NOT EXISTS idx_scan_logs_user_date ON public.scan_logs(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own scan logs
CREATE POLICY "scan_logs_select_own" ON public.scan_logs FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert scan logs
CREATE POLICY "scan_logs_insert" ON public.scan_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Clean up old scan logs (keep last 7 days) - run via cron
-- DELETE FROM public.scan_logs WHERE created_at < NOW() - INTERVAL '7 days';
