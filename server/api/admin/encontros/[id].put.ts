import { createClient } from '@supabase/supabase-js'
import type { EncontroFormData } from '~/types/encontros'

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

  // Get request body
  const body = await readBody(event)

  // Validate required fields
  if (!body.date || !body.time) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: date and time'
    })
  }

  // Validate topics array
  if (body.topics && !Array.isArray(body.topics)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Topics must be an array'
    })
  }

  // Validate each topic has required fields
  if (body.topics && body.topics.length > 0) {
    for (const topic of body.topics) {
      if (!topic.speaker || !topic.talk_name) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Each topic must have speaker and talk_name'
        })
      }
    }
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

  // Update encontro
  const { data, error } = await supabase
    .from('encontros')
    .update({
      date: body.date,
      time: body.time,
      topics: body.topics || []
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating encontro:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update encontro: ${error.message}`
    })
  }

  return data
})
