-- Migration script to add profile_image_url field
-- Run this in your Supabase SQL Editor

-- Step 1: Add the profile_image_url column
ALTER TABLE public.alumni 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Step 2: Add index for better query performance (optional)
CREATE INDEX IF NOT EXISTS idx_alumni_has_image ON public.alumni(profile_image_url) 
WHERE profile_image_url IS NOT NULL;

-- Step 3: Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'alumni' 
AND column_name = 'profile_image_url';

