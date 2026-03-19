-- Set onboarding_complete for existing users who have a strategy
UPDATE profiles
SET onboarding_complete = true
WHERE id IN (
  SELECT DISTINCT user_id FROM strategies
);

-- Also set it for any user who has been using the app (has a profile)
UPDATE profiles
SET onboarding_complete = true
WHERE onboarding_complete IS NULL OR onboarding_complete = false;
