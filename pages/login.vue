<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
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


