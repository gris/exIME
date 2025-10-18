-- IME Alumni Directory - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create the alumni table
CREATE TABLE IF NOT EXISTS public.alumni (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL,
    linkedin TEXT,
    role TEXT,
    current_company TEXT,
    technologies TEXT[],
    expertise_fields TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_alumni_clerk_user_id ON public.alumni(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_alumni_name ON public.alumni(name);
CREATE INDEX IF NOT EXISTS idx_alumni_email ON public.alumni(email);
CREATE INDEX IF NOT EXISTS idx_alumni_technologies ON public.alumni USING GIN(technologies);
CREATE INDEX IF NOT EXISTS idx_alumni_expertise_fields ON public.alumni USING GIN(expertise_fields);

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

-- RLS Policy: Allow users to update only their own profile
CREATE POLICY "Allow users to update their own profile"
    ON public.alumni
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policy: Allow users to delete only their own profile (optional)
CREATE POLICY "Allow users to delete their own profile"
    ON public.alumni
    FOR DELETE
    TO authenticated
    USING (true);

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

-- Grant necessary permissions
GRANT ALL ON public.alumni TO authenticated;
GRANT ALL ON public.alumni TO service_role;

