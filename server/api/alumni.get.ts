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

  let { data, error } = await supabase
    .from('alumni')
    .select('*')
    .order('name', { ascending: true, nullsFirst: false })

  // If ordering by name fails, try without ordering
  if (error) {
    console.warn('Error with name ordering, trying without order:', error)
    const fallback = await supabase
      .from('alumni')
      .select('*')
    
    data = fallback.data
    error = fallback.error
  }

  if (error) {
    console.error('Supabase error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data || []
})


