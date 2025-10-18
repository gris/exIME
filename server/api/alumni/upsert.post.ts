import { createClient } from '@supabase/supabase-js'
import { getAuth } from '@clerk/nuxt/server'

export default defineEventHandler(async (event) => {
  const { isAuthenticated, userId, user } = getAuth(event)
  if (!isAuthenticated) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  
  // Security check: ensure user can only edit their own profile
  const userEmail = user?.primaryEmailAddress?.emailAddress
  if (!userEmail || body.email !== userEmail) {
    throw createError({ 
      statusCode: 403, 
      statusMessage: 'Forbidden: You can only edit your own profile' 
    })
  }
  const config = useRuntimeConfig()

  if (!config.public.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' })
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )

  const payload = {
    clerk_user_id: userId,
    name: body.name,
    phone: body.phone ?? null,
    email: body.email,
    linkedin: body.linkedin ?? null,
    role: body.role ?? null,
    current_company: body.current_company ?? null,
    technologies: body.technologies?.length ? body.technologies : null,
    expertise_fields: body.expertise_fields?.length ? body.expertise_fields : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Use upsert to handle both insert and update
  const { error } = await supabase
    .from('alumni')
    .upsert(payload, {
      onConflict: 'clerk_user_id'
    })

  if (error) {
    console.error('Upsert error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true }
})


