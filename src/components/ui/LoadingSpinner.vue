<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="relative">
      <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p v-if="message" class="mt-4 text-gray-500 dark:text-gray-400 text-sm">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: 'Cargando...' }
})
</script>