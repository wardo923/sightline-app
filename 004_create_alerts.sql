-- Create alerts table for trade signals
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  timeframe text not null,
  direction text not null check (direction in ('BUY', 'SELL')),
  entry numeric not null,
  stop_loss numeric not null,
  target1 numeric not null,
  target2 numeric,
  risk_reward text,
  setup_type text,
  market_condition text,
  status text default 'pending' check (status in ('pending', 'active', 'invalidated', 'target_hit', 'stopped_out')),
  quality_grade text check (quality_grade in ('A', 'B', 'C')),
  quality_score integer,
  quality_reasons text[],
  read_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.alerts enable row level security;

-- RLS policies
create policy "alerts_select_own" on public.alerts for select using (auth.uid() = user_id);
create policy "alerts_insert_own" on public.alerts for insert with check (auth.uid() = user_id);
create policy "alerts_update_own" on public.alerts for update using (auth.uid() = user_id);
create policy "alerts_delete_own" on public.alerts for delete using (auth.uid() = user_id);
