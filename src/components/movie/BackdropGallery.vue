<template>
  <div v-if="backdrops.length" class="bg-white dark:bg-[#1e1e2f] rounded-card shadow-sm p-6 mb-6">
    <h2 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
      <i class="fas fa-images text-primary mr-2"></i>Fotogramas
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div
        v-for="(bd, i) in backdrops"
        :key="i"
        class="rounded-card overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <img
          :src="`https://image.tmdb.org/t/p/w780${bd.file_path}`"
          :alt="`Fotograma ${i + 1}`"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import client from '@/api/client'

const props = defineProps({
  tmdbId: { type: Number, required: true }
})

const backdrops = ref([])

onMounted(async () => {
  try {
    const data = await client.get(`/movies/tmdb/${props.tmdbId}/images`)
    backdrops.value = (data.backdrops || []).slice(0, 6)
  } catch (e) {
    console.error('Failed to load gallery:', e)
  }
})
</script>
