<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <img
              src="/images/ime-logo.png"
              alt="IME Logo"
              class="w-16 h-16 object-contain"
            />
            <div>
              <h1 class="text-xl font-bold !text-slate-950">IME</h1>
              <p class="text-xs !text-slate-900">Instituto Militar de Engenharia</p>
            </div>
          </div>
          <div class="flex gap-3 items-center">
            <UButton
              v-if="!hasProfile"
              to="/perfil/editar"
              color="primary"
              size="sm"
              icon="i-heroicons-plus"
            >
              <span class="hidden sm:inline">Criar Perfil</span>
            </UButton>
            <UButton
              v-else
              to="/perfil"
              variant="outline"
              size="sm"
              icon="i-heroicons-user"
            >
              <span class="hidden sm:inline">Meu Perfil</span>
            </UButton>
            <div class="flex items-center">
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
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search and Filters -->
      <div class="mb-8 space-y-4">
        <UInput
          v-model="searchQuery"
          size="xl"
          class="w-full"
          placeholder="Buscar por nome, empresa, ano de formatura ou tecnologia..."
          icon="i-heroicons-magnifying-glass"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        />
        
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="tech in popularTechnologies"
            :key="tech"
            :variant="selectedTechnologies.includes(tech) ? 'solid' : 'subtle'"
            :color="selectedTechnologies.includes(tech) ? 'primary' : 'neutral'"
            size="sm"
            @click="toggleTechnology(tech)"
          >
            {{ tech }}
          </UButton>
        </div>
      </div>

      <!-- Counter -->
      <div class="py-2 text-black font-bold">
          {{ filteredAlumni.length }} pessoas encontradas
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-primary-600" />
      </div>

      <!-- Alumni Grid -->
      <div v-else-if="filteredAlumni.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
        <UCard 
          v-for="alumni in filteredAlumni" 
          :key="alumni.id"
          class="hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
          @click="navigateTo(`/perfil/${alumni.id}`)"
        >
          <div class="space-y-4">
            <div class="flex items-start gap-4">
              <div class="shrink-0">
                <img 
                  v-if="alumni.profile_image_url"
                  :src="alumni.profile_image_url" 
                  :alt="alumni.name"
                  class="w-14 h-14 rounded-full object-cover"
                  @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
                />
                <div 
                  v-else
                  class="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-info-500 flex items-center justify-center text-white font-semibold text-lg"
                >
                  {{ alumni.name.charAt(0).toUpperCase() }}
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h3 class="font-semibold truncate">{{ alumni.name }}</h3>
                  <UBadge 
                    v-if="alumni.is_dropout" 
                    color="neutral" 
                    variant="subtle" 
                    size="xs"
                  >
                    Não Concluído
                  </UBadge>
                  <UBadge 
                    v-else-if="alumni.graduation_year" 
                    color="primary" 
                    variant="subtle" 
                    size="xs"
                  >
                    '{{ alumni.graduation_year.toString().slice(-2) }}
                  </UBadge>
                </div>
                <p v-if="alumni.role" class="text-sm text-primary-600">{{ alumni.role }}</p>
              </div>
            </div>
            
            <div v-if="alumni.current_company" class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-building-office" class="h-4 w-4 shrink-0" />
              <span class="truncate">{{ alumni.current_company }}</span>
            </div>

            <div v-if="alumni.email" class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-envelope" class="h-4 w-4 shrink-0" />
              <span class="truncate">{{ alumni.email }}</span>
            </div>

            <a 
              v-if="alumni.linkedin" 
              :href="alumni.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-sm text-info-500 hover:text-info-600 font-medium"
              @click.stop
            >
              <UIcon name="i-heroicons-link" class="h-4 w-4 shrink-0" />
              <span class="truncate">LinkedIn</span>
            </a>

            <div v-if="alumni.technologies && alumni.technologies.length > 0" class="pt-3 border-t">
              <div class="flex flex-wrap gap-1.5">
                <UBadge 
                  v-for="tech in alumni.technologies.slice(0, 5)" 
                  :key="tech"
                  color="primary"
                  variant="subtle"
                  size="xs"
                >
                  {{ tech }}
                </UBadge>
                <UBadge 
                  v-if="alumni.technologies.length > 5"
                  variant="subtle"
                  size="xs"
                >
                  +{{ alumni.technologies.length - 5 }}
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <UIcon name="i-heroicons-user-group" class="h-16 w-16 text-neutral-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-neutral-900 dark:text-white mb-2">Nenhum resultado encontrado</h3>
        <p class="text-neutral-600 dark:text-neutral-400">Tente ajustar seus filtros de busca</p>
      </div>
    </div>

    <!-- Back to Top Button -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <button
        v-show="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full p-3 shadow-lg transition-colors z-50"
        aria-label="Voltar ao topo"
      >
        <UIcon name="i-heroicons-arrow-up" class="h-5 w-5" />
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Alumni } from '~/types/alumni'

const alumni = ref<Alumni[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedTechnologies = ref<string[]>([])
const hasProfile = ref(false)
const showBackToTop = ref(false)

const popularTechnologies = [
  'JavaScript', 'Python', 'Java', 'TypeScript', 'React', 
  'Vue', 'Node.js', 'AWS', 'Docker', 'Kubernetes'
]

// Shuffle array helper
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}

// Fetch alumni data
const fetchAlumni = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/alumni')
    alumni.value = shuffleArray((data as Alumni[]) || [])

    // Check if user has a profile by email (using /api/alumni/me)
    try {
      const myProfile = await $fetch<Alumni | null>('/api/alumni/me')
      hasProfile.value = !!myProfile
    } catch (error) {
      // User not authenticated or no profile
      hasProfile.value = false
    }
  } catch (error: any) {
    console.error('Error fetching alumni:', error)
    // If unauthorized, redirect to login
    if (error?.statusCode === 401) {
      navigateTo('/login')
    }
  } finally {
    loading.value = false
  }
}

// Filtered alumni based on search and filters
const filteredAlumni = computed(() => {
  let filtered = alumni.value

  // Text search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(a => 
      a.name?.toLowerCase().includes(query) ||
      a.current_company?.toLowerCase().includes(query) ||
      a.role?.toLowerCase().includes(query) ||
      a.email?.toLowerCase().includes(query) ||
      a.graduation_year?.toString().includes(query) ||
      a.technologies?.some(t => t.toLowerCase().includes(query)) ||
      a.expertise_fields?.some(e => e.toLowerCase().includes(query))
    )
  }

  // Technology filter
  if (selectedTechnologies.value.length > 0) {
    filtered = filtered.filter(a => 
      a.technologies?.some(t => 
        selectedTechnologies.value.some(st => 
          t.toLowerCase().includes(st.toLowerCase())
        )
      )
    )
  }

  return filtered
})

const toggleTechnology = (tech: string) => {
  const index = selectedTechnologies.value.indexOf(tech)
  if (index > -1) {
    selectedTechnologies.value.splice(index, 1)
  } else {
    selectedTechnologies.value.push(tech)
  }
}

const handleSignOut = async () => {
  if (process.client) {
    // Use Clerk's global signOut method
    if (window.Clerk) {
      await window.Clerk.signOut()
    }
  }
  // Redirect to login
  navigateTo('/login')
}

// Back to top functionality
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  fetchAlumni()
  
  // Add scroll listener for back to top button
  if (process.client) {
    window.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>


