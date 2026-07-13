<template>
  <div class="bg-white dark:bg-[#1e1e2f] rounded-card shadow-sm p-6 mb-6">
    <h2 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
      <i class="fas fa-th-large text-primary mr-2"></i>Peliculas similares
    </h2>
    <div v-if="loading" class="text-center py-4">
      <div class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else-if="similar.length === 0" class="text-center py-4 text-gray-400 dark:text-gray-500 text-sm">
      No hay peliculas similares disponibles
    </div>
    <div v-else class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <div
        v-for="movie in similar"
        :key="movie.id"
        class="flex-shrink-0 w-32 cursor-pointer group"
        @click="router.push({ name: 'movie', params: { id: movie.id } })"
      >
        <div class="aspect-[2/3] rounded-card overflow-hidden bg-gray-100 dark:bg-gray-700 mb-1.5 relative">
          <img
            v-if="movie.poster_path"
            :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
            :alt="movie.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-700">
            <i class="fas fa-film text-white text-xl"></i>
          </div>
        </div>
        <p class="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{{ movie.title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSimilarMovies } from '@/api/movies'

const props = defineProps({
  tmdbId: { type: Number, required: true }
})

const router = useRouter()
const similar = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await getSimilarMovies(props.tmdbId)
    similar.value = data.results || []
  } catch (e) {
    console.error('Failed to load similar movies:', e)
  } finally {
    loading.value = false
  }
})
</script>