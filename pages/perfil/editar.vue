<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isEditing ? 'Editar Perfil' : 'Criar Perfil' }}
          </h1>
          <UButton to="/diretorio" variant="outline" icon="i-heroicons-arrow-left">
            Cancelar
          </UButton>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-green-600" />
      </div>

      <!-- Form -->
      <UCard v-else>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Informações Básicas</h3>
            
            <UFormGroup label="Nome Completo *" required>
              <UInput 
                v-model="formData.name" 
                placeholder="Seu nome completo"
                size="lg"
                required
              />
            </UFormGroup>

            <UFormGroup label="Email *" required>
              <UInput 
                v-model="formData.email" 
                type="email"
                placeholder="seu@email.com"
                size="lg"
                required
              />
            </UFormGroup>

            <UFormGroup label="Telefone">
              <UInput 
                v-model="formData.phone" 
                type="tel"
                placeholder="(21) 99999-9999"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="LinkedIn">
              <UInput 
                v-model="formData.linkedin" 
                placeholder="https://linkedin.com/in/seu-perfil"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="Foto do Perfil (URL)">
              <UInput 
                v-model="formData.profile_image_url" 
                type="url"
                placeholder="https://exemplo.com/sua-foto.jpg"
                size="lg"
              />
              <template #help>
                <p class="text-sm text-gray-500 mt-1">
                  Cole o link de uma imagem hospedada (ex: LinkedIn, GitHub, Imgur)
                </p>
              </template>
            </UFormGroup>

            <!-- Image Preview -->
            <div v-if="formData.profile_image_url" class="mt-2">
              <p class="text-sm text-gray-600 mb-2">Preview:</p>
              <img 
                :src="formData.profile_image_url" 
                alt="Preview da foto"
                class="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
              />
            </div>
          </div>

          <!-- Professional Information -->
          <div class="space-y-4 pt-6 border-t">
            <h3 class="text-lg font-semibold text-gray-900">Informações Profissionais</h3>
            
            <UFormGroup label="Ano de Formatura IME">
              <UInput 
                v-model="formData.graduation_year" 
                type="number"
                placeholder="Ex: 2017"
                size="lg"
                min="1950"
                :max="new Date().getFullYear() + 5"
              />
            </UFormGroup>

            <UFormGroup label="Cargo Atual">
              <UInput 
                v-model="formData.role" 
                placeholder="Ex: Engenheiro de Software Senior"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="Empresa Atual">
              <UInput 
                v-model="formData.current_company" 
                placeholder="Nome da empresa"
                size="lg"
              />
            </UFormGroup>
          </div>

          <!-- Technologies -->
          <div class="space-y-4 pt-6 border-t">
            <h3 class="text-lg font-semibold text-gray-900">Tecnologias</h3>
            <p class="text-sm text-gray-600">Digite e pressione Enter para adicionar tecnologias</p>
            
            <div class="space-y-3">
              <UInput 
                v-model="newTechnology" 
                placeholder="Ex: JavaScript, Python, React..."
                size="lg"
                @keydown.enter.prevent="addTechnology"
              />
              
              <div v-if="formData.technologies.length > 0" class="flex flex-wrap gap-2">
                <UBadge 
                  v-for="(tech, index) in formData.technologies" 
                  :key="index"
                  color="green"
                  variant="subtle"
                  size="md"
                  class="cursor-pointer hover:bg-red-100"
                  @click="removeTechnology(index)"
                >
                  {{ tech }}
                  <UIcon name="i-heroicons-x-mark" class="ml-1 h-4 w-4" />
                </UBadge>
              </div>
            </div>
          </div>

          <!-- Expertise Fields -->
          <div class="space-y-4 pt-6 border-t">
            <h3 class="text-lg font-semibold text-gray-900">Áreas de Atuação</h3>
            <p class="text-sm text-gray-600">Digite e pressione Enter para adicionar campos como "fresh food, ecommerce, crypto"</p>
            
            <div class="space-y-3">
              <UInput 
                v-model="newExpertise" 
                placeholder="Ex: fresh food, ecommerce, crypto..."
                size="lg"
                @keydown.enter.prevent="addExpertise"
              />
              
              <div v-if="formData.expertise_fields.length > 0" class="flex flex-wrap gap-2">
                <UBadge 
                  v-for="(field, index) in formData.expertise_fields" 
                  :key="index"
                  color="blue"
                  variant="subtle"
                  size="md"
                  class="cursor-pointer hover:bg-red-100"
                  @click="removeExpertise(index)"
                >
                  {{ field }}
                  <UIcon name="i-heroicons-x-mark" class="ml-1 h-4 w-4" />
                </UBadge>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end gap-3 pt-6 border-t">
            <UButton 
              type="button" 
              variant="outline" 
              size="lg"
              @click="navigateTo('/diretorio')"
            >
              Cancelar
            </UButton>
            <UButton 
              type="submit" 
              color="green" 
              size="lg"
              :loading="saving"
              :disabled="!formData.name || !formData.email"
            >
              {{ isEditing ? 'Salvar Alterações' : 'Criar Perfil' }}
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlumniFormData } from '~/types/alumni'

const { userId } = useAuth()
const toast = useToast()

const loading = ref(true)
const saving = ref(false)
const isEditing = ref(false)
const newTechnology = ref('')
const newExpertise = ref('')

const formData = ref<AlumniFormData>({
  name: '',
  phone: '',
  email: '',
  linkedin: '',
  role: '',
  current_company: '',
  graduation_year: '',
  profile_image_url: '',
  technologies: [],
  expertise_fields: []
})

// Fetch existing profile if editing
const fetchProfile = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/alumni/me')
    
    if (data) {
      // Profile found - auto-fill form with existing data
      isEditing.value = true
      formData.value = {
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        linkedin: data.linkedin || '',
        role: data.role || '',
        current_company: data.current_company || '',
        graduation_year: data.graduation_year ? data.graduation_year.toString() : '',
        profile_image_url: data.profile_image_url || '',
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        expertise_fields: Array.isArray(data.expertise_fields) ? data.expertise_fields : []
      }
    } else {
      // No profile found - creating new one
      isEditing.value = false
      
      // Pre-populate with Clerk user data for new profiles (client-side only)
      if (process.client) {
        try {
          const { user } = useUser()
          if (user?.value) {
            formData.value.name = user.value.fullName || `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || ''
            formData.value.email = user.value.primaryEmailAddress?.emailAddress || ''
          }
        } catch (authError) {
          // Could not get auth user data
        }
      }
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    // If error occurred, we're creating a new one
    isEditing.value = false
    
    // Pre-populate with Clerk user data for new profiles (client-side only)
    if (process.client) {
      try {
        const { user } = useUser()
        if (user?.value) {
          formData.value.name = user.value.fullName || `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || ''
          formData.value.email = user.value.primaryEmailAddress?.emailAddress || ''
        }
      } catch (authError) {
        // Could not get auth user data
      }
    }
  } finally {
    loading.value = false
  }
}

const addTechnology = () => {
  const tech = newTechnology.value.trim()
  if (tech && !formData.value.technologies.includes(tech)) {
    formData.value.technologies.push(tech)
    newTechnology.value = ''
  }
}

const removeTechnology = (index: number) => {
  formData.value.technologies.splice(index, 1)
}

const addExpertise = () => {
  const expertise = newExpertise.value.trim()
  if (expertise && !formData.value.expertise_fields.includes(expertise)) {
    formData.value.expertise_fields.push(expertise)
    newExpertise.value = ''
  }
}

const removeExpertise = (index: number) => {
  formData.value.expertise_fields.splice(index, 1)
}

const handleSubmit = async () => {
  saving.value = true
  try {
    const alumniData = {
      clerk_user_id: userId.value,
      name: formData.value.name,
      phone: formData.value.phone || null,
      email: formData.value.email,
      linkedin: formData.value.linkedin || null,
      role: formData.value.role || null,
      current_company: formData.value.current_company || null,
      graduation_year: formData.value.graduation_year ? parseInt(formData.value.graduation_year) : null,
      profile_image_url: formData.value.profile_image_url || null,
      technologies: formData.value.technologies.length > 0 ? formData.value.technologies : null,
      expertise_fields: formData.value.expertise_fields.length > 0 ? formData.value.expertise_fields : null,
      updated_at: new Date().toISOString()
    }

    const res = await $fetch('/api/alumni/upsert', {
      method: 'POST',
      body: alumniData
    })

    toast.add({
      title: 'Sucesso!',
      description: isEditing.value ? 'Perfil atualizado com sucesso' : 'Perfil criado com sucesso',
      color: 'green'
    })

    navigateTo('/perfil')
  } catch (error) {
    console.error('Error saving profile:', error)
    toast.add({
      title: 'Erro',
      description: 'Não foi possível salvar o perfil',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>


