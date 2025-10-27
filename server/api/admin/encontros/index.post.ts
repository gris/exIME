import { createClient } from '@supabase/supabase-js'
import type { EncontroFormData } from '~/types/encontros'

export default defineEventHandler(async (event) => {
  // Verify admin privileges
  await requireAdmin(event)

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

  // Insert new encontro
  const { data, error } = await supabase
    .from('encontros')
    .insert({
      date: body.date,
      time: body.time,
      topics: body.topics || []
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating encontro:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create encontro: ${error.message}`
    })
  }

  return data
})
