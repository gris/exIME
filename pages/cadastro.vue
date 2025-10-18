<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">IME Alumni</h1>
        <p class="text-gray-600">Instituto Militar de Engenharia</p>
      </div>
      
      <UCard>
        <div class="text-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Cadastro</h2>
          <p class="text-gray-600">Apenas por convite</p>
        </div>
        
        <SignUp 
          :appearance="{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none'
            }
          }"
          :routing="'path'"
          :path="'/cadastro'"
          :signInUrl="'/login'"
        />
      </UCard>
      
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Já tem uma conta? 
          <NuxtLink to="/login" class="text-green-600 hover:text-green-700 font-medium">
            Entrar
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: false
})
</script>


