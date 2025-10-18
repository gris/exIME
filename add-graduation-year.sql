-- Migration script to add graduation_year field and populate it from existing data
-- Run this in your Supabase SQL Editor

-- Step 1: Add the graduation_year column
ALTER TABLE public.alumni 
ADD COLUMN IF NOT EXISTS graduation_year INTEGER;

-- Step 2: Create a function to extract the year from expertise_fields
-- This looks for a 4-digit number starting with 19 or 20 (years 1900-2099)
CREATE OR REPLACE FUNCTION extract_graduation_year(fields TEXT[])
RETURNS INTEGER AS $$
DECLARE
  field TEXT;
  year_match TEXT;
BEGIN
  IF fields IS NULL THEN
    RETURN NULL;
  END IF;
  
  FOREACH field IN ARRAY fields
  LOOP
    -- Check if the field is a 4-digit year (19xx or 20xx)
    IF field ~ '^(19|20)\d{2}$' THEN
      RETURN field::INTEGER;
    END IF;
  END LOOP;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 3: Update all existing alumni records with graduation year from expertise_fields
UPDATE public.alumni
SET graduation_year = extract_graduation_year(expertise_fields)
WHERE graduation_year IS NULL;

-- Step 4: Clean up - remove year from expertise_fields array
-- This removes any 4-digit year entries from the expertise_fields
UPDATE public.alumni
SET expertise_fields = ARRAY(
  SELECT field 
  FROM unnest(expertise_fields) AS field
  WHERE field !~ '^(19|20)\d{2}$'
)
WHERE expertise_fields IS NOT NULL
AND EXISTS (
  SELECT 1 
  FROM unnest(expertise_fields) AS field 
  WHERE field ~ '^(19|20)\d{2}$'
);

-- Step 5: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_alumni_graduation_year ON public.alumni(graduation_year);

-- Step 6: Verify the migration
SELECT 
  COUNT(*) as total_alumni,
  COUNT(graduation_year) as with_graduation_year,
  MIN(graduation_year) as earliest_year,
  MAX(graduation_year) as latest_year
FROM public.alumni;

-- Show sample of migrated data
SELECT name, graduation_year, expertise_fields
FROM public.alumni
WHERE graduation_year IS NOT NULL
ORDER BY graduation_year DESC
LIMIT 10;

-- Drop the temporary function (optional - you can keep it if you want to use it later)
-- DROP FUNCTION IF EXISTS extract_graduation_year(TEXT[]);
