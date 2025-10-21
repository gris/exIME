import { createClient } from '@supabase/supabase-js'
import { clerkClient } from '@clerk/nuxt/server'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth()
  const userId = auth?.userId
  
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    // Get the uploaded file from the form data
    const formData = await readFormData(event)
    const file = formData.get('file') as File
    
    if (!file) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'No file provided' 
      })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
      })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'File size too large. Maximum size is 10MB.' 
      })
    }

    // Update the user's profile image using Clerk's backend API
    const updatedUser = await clerkClient(event).users.updateUserProfileImage(userId, {
      file
    })

    // Also update the database immediately
    const userEmail = updatedUser.primaryEmailAddress?.emailAddress
    
    if (userEmail) {
      const config = useRuntimeConfig()
      
      if (config.public.supabaseUrl && config.supabaseServiceRoleKey) {
        const supabase = createClient(
          config.public.supabaseUrl,
          config.supabaseServiceRoleKey
        )

        // Update profile_image_url in the database
        await supabase
          .from('alumni')
          .update({ 
            profile_image_url: updatedUser.imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('email', userEmail)
      }
    }

    return { 
      success: true, 
      imageUrl: updatedUser.imageUrl 
    }
  } catch (error: any) {
    console.error('Error uploading profile image:', error)
    
    // Handle Clerk API errors
    if (error?.clerkError) {
      throw createError({ 
        statusCode: error.status || 500, 
        statusMessage: error.message || 'Failed to upload profile image' 
      })
    }
    
    // Re-throw createError objects as-is
    if (error?.statusCode) {
      throw error
    }
    
    // Generic error handling
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Failed to upload profile image' 
    })
  }
})

