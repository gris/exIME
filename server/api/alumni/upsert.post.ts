import { createClient } from '@supabase/supabase-js'
import { getAuth, clerkClient } from '@clerk/nuxt/server'

export default defineEventHandler(async (event) => {
  const { isAuthenticated, userId } = getAuth(event)
  if (!isAuthenticated || !userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  
  try {
    // Get user details from Clerk for security check
    const user = await clerkClient(event).users.getUser(userId)
    const userEmail = user.primaryEmailAddress?.emailAddress
    
    if (!userEmail) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'User email not found' 
      })
    }

    // Security check: ensure user can only edit their own profile
    if (body.email !== userEmail) {
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

    // Check if a profile exists for this email
    const { data: existingProfile } = await supabase
      .from('alumni')
      .select('*')
      .eq('email', userEmail)
      .single()

    const payload: any = {
      clerk_user_id: userId, // Store for reference, but email is the primary identifier
      name: body.name,
      phone: body.phone ?? null,
      email: body.email,
      linkedin: body.linkedin ?? null,
      role: body.role ?? null,
      current_company: body.current_company ?? null,
      graduation_year: body.graduation_year ?? null,
      technologies: body.technologies?.length ? body.technologies : null,
      expertise_fields: body.expertise_fields?.length ? body.expertise_fields : null,
      updated_at: new Date().toISOString(),
    }

    // Only set created_at for new profiles
    if (!existingProfile) {
      payload.created_at = new Date().toISOString()
    }

    // Use upsert with EMAIL as the conflict key (primary identifier)
    const { error } = await supabase
      .from('alumni')
      .upsert(payload, {
        onConflict: 'email'
      })

    if (error) {
      console.error('Upsert error:', error)
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return { ok: true }
  } catch (error) {
    console.error('Error in upsert:', error)
    // Check if it's a Clerk-related error
    if ((error as any)?.message && (error as any).message.includes('User not found')) {
      throw createError({ 
        statusCode: 500, 
        statusMessage: 'Failed to fetch user details' 
      })
    }
    // Re-throw createError objects as-is
    if ((error as any)?.statusCode) {
      throw error
    }
    // Generic error handling
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Failed to save profile' 
    })
  }
})


