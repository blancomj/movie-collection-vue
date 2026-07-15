<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">
      <i class="fas fa-eye text-red-500 mr-2"></i>Mis Vistas
    </h1>

    <LoadingSpinner v-if="watched.loading" message="Cargando peliculas vistas..." />

    <div v-else-if="watchedMovies.length === 0" class="text-center py-20 text-gray-500">
      <i class="fas fa-eye-slash text-5xl mb-4 block text-gray-300"></i>
      <p>No tienes peliculas marcadas como vistas aun.</p>
    </div>

    <MovieGrid v-else :movies="watchedMovies" :grid-cols="ui.gridCols" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import { useWatchedStore } from '@/stores/watched'
import { useUiStore } from '@/stores/ui'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import MovieGrid from '@/components/movie/MovieGrid.vue'

const moviesStore = useMoviesStore()
const watched = useWatchedStore()
const ui = useUiStore()

const watchedMovies = computed(() => watched.watchedMovies)

onMounted(async () => {
  await watched.load()
})
</script>
