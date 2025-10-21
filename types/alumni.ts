export interface Alumni {
  id: string
  clerk_user_id: string
  name: string
  phone?: string
  email: string
  linkedin?: string
  role?: string
  current_company?: string
  graduation_year?: number
  profile_image_url?: string
  technologies?: string[]
  expertise_fields?: string[]
  created_at: string
  updated_at: string
}

export interface AlumniFormData {
  name: string
  phone: string
  email: string
  linkedin: string
  role: string
  current_company: string
  graduation_year: string
  profile_image_url: string
  technologies: string[]
  expertise_fields: string[]
}


export const validateLinkedinUrl = (url: string | null): boolean => {
  if (!url) return true;

  const linkedInRegex =
    /^(https?:\/\/www\.)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]{3,100}\/?$/;

  return linkedInRegex.test(url);
}