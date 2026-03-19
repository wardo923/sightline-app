-- Set a user as admin by their email address
-- Replace 'your-email@example.com' with your actual email

UPDATE profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'wardo923@aol.com'
);
