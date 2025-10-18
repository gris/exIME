-- Fix the alumni table constraint to allow NULL clerk_user_id
-- This enables email-based profile claiming
-- Run this in your Supabase SQL Editor

-- Drop the existing check constraint
ALTER TABLE public.alumni 
DROP CONSTRAINT IF EXISTS alumni_user_association_check;

-- Verify the constraint is removed
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.alumni'::regclass
AND contype = 'c'; -- 'c' means check constraint

