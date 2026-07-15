<template>
  <div>
    <div class="grid gap-4" :class="gridClass">
      <MovieCard v-for="movie in movies" :key="movie.tmdb_id" :movie="movie" />
    </div>
    <div v-if="movies.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500">
      <i class="fas fa-film text-5xl mb-4 block text-gray-300 dark:text-gray-600"></i>
      <p>No se encontraron peliculas</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  movies: { type: Array, default: () => [] },
  gridCols: { type: Number, default: 2 }
})

const gridClass = computed(() => {
  const colMap = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }
  return `grid-cols-2 ${colMap[props.gridCols] || 'md:grid-cols-2'} lg:grid-cols-4`
})
</script>
