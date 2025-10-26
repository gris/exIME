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
      const config = useRuntimeConfig()
      const { createClient } = await import('@supabase/supabase-js')

      const supabase = createClient(
        config.public.supabaseUrl,
        config.supabaseServiceRoleKey
      )

      const { data: alumni } = await supabase
        .from('alumni')
        .select('is_admin')
        .eq('clerk_user_id', userId)
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
