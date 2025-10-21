-- IME Alumni Directory - Initial Database Schema
-- This migration represents the complete current state of the database

-- Create the alumni table with all current fields
CREATE TABLE IF NOT EXISTS public.alumni (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL UNIQUE,
    linkedin TEXT,
    role TEXT,
    current_company TEXT,
    graduation_year INTEGER,
    profile_image_url TEXT,
    technologies TEXT[],
    expertise_fields TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON COLUMN public.alumni.clerk_user_id IS 'Clerk user ID - NULL for unclaimed imported profiles';
COMMENT ON COLUMN public.alumni.email IS 'User email - used for profile claiming and uniqueness';
COMMENT ON TABLE public.alumni IS 'Alumni profiles - can be claimed by matching email addresses';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_alumni_clerk_user_id ON public.alumni(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_alumni_name ON public.alumni(name);
CREATE INDEX IF NOT EXISTS idx_alumni_email ON public.alumni(email);
CREATE INDEX IF NOT EXISTS idx_alumni_graduation_year ON public.alumni(graduation_year);
CREATE INDEX IF NOT EXISTS idx_alumni_technologies ON public.alumni USING GIN(technologies);
CREATE INDEX IF NOT EXISTS idx_alumni_expertise_fields ON public.alumni USING GIN(expertise_fields);
CREATE INDEX IF NOT EXISTS idx_alumni_has_image ON public.alumni(profile_image_url) 
WHERE profile_image_url IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated users to read all alumni profiles
CREATE POLICY "Allow authenticated users to read all alumni"
    ON public.alumni
    FOR SELECT
    TO authenticated
    USING (true);

-- RLS Policy: Allow users to insert their own profile
CREATE POLICY "Allow users to insert their own profile"
    ON public.alumni
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- RLS Policy: Allow users to update profiles they own (by clerk_user_id) or can claim (by email)
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

-- RLS Policy: Allow users to delete profiles they own
CREATE POLICY "Allow users to delete their profiles"
    ON public.alumni
    FOR DELETE
    TO authenticated
    USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_alumni_updated_at ON public.alumni;
CREATE TRIGGER update_alumni_updated_at
    BEFORE UPDATE ON public.alumni
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a helper function for profile claiming
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

-- Create a utility function to extract graduation year from an array
-- This is useful for data migration/cleanup scenarios
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

-- Grant necessary permissions
GRANT ALL ON public.alumni TO authenticated;
GRANT ALL ON public.alumni TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_profile(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.extract_graduation_year(TEXT[]) TO authenticated;

