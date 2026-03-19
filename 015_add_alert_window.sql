-- Add alert_window column to strategies table
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS alert_window TEXT DEFAULT '09:30-16:00';

-- Add secondary_bundle column if not exists
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS secondary_bundle TEXT;

-- Add wizard_answers column if not exists
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS wizard_answers JSONB DEFAULT '{}';

-- Add confidence_score column if not exists
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS confidence_score INTEGER DEFAULT 0;
