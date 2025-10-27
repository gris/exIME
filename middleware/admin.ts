import { clerkClient } from '@clerk/nuxt/server'

export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on admin routes
  if (!to.path.startsWith('/admin')) {
    return
  }

  // Server-side check
  if (import.meta.server) {
    const event = useRequestEvent()
    if (!event) return

    const auth = event.context.auth()
    const userId = auth?.userId

    if (!userId) {
      return navigateTo('/login')
    }

    // Check admin status from database
    try {
      // Get user email from Clerk
      const user = await clerkClient(event).users.getUser(userId)
      const userEmail = user.primaryEmailAddress?.emailAddress

      if (!userEmail) {
        console.error('User email not found')
        return navigateTo('/diretorio')
      }

      const config = useRuntimeConfig()
      const { createClient } = await import('@supabase/supabase-js')

      const supabase = createClient(
        config.public.supabaseUrl,
        config.supabaseServiceRoleKey
      )

      const { data: alumni } = await supabase
        .from('alumni')
        .select('is_admin')
        .eq('email', userEmail)
        .single()

      if (!alumni || !alumni.is_admin) {
        return navigateTo('/diretorio')
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      return navigateTo('/diretorio')
    }

    return
  }

  // Client-side check
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded.value) return

  if (!isSignedIn.value) {
    return navigateTo('/login')
  }

  // Check admin status on client
  try {
    const profile = await $fetch('/api/alumni/me')
    if (!profile || !(profile as any).is_admin) {
      return navigateTo('/diretorio')
    }
  } catch (error) {
    console.error('Error checking admin status:', error)
    return navigateTo('/diretorio')
  }
})
