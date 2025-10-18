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
    // Step 1: Try to find profile by clerk_user_id
    const { data: profileByUserId, error: userIdError } = await supabase
      .from('alumni')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (profileByUserId) {
      return profileByUserId
    }

    // Step 2: If not found by clerk_user_id, get user email from Clerk and try to find by email
    if (userIdError?.code === 'PGRST116') { // Profile not found by clerk_user_id
      try {
        const user = await clerkClient(event).users.getUser(userId)
        const userEmail = user.primaryEmailAddress?.emailAddress

        if (userEmail) {
          // Try to find profile by email
          const { data: profileByEmail, error: emailError } = await supabase
            .from('alumni')
            .select('*')
            .eq('email', userEmail)
            .single()

          if (profileByEmail) {
            // Found profile by email - check if it's already claimed
            if (profileByEmail.clerk_user_id && profileByEmail.clerk_user_id !== userId) {
              throw createError({ 
                statusCode: 409, 
                statusMessage: 'This email is already associated with another account' 
              })
            }

            // Automatically claim this profile by updating clerk_user_id
            if (!profileByEmail.clerk_user_id) {
              const { data: claimedProfile, error: claimError } = await supabase
                .from('alumni')
                .update({
                  clerk_user_id: userId,
                  name: user.fullName || profileByEmail.name,
                  updated_at: new Date().toISOString()
                })
                .eq('email', userEmail)
                .select()
                .single()

              if (!claimError && claimedProfile) {
                return claimedProfile
              }
            }

            return profileByEmail
          }

          if (emailError && emailError.code !== 'PGRST116') {
            throw createError({ statusCode: 500, statusMessage: emailError.message })
          }
        }
      } catch (clerkError) {
        console.error('Failed to fetch user from Clerk:', clerkError)
        // Continue without email lookup if Clerk fails
      }
    }

    if (userIdError && userIdError.code !== 'PGRST116') {
      throw createError({ statusCode: 500, statusMessage: userIdError.message })
    }

    // No profile found
    return null
  } catch (error) {
    console.error('Error in profile lookup:', error)
    throw error
  }
})
