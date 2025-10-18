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
  technologies: string[]
  expertise_fields: string[]
}


