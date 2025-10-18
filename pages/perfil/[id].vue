<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Perfil do Ex-Aluno</h1>
          <UButton to="/diretorio" variant="outline" icon="i-heroicons-arrow-left">
            Voltar ao Diretório
          </UButton>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-green-600" />
      </div>

      <!-- Not Found -->
      <UCard v-else-if="!profile" class="text-center py-12">
        <UIcon name="i-heroicons-user-circle" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Perfil não encontrado</h3>
        <p class="text-gray-600 mb-6">Este perfil não existe ou foi removido</p>
        <UButton to="/diretorio" color="green">
          Voltar ao Diretório
        </UButton>
      </UCard>

      <!-- Profile Display -->
      <UCard v-else>
        <div class="space-y-6">
          <!-- Header -->
          <div class="border-b border-gray-600 pb-6">
            <h2 class="text-3xl font-bold text-white mb-2">{{ profile.name }}</h2>
            <p v-if="profile.role" class="text-xl text-green-400 font-medium">{{ profile.role }}</p>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-white">Informações de Contato</h3>
            
            <div v-if="profile.email" class="flex items-center gap-3">
              <UIcon name="i-heroicons-envelope" class="h-6 w-6 text-gray-300" />
              <div>
                <p class="text-sm text-gray-400">Email</p>
                <a :href="`mailto:${profile.email}`" class="text-white hover:text-green-400">
                  {{ profile.email }}
                </a>
              </div>
            </div>

            <div v-if="profile.phone" class="flex items-center gap-3">
              <UIcon name="i-heroicons-phone" class="h-6 w-6 text-gray-300" />
              <div>
                <p class="text-sm text-gray-400">Telefone</p>
                <a :href="`tel:${profile.phone}`" class="text-white hover:text-green-400">
                  {{ profile.phone }}
                </a>
              </div>
            </div>

            <div v-if="profile.linkedin" class="flex items-center gap-3">
              <UIcon name="i-heroicons-link" class="h-6 w-6 text-gray-300" />
              <div>
                <p class="text-sm text-gray-400">LinkedIn</p>
                <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
                  Ver Perfil no LinkedIn
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
          <div v-if="profile.expertise_fields && profile.expertise_fields.length > 0" class="space-y-4 pt-6 border-t">
            <h3 class="text-lg font-semibold text-gray-900">Áreas de Especialização</h3>
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

const route = useRoute()
const supabase = useSupabase()

const profile = ref<Alumni | null>(null)
const loading = ref(true)

const fetchProfile = async () => {
  loading.value = true
  try {
    const data = await $fetch(`/api/alumni/${route.params.id}`)
    profile.value = data
  } catch (error) {
    console.error('Error fetching profile:', error)
    profile.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

