-- Migration script to update existing database for email-based profile matching
-- Run this AFTER running the initial supabase-setup.sql

-- Step 1: Make clerk_user_id nullable (for imported profiles that don't have Clerk accounts yet)
ALTER TABLE public.alumni ALTER COLUMN clerk_user_id DROP NOT NULL;

-- Step 2: Add unique constraint to email field
ALTER TABLE public.alumni ADD CONSTRAINT alumni_email_unique UNIQUE (email);

-- Step 3: Add a constraint to ensure either clerk_user_id exists OR it's an imported profile
-- This helps maintain data integrity while allowing unclaimed imported profiles
ALTER TABLE public.alumni ADD CONSTRAINT alumni_user_association_check 
CHECK (
  clerk_user_id IS NOT NULL OR 
  (created_at < NOW() AND email IS NOT NULL)
);

-- Step 4: Update the existing data - remove placeholder clerk_user_ids from imported data
-- This will allow the sync system to properly claim profiles by email
UPDATE public.alumni 
SET clerk_user_id = NULL 
WHERE clerk_user_id LIKE '00000000-0000-0000-0000-%';

-- Step 5: Create improved RLS policies that work with email-based matching
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.alumni;
DROP POLICY IF EXISTS "Allow users to delete their own profile" ON public.alumni;

-- New policy: Allow users to update profiles they own (by clerk_user_id) or can claim (by email)
CREATE POLICY "Allow users to update their profiles"
    ON public.alumni
    FOR UPDATE
    TO authenticated
    USING (
      clerk_user_id = auth.jwt() ->> 'sub' OR
      (clerk_user_id IS NULL AND email = auth.jwt() ->> 'email')
    )
    WITH CHECK (
      clerk_user_id = auth.jwt() ->> 'sub'
    );

-- New policy: Allow users to delete profiles they own
CREATE POLICY "Allow users to delete their profiles"
    ON public.alumni
    FOR DELETE
    TO authenticated
    USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Step 6: Create a function to help with profile claiming
CREATE OR REPLACE FUNCTION public.get_user_profile(user_clerk_id TEXT, user_email TEXT)
RETURNS public.alumni AS $$
DECLARE
  profile public.alumni;
BEGIN
  -- First try to find by clerk_user_id
  SELECT * INTO profile FROM public.alumni WHERE clerk_user_id = user_clerk_id;
  
  IF profile IS NOT NULL THEN
    RETURN profile;
  END IF;
  
  -- Then try to find by email
  SELECT * INTO profile FROM public.alumni WHERE email = user_email;
  
  RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_user_profile(TEXT, TEXT) TO authenticated;

-- Step 7: Add helpful comments
COMMENT ON COLUMN public.alumni.clerk_user_id IS 'Clerk user ID - NULL for unclaimed imported profiles';
COMMENT ON COLUMN public.alumni.email IS 'User email - used for profile claiming and uniqueness';
COMMENT ON TABLE public.alumni IS 'Alumni profiles - can be claimed by matching email addresses';

-- Confirmation message
DO $$
BEGIN
  RAISE NOTICE 'Email-based profile matching migration completed successfully!';
  RAISE NOTICE 'Imported profiles can now be claimed by users with matching email addresses.';
END $$;
