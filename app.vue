<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-1">
      <NuxtPage />
    </div>
    <footer class="bg-gray-50 border-t border-gray-200 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-600">
          <a 
            href="https://github.com/gris/exIME" 
            target="_blank" 
            rel="noopener noreferrer"
            class="hover:text-green-600 transition-colors"
          >
            desenvolvido
          </a>
          com ❤️ pela comunidade Comp IME
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'pt-BR'
  }
})
</script>

