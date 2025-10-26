import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // Verify admin privileges
  await requireAdmin(event)

  // Get encontro ID from route params
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing encontro ID'
    })
  }

  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )

  // Check if encontro exists
  const { data: existing, error: existError } = await supabase
    .from('encontros')
    .select('id')
    .eq('id', id)
    .single()

  if (existError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Encontro not found'
    })
  }

  // Delete encontro
  const { error } = await supabase
    .from('encontros')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting encontro:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete encontro: ${error.message}`
    })
  }

  return {
    success: true,
    message: 'Encontro deleted successfully'
  }
})
