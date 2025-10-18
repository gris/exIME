import { createClient } from '@supabase/supabase-js'
import { getAuth, clerkClient } from '@clerk/nuxt/server'

export default defineEventHandler(async (event) => {
  const { isAuthenticated, userId } = getAuth(event)
  if (!isAuthenticated || !userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const config = useRuntimeConfig()
  
  if (!config.public.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' })
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )

  try {
    // Get user email from Clerk - EMAIL is the ONLY identifier
    const user = await clerkClient(event).users.getUser(userId)
    const userEmail = user.primaryEmailAddress?.emailAddress

    if (!userEmail) {
      return null
    }

    // Find profile by email ONLY
    const { data: profile, error: emailError } = await supabase
      .from('alumni')
      .select('*')
      .eq('email', userEmail)
      .single()

    if (profile) {
      return profile
    }

    if (emailError && emailError.code !== 'PGRST116') {
      throw createError({ statusCode: 500, statusMessage: emailError.message })
    }
    
    return null
  } catch (error) {
    console.error('Error in profile lookup:', error)
    throw error
  }
})
