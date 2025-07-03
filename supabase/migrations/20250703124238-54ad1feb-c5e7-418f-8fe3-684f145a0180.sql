-- Delete all users from auth.users table
-- This will cascade to delete related data in other tables due to foreign key constraints
DELETE FROM auth.users;