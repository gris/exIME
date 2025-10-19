import { createClient } from '@supabase/supabase-js'
import { getAuth } from '@clerk/nuxt/server'

export default defineEventHandler(async (event) => {
  const { isAuthenticated } = getAuth(event)
  if (!isAuthenticated) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const config = useRuntimeConfig()
  
  if (!config.public.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    })
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )

  let { data, error } = await supabase
    .from('alumni')
    .select('*')
    .order('name', { nullsLast: true })

  // If ordering by name fails, try without ordering
  if (error) {
    console.warn('Error with name ordering, trying without order:', error)
    const fallback = await supabase
      .from('alumni')
      .select('*')
    
    data = fallback.data
    error = fallback.error
  }

  if (error) {
    console.error('Supabase error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data || []
})




import { createClient } from '@supabase/supabase-js'
import { getAuth } from '@clerk/nuxt/server'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const { isAuthenticated } = getAuth(event)
  if (!isAuthenticated) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const config = useRuntimeConfig()
  
  if (!config.public.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    })
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey
  )

  const query = getQuery(event)
  const requestedFields = query.fields as string | undefined
  const viewType = query.viewType as string | undefined

  // An allowlist of fields prevents clients from selecting sensitive or internal columns.
  const allowedFields = [
    'id', 
    'name', 
    'email', 
    'department', 
    'graduation_year', 
    'created_at', 
    'updated_at'
  ];

  let selectString: string;

  if (requestedFields) {
    const fieldsArray = requestedFields
      .split(',')
      .map(field => field.trim())
      .filter(Boolean); // Remove empty strings

    // Validate the requested fields against the allowlist.
    const validatedFields = fieldsArray.filter(field => allowedFields.includes(field));

    if (validatedFields.length > 0) {
      selectString = validatedFields.join(',');
    } else {
      // If requested fields are all invalid, log a warning and fall back to a minimal safe set.
      console.warn(`Invalid or empty fields requested: '${requestedFields}'. Falling back to 'id,name'.`);
      selectString = 'id,name'; 
    }
  } else if (viewType === 'list') {
    // If no fields are requested but the view is 'list', provide a lean, default set.
    selectString = 'id,name,department,graduation_year';
  } else {
    // Default to all fields for 'card' view or if no viewType/fields are specified.
    selectString = '*';
  }

  let { data, error } = await supabase
    .from('alumni')
    .select(selectString) // Use the dynamic and validated select string
    .order('name', { nullsLast: true })

  // Fallback if ordering by name fails, which can happen with certain data types or DB states.
  if (error) {
    console.warn('Error with name ordering, trying without order:', error)
    const fallback = await supabase
      .from('alumni')
      .select(selectString) // Ensure fallback query is consistent
    
    data = fallback.data
    error = fallback.error
  }

  if (error) {
    console.error('Supabase error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data || []
})