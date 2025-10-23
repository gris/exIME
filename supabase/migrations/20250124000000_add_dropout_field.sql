-- Add dropout field to alumni table
-- This allows users to indicate they dropped out instead of having a graduation year

ALTER TABLE public.alumni 
ADD COLUMN IF NOT EXISTS is_dropout BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN public.alumni.is_dropout IS 'Indicates if the person dropped out (true) or graduated with a year (false)';

-- Add a check constraint to ensure either graduation_year is set OR is_dropout is true (but not both with year)
ALTER TABLE public.alumni 
ADD CONSTRAINT check_graduation_or_dropout 
CHECK (
  (graduation_year IS NULL AND is_dropout = TRUE) OR 
  (graduation_year IS NOT NULL AND is_dropout = FALSE) OR
  (graduation_year IS NULL AND is_dropout = FALSE)
);

