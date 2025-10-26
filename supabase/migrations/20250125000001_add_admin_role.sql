-- Add admin role to alumni table
-- This allows certain users to have administrative privileges

-- Add is_admin column to alumni table
ALTER TABLE public.alumni ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Add index for admin queries
CREATE INDEX IF NOT EXISTS idx_alumni_is_admin ON public.alumni(is_admin) WHERE is_admin = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN public.alumni.is_admin IS 'Whether the user has administrative privileges';

-- Update RLS policies for encontros to only allow admins to write
DROP POLICY IF EXISTS "Allow authenticated users to insert encontros" ON public.encontros;
DROP POLICY IF EXISTS "Allow authenticated users to update encontros" ON public.encontros;
DROP POLICY IF EXISTS "Allow authenticated users to delete encontros" ON public.encontros;

-- RLS Policy: Allow only admins to insert encontros
CREATE POLICY "Allow admins to insert encontros"
    ON public.encontros
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.alumni
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
            AND is_admin = TRUE
        )
    );

-- RLS Policy: Allow only admins to update encontros
CREATE POLICY "Allow admins to update encontros"
    ON public.encontros
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.alumni
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
            AND is_admin = TRUE
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.alumni
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
            AND is_admin = TRUE
        )
    );

-- RLS Policy: Allow only admins to delete encontros
CREATE POLICY "Allow admins to delete encontros"
    ON public.encontros
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.alumni
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
            AND is_admin = TRUE
        )
    );

-- Create a helper function to check if a user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(user_clerk_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT a.is_admin INTO is_admin 
  FROM public.alumni a 
  WHERE a.clerk_user_id = user_clerk_id;
  
  RETURN COALESCE(is_admin, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.is_user_admin(TEXT) TO authenticated;

