-- Add bundle_name column to strategies table
-- This stores the prebuilt bundle selection instead of custom combinations

ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS bundle_name TEXT;

-- Add market_group for categorization
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS market_group TEXT;

-- Create index for bundle lookups
CREATE INDEX IF NOT EXISTS idx_strategies_bundle ON strategies(bundle_name);

-- Comment for documentation
COMMENT ON COLUMN strategies.bundle_name IS 'Prebuilt strategy bundle: index_momentum, index_pullback, largecap_breakout, largecap_pullback, crypto_breakout, crypto_continuation';
COMMENT ON COLUMN strategies.market_group IS 'Market group: index_etf, large_cap, crypto';
