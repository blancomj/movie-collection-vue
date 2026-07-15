<template>
  <div>
    <div
      class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    >
      <MovieCard v-for="movie in movies" :key="movie.tmdb_id" :movie="movie" />
    </div>
    <div v-if="movies.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500">
      <i class="fas fa-film text-5xl mb-4 block text-gray-300 dark:text-gray-600"></i>
      <p>No se encontraron peliculas</p>
    </div>
  </div>
</template>

<script setup>
import MovieCard from './MovieCard.vue'

defineProps({
  movies: { type: Array, default: () => [] },
  gridCols: { type: Number, default: 2 }
})
</script>