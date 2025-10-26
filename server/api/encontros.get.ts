import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth()
  
  if (!auth?.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const config = useRuntimeConfig()
  
  if (!config.public.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    })
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )

  // Fetch all encontros ordered by date descending (most recent first)
  let { data, error } = await supabase
    .from('encontros')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data || []
})

