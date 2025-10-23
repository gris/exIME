<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">Perfil</h1>
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
          <!-- Header with Profile Image -->
          <div class="border-b pb-6">
            <div class="flex items-start gap-6 mb-4">
              <!-- Profile Image -->
              <img 
                v-if="profile.profile_image_url"
                :src="profile.profile_image_url" 
                :alt="profile.name"
                class="w-24 h-24 rounded-full object-cover"
                @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
              />
              <div 
                v-else
                class="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-4xl flex-shrink-0"
              >
                {{ profile.name.charAt(0).toUpperCase() }}
              </div>

              <!-- Name and Info -->
              <div class="flex-1">
                <h2 class="text-3xl font-bold mb-2">{{ profile.name }}</h2>
                <div class="flex items-center gap-4 flex-wrap">
                  <p v-if="profile.role" class="text-xl text-primary-600 font-medium">{{ profile.role }}</p>
                  <UBadge 
                    v-if="profile.is_dropout" 
                    color="gray" 
                    variant="subtle" 
                    size="lg"
                  >
                    Não Concluído
                  </UBadge>
                  <UBadge 
                    v-else-if="profile.graduation_year" 
                    color="primary" 
                    variant="subtle" 
                    size="lg"
                  >
                    Turma {{ profile.graduation_year }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Informações de Contato</h3>
            
            <div v-if="profile.email" class="flex items-center gap-3">
              <UIcon name="i-heroicons-envelope" class="h-6 w-6 flex-shrink-0" />
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <a :href="`mailto:${profile.email}`" class="text-blue-500 hover:text-blue-600 hover:underline">
                  {{ profile.email }}
                </a>
              </div>
            </div>

            <div v-if="profile.phone" class="flex items-center gap-3">
              <UIcon name="i-heroicons-phone" class="h-6 w-6 flex-shrink-0" />
              <div>
                <p class="text-sm text-gray-500">Telefone</p>
                <a :href="`tel:${profile.phone}`" class="text-blue-500 hover:text-blue-600 hover:underline">
                  {{ profile.phone }}
                </a>
              </div>
            </div>

            <div v-if="profile.linkedin" class="flex items-center gap-3">
              <UIcon name="i-heroicons-link" class="h-6 w-6 flex-shrink-0" />
              <div>
                <p class="text-sm text-gray-500">LinkedIn</p>
                <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600 hover:underline">
                  Ver Perfil no LinkedIn
                </a>
              </div>
            </div>
          </div>

          <!-- Professional Information -->
          <div v-if="profile.current_company" class="space-y-4 pt-6 border-t">
            <h3 class="text-lg font-semibold">Informações Profissionais</h3>
            
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-building-office" class="h-6 w-6 flex-shrink-0" />
              <div>
                <p class="text-sm text-gray-500">Empresa Atual</p>
                <p>{{ profile.current_company }}</p>
              </div>
            </div>
          </div>

          <!-- Technologies -->
          <div v-if="profile.technologies && profile.technologies.length > 0" class="space-y-4 pt-6 border-t">
            <h3 class="text-lg font-semibold">Tecnologias</h3>
            <div class="flex flex-wrap gap-2">
              <UBadge 
                v-for="tech in profile.technologies" 
                :key="tech"
                color="primary"
                variant="subtle"
                size="md"
              >
                {{ tech }}
              </UBadge>
            </div>
          </div>

          <!-- Expertise Fields -->
          <div v-if="profile.expertise_fields && profile.expertise_fields.length > 0" class="space-y-4 pt-6 border-t">
            <h3 class="text-lg font-semibold">Áreas de Especialização</h3>
            <div class="flex flex-wrap gap-2">
              <UBadge 
                v-for="field in profile.expertise_fields" 
                :key="field"
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
const profile = ref<Alumni | null>(null)
const loading = ref(true)

const fetchProfile = async () => {
  const id = route.params.id
  if (!id) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    const data = await $fetch<Alumni>(`/api/alumni/${id}`)
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

