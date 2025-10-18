<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-4 mb-2">
          <h1 class="text-4xl font-bold text-gray-900">IME Alumni</h1>
          <img 
            src="/images/ime-logo.png" 
            alt="IME Logo" 
            class="w-16 h-16 object-contain"
          />
        </div>
        <p class="text-gray-600">Instituto Militar de Engenharia</p>
      </div>
      
      <UCard>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-600 mb-2">Entrar</h2>
        <p class="text-gray-500">Acesse o diretório de alunos e ex-alunos</p>
      </div>
        
        <SignIn 
          :appearance="{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none'
            }
          }"
          :routing="'path'"
          :path="'/login'"
        />
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: false
})
</script>


