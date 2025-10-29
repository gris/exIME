<template>
  <UCard
    class="hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
    @click="$emit('click', alumni.id)"
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
