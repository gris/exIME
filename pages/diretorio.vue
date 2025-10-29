<template>
    <div class="min-h-screen bg-neutral-50">
        <AppHeader :show-create-profile="!hasProfile" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search and Filters -->
      <div class="mb-8 space-y-4">
        <UInput
          v-model="searchQuery"
          size="xl"
          class="w-full"
          placeholder="Buscar por nome, empresa, ano de formatura ou tecnologia..."
          icon="i-heroicons-magnifying-glass"
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

      <!-- Counter and View Toggle -->
      <div class="py-2 flex items-center justify-between">
        <div class="text-black font-bold">
          {{ filteredAlumni.length }} pessoas encontradas
        </div>
        <div class="flex gap-2">
          <UButton
            :variant="viewMode === 'table' ? 'solid' : 'subtle'"
            :color="viewMode === 'table' ? 'primary' : 'neutral'"
            size="sm"
            icon="i-heroicons-table-cells"
            @click="viewMode = 'table'"
          >
            Tabela
          </UButton>
          <UButton
            :variant="viewMode === 'cards' ? 'solid' : 'subtle'"
            :color="viewMode === 'cards' ? 'primary' : 'neutral'"
            size="sm"
            icon="i-heroicons-squares-2x2"
            @click="viewMode = 'cards'"
          >
            Cards
          </UButton>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-primary-600" />
      </div>

      <!-- Table View -->
      <div v-else-if="filteredAlumni.length > 0 && viewMode === 'table'">
        <AlumniTableHeader
          :sort-by="sortBy"
          :sort-order="sortOrder"
          @sort="handleSort"
        />
        <div class="space-y-2">
          <AlumniTableRow
            v-for="alumni in filteredAlumni"
            :key="alumni.id"
            :alumni="alumni"
            @click="navigateTo(`/perfil/${alumni.id}`)"
          />
        </div>
      </div>

      <!-- Cards View -->
      <div v-else-if="filteredAlumni.length > 0 && viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AlumniCard
          v-for="alumni in filteredAlumni"
          :key="alumni.id"
          :alumni="alumni"
          @click="navigateTo(`/perfil/${alumni.id}`)"
        />
      </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
                <UIcon
                    name="i-heroicons-user-group"
                    class="h-16 w-16 text-neutral-400 mx-auto mb-4"
                />
                <h3
                    class="text-lg font-medium text-neutral-900 dark:text-white mb-2"
                >
                    Nenhum resultado encontrado
                </h3>
                <p class="text-neutral-600 dark:text-neutral-400">
                    Tente ajustar seus filtros de busca
                </p>
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
import type { Alumni } from "~/types/alumni";

const alumni = ref<Alumni[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedTechnologies = ref<string[]>([])
const hasProfile = ref(true)
const showBackToTop = ref(false)
const viewMode = ref<'table' | 'cards'>('table')
const sortBy = ref<'name' | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const popularTechnologies = [
  'JavaScript', 'Python', 'Java', 'TypeScript', 'React',
  'Vue', 'Node.js', 'AWS', 'Docker', 'Kubernetes'
]

// Shuffle array helper
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i]!;
        shuffled[i] = shuffled[j]!;
        shuffled[j] = temp;
    }
    return shuffled;
};

// Fetch alumni data
const fetchAlumni = async () => {
    loading.value = true;
    try {
        const data = await $fetch("/api/alumni");
        alumni.value = shuffleArray((data as Alumni[]) || []);

        // Check if user has a profile by email (using /api/alumni/me)
        try {
            const myProfile = await $fetch<Alumni | null>("/api/alumni/me");
            hasProfile.value = !!myProfile;
        } catch (error) {
            // User not authenticated or no profile
            hasProfile.value = false;
        }
    } catch (error: any) {
        console.error("Error fetching alumni:", error);
        // If unauthorized, redirect to login
        if (error?.statusCode === 401) {
            navigateTo("/login");
        }
    } finally {
        loading.value = false;
    }
};

// Filtered alumni based on search and filters
const filteredAlumni = computed(() => {
    let filtered = alumni.value;

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

  // Sorting
  if (sortBy.value === 'name') {
    filtered = [...filtered].sort((a, b) => {
      const nameA = a.name?.toLowerCase() || ''
      const nameB = b.name?.toLowerCase() || ''

      if (sortOrder.value === 'asc') {
        return nameA.localeCompare(nameB)
      } else {
        return nameB.localeCompare(nameA)
      }
    })
  }

  return filtered
})

const handleSort = (column: 'name') => {
  if (sortBy.value === column) {
    // Toggle sort order if clicking same column
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // New column, default to ascending
    sortBy.value = column
    sortOrder.value = 'asc'
  }
}

const toggleTechnology = (tech: string) => {
    const index = selectedTechnologies.value.indexOf(tech);
    if (index > -1) {
        selectedTechnologies.value.splice(index, 1);
    } else {
        selectedTechnologies.value.push(tech);
    }
};

const handleSignOut = async () => {
    if (process.client) {
        // Use Clerk's global signOut method
        if (window.Clerk) {
            await window.Clerk.signOut();
        }
    }
    // Redirect to login
    navigateTo("/login");
};

// Back to top functionality
const handleScroll = () => {
    showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

onMounted(() => {
    fetchAlumni();

    // Add scroll listener for back to top button
    if (process.client) {
        window.addEventListener("scroll", handleScroll);
    }
});

onBeforeUnmount(() => {
    if (process.client) {
        window.removeEventListener("scroll", handleScroll);
    }
});
</script>
