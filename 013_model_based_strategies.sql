-- Migration: Update strategies table for locked model-based system
-- Adds market_type, asset, model_name columns and removes old bundle columns

-- Add new columns for model-based system
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS market_type TEXT CHECK (market_type IN ('index_etf', 'large_cap', 'crypto')),
ADD COLUMN IF NOT EXISTS asset TEXT,
ADD COLUMN IF NOT EXISTS model_name TEXT CHECK (model_name IN (
  'INDEX_MOMENTUM', 
  'INDEX_PULLBACK', 
  'INDEX_REVERSAL',
  'LARGECAP_BREAKOUT',
  'LARGECAP_PULLBACK',
  'CRYPTO_BREAKOUT',
  'CRYPTO_CONTINUATION'
)),
ADD COLUMN IF NOT EXISTS alert_frequency TEXT DEFAULT 'realtime' CHECK (alert_frequency IN ('realtime', 'batched')),
ADD COLUMN IF NOT EXISTS account_size DECIMAL(12,2);

-- Update risk_per_trade to have proper constraint if not exists
-- (keeping existing column, just ensuring it works)

-- Create index for faster lookups by model
CREATE INDEX IF NOT EXISTS idx_strategies_model ON strategies(model_name);
CREATE INDEX IF NOT EXISTS idx_strategies_asset ON strategies(asset);

-- Add comment explaining the model system
COMMENT ON COLUMN strategies.model_name IS 'Locked SightLine model with predefined rules - users cannot customize internal logic';
COMMENT ON COLUMN strategies.market_type IS 'Market category: index_etf, large_cap, or crypto';
COMMENT ON COLUMN strategies.asset IS 'Single selected asset for this strategy';
