<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="bg-white shadow-sm">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">Meu Perfil</h1>
          <div class="flex gap-3 items-center">
            <UButton to="/diretorio" variant="outline" icon="i-heroicons-arrow-left">
              Voltar
            </UButton>
            <UButton to="/perfil/editar" color="primary" icon="i-heroicons-pencil">
              Editar
            </UButton>
            <UserButton 
              :user-profile-props="{
                appearance: {
                  elements: {
                    pageScrollBox__emailAddresses: 'hidden',
                    navbar__menuItem__emailAddresses: 'hidden',
                    profileSection__emailAddresses: 'hidden',
                    profileSectionTitleText__emailAddresses: 'hidden',
                    profileSectionTitle__emailAddresses: 'hidden',
                    profileSectionContent__emailAddresses: 'hidden'
                  }
                }
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-primary-600" />
      </div>

      <!-- No Profile State -->
      <UCard v-else-if="!profile" class="text-center py-12">
        <UIcon name="i-heroicons-user-circle" class="h-16 w-16 text-neutral-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 dark:text-white mb-2">Você ainda não criou seu perfil</h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6">Crie seu perfil para aparecer no diretório de alunos e ex-alunos</p>
        <UButton to="/perfil/editar" color="primary" size="lg">
          Criar Perfil
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
                @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
              />
              <div 
                v-else
                class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-info-500 flex items-center justify-center text-white font-bold text-4xl shrink-0"
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
                    color="neutral" 
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
              <UIcon name="i-heroicons-envelope" class="h-6 w-6 shrink-0" />
              <div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">Email</p>
                <p>{{ profile.email }}</p>
              </div>
            </div>

            <div v-if="profile.phone" class="flex items-center gap-3">
              <UIcon name="i-heroicons-phone" class="h-6 w-6 shrink-0" />
              <div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">Telefone</p>
                <p>{{ profile.phone }}</p>
              </div>
            </div>

            <div v-if="profile.linkedin" class="flex items-center gap-3">
              <UIcon name="i-heroicons-link" class="h-6 w-6 shrink-0" />
              <div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">LinkedIn</p>
                <a :href="profile.linkedin" target="_blank" class="text-info-500 hover:text-info-600 hover:underline">
                  {{ profile.linkedin }}
                </a>
              </div>
            </div>
          </div>

          <!-- Professional Information -->
          <div v-if="profile.current_company" class="space-y-4 pt-6 border-t">
            <h3 class="text-lg font-semibold">Informações Profissionais</h3>
            
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-building-office" class="h-6 w-6 shrink-0" />
              <div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">Empresa Atual</p>
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


