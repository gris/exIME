import { getAuth } from '@clerk/nuxt/server'

export default defineNuxtRouteMiddleware((to) => {
  const publicRoutes = ['/login', '/cadastro']

  // Server-side (SSR) check using Clerk server auth
  if (import.meta.server) {
    const event = useRequestEvent()
    const { isAuthenticated } = getAuth(event)

    if (!isAuthenticated && !publicRoutes.includes(to.path)) {
      return navigateTo('/login')
    }

    if (isAuthenticated && publicRoutes.includes(to.path)) {
      return navigateTo('/diretorio')
    }
    return
  }

  // Client-side check using Clerk client composable
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded.value) return

  if (!isSignedIn.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (isSignedIn.value && publicRoutes.includes(to.path)) {
    return navigateTo('/diretorio')
  }
})


