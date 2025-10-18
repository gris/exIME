<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <img 
              src="/images/ime-logo.png" 
              alt="IME Logo" 
              class="w-16 h-16 object-contain"
            />
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Diretório de Alunos e Ex-Alunos</h1>
              <p class="text-gray-600">Instituto Militar de Engenharia</p>
            </div>
          </div>
          <div class="flex gap-3">
            <UButton 
              v-if="!hasProfile" 
              to="/perfil/editar" 
              color="green" 
              size="lg"
              icon="i-heroicons-plus"
            >
              Criar Perfil
            </UButton>
            <UButton 
              v-else 
              to="/perfil" 
              variant="outline" 
              size="lg"
              icon="i-heroicons-user"
            >
              Meu Perfil
            </UButton>
            <UButton 
              @click="handleSignOut" 
              color="gray" 
              variant="outline" 
              size="lg"
              icon="i-heroicons-arrow-right-on-rectangle"
            >
              Sair
            </UButton>
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
          placeholder="Buscar por nome, empresa, ano de formatura ou tecnologia..."
          icon="i-heroicons-magnifying-glass"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        />
        
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="tech in popularTechnologies"
            :key="tech"
            :variant="selectedTechnologies.includes(tech) ? 'solid' : 'outline'"
            :color="selectedTechnologies.includes(tech) ? 'green' : 'gray'"
            size="sm"
            @click="toggleTechnology(tech)"
          >
            {{ tech }}
          </UButton>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-green-600" />
      </div>

      <!-- Alumni Grid -->
      <div v-else-if="filteredAlumni.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard 
          v-for="alumni in filteredAlumni" 
          :key="alumni.id"
          class="hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateTo(`/perfil/${alumni.id}`)"
        >
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <!-- Profile Image -->
              <div class="flex-shrink-0">
                <img 
                  v-if="alumni.profile_image_url"
                  :src="alumni.profile_image_url" 
                  :alt="alumni.name"
                  class="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                  @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                />
                <div 
                  v-else
                  class="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl"
                >
                  {{ alumni.name.charAt(0).toUpperCase() }}
                </div>
              </div>

              <!-- Profile Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <h3 class="text-xl font-semibold text-white truncate">{{ alumni.name }}</h3>
                  <UBadge 
                    v-if="alumni.graduation_year" 
                    color="blue" 
                    variant="subtle" 
                    size="xs"
                  >
                    '{{ alumni.graduation_year.toString().slice(-2) }}
                  </UBadge>
                </div>
                <p v-if="alumni.role" class="text-green-400 font-medium">{{ alumni.role }}</p>
              </div>
            </div>
            
            <div v-if="alumni.current_company" class="flex items-center gap-2 text-gray-300">
              <UIcon name="i-heroicons-building-office" class="h-5 w-5" />
              <span>{{ alumni.current_company }}</span>
            </div>

            <div v-if="alumni.email" class="flex items-center gap-2 text-gray-300">
              <UIcon name="i-heroicons-envelope" class="h-5 w-5" />
              <span class="truncate">{{ alumni.email }}</span>
            </div>

            <div v-if="alumni.linkedin" class="flex items-center gap-2 text-blue-400">
              <UIcon name="i-heroicons-link" class="h-5 w-5" />
              <span class="truncate">LinkedIn</span>
            </div>

            <div v-if="alumni.technologies && alumni.technologies.length > 0" class="pt-2">
              <div class="flex flex-wrap gap-1">
                <UBadge 
                  v-for="tech in alumni.technologies.slice(0, 5)" 
                  :key="tech"
                  color="green"
                  variant="subtle"
                  size="xs"
                >
                  {{ tech }}
                </UBadge>
                <UBadge 
                  v-if="alumni.technologies.length > 5"
                  color="gray"
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
        <UIcon name="i-heroicons-user-group" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
        <p class="text-gray-600">Tente ajustar seus filtros de busca</p>
      </div>
    </div>

    <!-- Back to Top Button -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-50 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-50 translate-y-4"
    >
      <button
        v-show="showBackToTop"
        @click="scrollToTop"
        class="group fixed bottom-8 right-8 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 z-50 ring-4 ring-green-500/20 hover:ring-green-500/40 hover:scale-110"
        aria-label="Voltar ao topo"
      >
        <UIcon name="i-heroicons-arrow-up" class="h-6 w-6 group-hover:-translate-y-0.5 transition-transform duration-200" />
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

// Fetch alumni data
const fetchAlumni = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/alumni')
    alumni.value = (data as Alumni[]) || []

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


