<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
    <SignIn 
      :routing="'path'"
      :path="'/login'"
    />
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: false
})
</script>


