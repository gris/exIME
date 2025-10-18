<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <div class="flex gap-3">
            <UButton to="/diretorio" variant="outline" icon="i-heroicons-arrow-left">
              Voltar
            </UButton>
            <UButton to="/perfil/editar" color="green" icon="i-heroicons-pencil">
              Editar
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-green-600" />
      </div>

      <!-- No Profile State -->
      <UCard v-else-if="!profile" class="text-center py-12">
        <UIcon name="i-heroicons-user-circle" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Você ainda não criou seu perfil</h3>
        <p class="text-gray-600 mb-6">Crie seu perfil para aparecer no diretório de ex-alunos</p>
        <UButton to="/perfil/editar" color="green" size="lg">
          Criar Perfil
        </UButton>
      </UCard>

      <!-- Profile Display -->
      <UCard v-else>
        <div class="space-y-6">
          <!-- Header -->
          <div class="border-b border-gray-600 pb-6">
            <h2 class="text-3xl font-bold text-white mb-2">{{ profile.name }}</h2>
            <div class="flex items-center gap-4 flex-wrap">
              <p v-if="profile.role" class="text-xl text-green-400 font-medium">{{ profile.role }}</p>
              <UBadge 
                v-if="profile.graduation_year" 
                color="blue" 
                variant="subtle" 
                size="lg"
              >
                Turma {{ profile.graduation_year }}
              </UBadge>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-white">Informações de Contato</h3>
            
            <div v-if="profile.email" class="flex items-center gap-3">
              <UIcon name="i-heroicons-envelope" class="h-6 w-6 text-gray-300" />
              <div>
                <p class="text-sm text-gray-400">Email</p>
                <p class="text-white">{{ profile.email }}</p>
              </div>
            </div>

            <div v-if="profile.phone" class="flex items-center gap-3">
              <UIcon name="i-heroicons-phone" class="h-6 w-6 text-gray-300" />
              <div>
                <p class="text-sm text-gray-400">Telefone</p>
                <p class="text-white">{{ profile.phone }}</p>
              </div>
            </div>

            <div v-if="profile.linkedin" class="flex items-center gap-3">
              <UIcon name="i-heroicons-link" class="h-6 w-6 text-gray-300" />
              <div>
                <p class="text-sm text-gray-400">LinkedIn</p>
                <a :href="profile.linkedin" target="_blank" class="text-blue-400 hover:underline">
                  {{ profile.linkedin }}
                </a>
              </div>
            </div>
          </div>

          <!-- Professional Information -->
          <div v-if="profile.current_company" class="space-y-4 pt-6 border-t border-gray-600">
            <h3 class="text-lg font-semibold text-white">Informações Profissionais</h3>
            
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-building-office" class="h-6 w-6 text-gray-300" />
              <div>
                <p class="text-sm text-gray-400">Empresa Atual</p>
                <p class="text-white">{{ profile.current_company }}</p>
              </div>
            </div>
          </div>

          <!-- Technologies -->
          <div v-if="profile.technologies && profile.technologies.length > 0" class="space-y-4 pt-6 border-t border-gray-600">
            <h3 class="text-lg font-semibold text-white">Tecnologias</h3>
            <div class="flex flex-wrap gap-2">
              <UBadge 
                v-for="tech in profile.technologies" 
                :key="tech"
                color="green"
                variant="subtle"
                size="md"
              >
                {{ tech }}
              </UBadge>
            </div>
          </div>

          <!-- Expertise Fields -->
          <div v-if="profile.expertise_fields && profile.expertise_fields.length > 0" class="space-y-4 pt-6 border-t border-gray-600">
            <h3 class="text-lg font-semibold text-white">Áreas de Especialização</h3>
            <div class="flex flex-wrap gap-2">
              <UBadge 
                v-for="field in profile.expertise_fields" 
                :key="field"
                color="blue"
                variant="subtle"
                size="md"
              >
                {{ field }}
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Alumni } from '~/types/alumni'

const { userId } = useAuth()
const supabase = useSupabase()

const profile = ref<Alumni | null>(null)
const loading = ref(true)

const fetchProfile = async () => {
  if (!userId.value) {
    loading.value = false
    return
  }
  
  loading.value = true
  try {
    const data = await $fetch('/api/alumni/me')
    profile.value = data
  } catch (error) {
    console.error('Error fetching profile:', error)
    // If no profile found, data will be null
    profile.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>


