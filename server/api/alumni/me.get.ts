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
    // Get user email from Clerk - this is our primary identifier
    const user = await clerkClient(event).users.getUser(userId)
    const userEmail = user.primaryEmailAddress?.emailAddress

    if (!userEmail) {
      return null
    }

    // PRIORITY: Find profile by email (most reliable identifier)
    const { data: profileByEmail, error: emailError } = await supabase
      .from('alumni')
      .select('*')
      .eq('email', userEmail)
      .single()

    if (profileByEmail) {
      // Update the clerk_user_id if it's different or missing
      // This handles multiple Clerk accounts with same verified email
      if (!profileByEmail.clerk_user_id || profileByEmail.clerk_user_id !== userId) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('alumni')
          .update({
            clerk_user_id: userId,
            name: user.fullName || profileByEmail.name,
            updated_at: new Date().toISOString()
          })
          .eq('email', userEmail)
          .select()
          .single()

        if (!updateError && updatedProfile) {
          return updatedProfile
        }
      }

      return profileByEmail
    }

    if (emailError && emailError.code !== 'PGRST116') {
      throw createError({ statusCode: 500, statusMessage: emailError.message })
    }
    
    // No profile found
    return null
  } catch (error) {
    console.error('Error in profile lookup:', error)
    throw error
  }
})
