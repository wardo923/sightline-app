-- Create strategies table to store user trading configurations
create table if not exists public.strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  markets text[] default '{}',
  trading_style text,
  timeframe text,
  time_of_day text,
  setup_preference text,
  confirmation_style text,
  alert_style text,
  signal_frequency text,
  risk_per_trade text,
  account_size text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.strategies enable row level security;

-- RLS policies
create policy "strategies_select_own" on public.strategies for select using (auth.uid() = user_id);
create policy "strategies_insert_own" on public.strategies for insert with check (auth.uid() = user_id);
create policy "strategies_update_own" on public.strategies for update using (auth.uid() = user_id);
create policy "strategies_delete_own" on public.strategies for delete using (auth.uid() = user_id);
