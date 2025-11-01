<template>
  <div
    class="bg-white border border-neutral-200 rounded-lg px-6 py-4 cursor-pointer hover:border-neutral-300 transition-colors duration-150"
    @click="$emit('click', alumni.id)"
  >
    <div class="flex items-center gap-4">
      <!-- Profile Image -->
      <div class="shrink-0">
        <img
          v-if="alumni.profile_image_url"
          :src="alumni.profile_image_url"
          :alt="alumni.name"
          class="w-12 h-12 rounded-full object-cover"
          @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
        />
        <div
          v-else
          class="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-semibold text-base"
        >
          {{ alumni.name.charAt(0).toUpperCase() }}
        </div>
      </div>

      <!-- Main Info -->
      <div class="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-2">
        <!-- Name and Role -->
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-semibold text-neutral-900 truncate">{{ alumni.name }}</h3>
            <UBadge
              v-if="alumni.is_dropout"
              color="neutral"
              variant="outline"
              size="xs"
            >
              Não Concluído
            </UBadge>
            <UBadge
              v-else-if="alumni.graduation_year"
              color="neutral"
              variant="outline"
              size="xs"
            >
              '{{ alumni.graduation_year.toString().slice(-2) }}
            </UBadge>
          </div>
          <p v-if="alumni.role" class="text-sm text-neutral-600 truncate">{{ alumni.role }}</p>
        </div>

        <!-- Company and Contact -->
        <div class="min-w-0 space-y-1">
          <div v-if="alumni.current_company" class="flex items-center gap-2 text-sm text-neutral-700">
            <UIcon name="i-heroicons-building-office" class="h-4 w-4 shrink-0 text-neutral-500" />
            <span class="truncate">{{ alumni.current_company }}</span>
          </div>
          <div v-if="alumni.email" class="flex items-center gap-2 text-sm text-neutral-700">
            <UIcon name="i-heroicons-envelope" class="h-4 w-4 shrink-0 text-neutral-500" />
            <span class="truncate">{{ alumni.email }}</span>
          </div>
        </div>

        <!-- Technologies -->
        <div v-if="alumni.technologies && alumni.technologies.length > 0" class="min-w-0">
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="tech in alumni.technologies.slice(0, 3)"
              :key="tech"
              color="neutral"
              variant="subtle"
              size="xs"
            >
              {{ tech }}
            </UBadge>
            <UBadge
              v-if="alumni.technologies.length > 3"
              color="neutral"
              variant="subtle"
              size="xs"
            >
              +{{ alumni.technologies.length - 3 }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- LinkedIn -->
      <a
        v-if="alumni.linkedin"
        :href="alumni.linkedin"
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 text-neutral-600 hover:text-neutral-900 transition-colors"
        @click.stop
      >
        <UIcon name="i-heroicons-link" class="h-5 w-5" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Alumni } from '~/types/alumni'

interface Props {
  alumni: Alumni
}

defineProps<Props>()

defineEmits<{
  click: [id: string]
}>()
</script>
