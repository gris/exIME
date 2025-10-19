import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const supabase = useState('supabase', () => {
    return createClient(
      config.public.supabaseUrl,
      config.public.supabasePublishableKey
    )
  })

  return supabase.value
}


