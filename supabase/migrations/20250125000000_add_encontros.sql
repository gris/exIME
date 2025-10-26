-- Encontros (Meetings/Events) Table
-- Stores information about IME alumni meetings and events

-- Create the encontros table
CREATE TABLE IF NOT EXISTS public.encontros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    topics JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON COLUMN public.encontros.topics IS 'Array of topics with speaker and talk_name fields';
COMMENT ON TABLE public.encontros IS 'Alumni meetings and events with scheduled topics';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_encontros_date ON public.encontros(date);
CREATE INDEX IF NOT EXISTS idx_encontros_topics ON public.encontros USING GIN(topics);

-- Enable Row Level Security (RLS)
ALTER TABLE public.encontros ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all authenticated users to read encontros
CREATE POLICY "Allow authenticated users to read all encontros"
    ON public.encontros
    FOR SELECT
    TO authenticated
    USING (true);

-- RLS Policy: Allow authenticated users to insert encontros
CREATE POLICY "Allow authenticated users to insert encontros"
    ON public.encontros
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- RLS Policy: Allow authenticated users to update encontros
CREATE POLICY "Allow authenticated users to update encontros"
    ON public.encontros
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policy: Allow authenticated users to delete encontros
CREATE POLICY "Allow authenticated users to delete encontros"
    ON public.encontros
    FOR DELETE
    TO authenticated
    USING (true);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_encontros_updated_at ON public.encontros;
CREATE TRIGGER update_encontros_updated_at
    BEFORE UPDATE ON public.encontros
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.encontros TO authenticated;
GRANT ALL ON public.encontros TO service_role;

