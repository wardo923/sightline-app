-- Add V1 signal fields for Setup Quality and Watch Level
-- These fields support the new conservative V1 engine

ALTER TABLE signals 
ADD COLUMN IF NOT EXISTS setup_quality TEXT CHECK (setup_quality IN ('Elite', 'Strong', 'Developing')),
ADD COLUMN IF NOT EXISTS watch_level DECIMAL(20,8),
ADD COLUMN IF NOT EXISTS v1_score INTEGER CHECK (v1_score >= 0 AND v1_score <= 9);

-- Add index for filtering by setup quality
CREATE INDEX IF NOT EXISTS idx_signals_setup_quality ON signals(setup_quality);

COMMENT ON COLUMN signals.setup_quality IS 'V1 Setup Quality: Elite (7-9), Strong (5-6), Developing (4)';
COMMENT ON COLUMN signals.watch_level IS 'V1 Watch Level: Key price level being monitored';
COMMENT ON COLUMN signals.v1_score IS 'V1 Engine Score: 0-9 based on conditions met';
