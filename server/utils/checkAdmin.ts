import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export interface AdminCheckResult {
  isAdmin: boolean
  userId: string
  alumni?: any
}

/**
 * Checks if the authenticated user has admin privileges
 * @param event - H3 event from the API handler
 * @returns AdminCheckResult with isAdmin status and user info
 * @throws Error if user is not authenticated or database error occurs
 */
export async function checkAdmin(event: H3Event): Promise<AdminCheckResult> {
  // Check authentication
  const auth = event.context.auth()
  const userId = auth?.userId

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Not authenticated'
    })
  }

  // Get Supabase config
  const config = useRuntimeConfig()

  if (!config.public.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    })
  }

  // Create Supabase client
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )

  try {
    // Query alumni table to check admin status
    const { data: alumni, error } = await supabase
      .from('alumni')
      .select('id, name, email, is_admin, clerk_user_id')
      .eq('clerk_user_id', userId)
      .single()

    if (error) {
      // User not found in alumni table
      if (error.code === 'PGRST116') {
        return {
          isAdmin: false,
          userId,
          alumni: null
        }
      }

      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    return {
      isAdmin: alumni?.is_admin === true,
      userId,
      alumni
    }
  } catch (error) {
    console.error('Error checking admin status:', error)
    throw error
  }
}

/**
 * Requires the user to be an admin, throws 403 if not
 * @param event - H3 event from the API handler
 * @returns AdminCheckResult if user is admin
 * @throws 403 error if user is not admin
 */
export async function requireAdmin(event: H3Event): Promise<AdminCheckResult> {
  const result = await checkAdmin(event)

  if (!result.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin privileges required'
    })
  }

  return result
}
