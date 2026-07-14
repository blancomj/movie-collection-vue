<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">
      <i class="fas fa-heart text-red-500 mr-2"></i>Mis Favoritos
    </h1>

    <div v-if="loading" class="text-center py-20">
      <div class="inline-block w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="favoriteMovies.length === 0" class="text-center py-20 text-gray-500">
      <i class="fas fa-heart-broken text-5xl mb-4 block text-gray-300"></i>
      <p>No tienes peliculas favoritas aun.</p>
    </div>

    <MovieGrid v-else :movies="favoriteMovies" :grid-cols="ui.gridCols" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import { useFavoritesStore } from '@/stores/favorites'
import { useUiStore } from '@/stores/ui'
import MovieGrid from '@/components/movie/MovieGrid.vue'

const moviesStore = useMoviesStore()
const favorites = useFavoritesStore()
const ui = useUiStore()

const loading = computed(() => moviesStore.loading)

const favoriteMovies = computed(() =>
  moviesStore.movies.filter(m => favorites.isFavorite(m.tmdb_id))
)

onMounted(async () => {
  if (moviesStore.movies.length === 0) {
    await moviesStore.loadMovies()
  }
})
</script>