<template>
  <div class="hidden md:grid grid-cols-3 gap-2 px-6 py-3 bg-neutral-100 rounded-lg text-sm font-medium text-neutral-600 mb-2">
    <button
      @click="$emit('sort', 'name')"
      class="flex items-center gap-1 hover:text-neutral-900 transition-colors cursor-pointer text-left"
    >
      <span>Perfil</span>
      <UIcon
        v-if="sortBy === 'name'"
        :name="sortOrder === 'asc' ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        class="h-4 w-4"
      />
    </button>
    <div>Contato</div>
    <div>Tecnologias</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  sortBy: 'name' | null
  sortOrder: 'asc' | 'desc'
}

defineProps<Props>()

defineEmits<{
  sort: [column: 'name']
}>()
</script>
